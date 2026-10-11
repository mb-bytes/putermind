// DOM Elements
const loginView = document.getElementById("login-view");
const chatView = document.getElementById("chat-view");
const loginBtn = document.getElementById("login-btn");
const signoutBtn = document.getElementById("signout-btn");
const infoBtn = document.getElementById("info-btn");
const chatArea = document.getElementById("chat-area");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const modelSelect = document.getElementById("model-select");
const modeToggleBtn = document.getElementById("mode-toggle-btn");
const attachBtn = document.getElementById("attach-btn");
const fileInput = document.getElementById("file-input");
const filePreview = document.getElementById("file-preview-area");
const fileNameDisplay = document.getElementById("file-name");
const removeFileBtn = document.getElementById("remove-file-btn");
const clearChatBtn = document.getElementById("clear-chat-btn");

// AI Models
const defaultModels = [
  { id: "gemini-2.5-flash", name: "Gemini" },
  { id: "gpt-5.4-nano", name: "OpenAI GPT" },
  { id: "claude-sonnet-5-5", name: "Claude" },
  { id: "grok-4.5", name: "Grok (xAI)" },
];

let currentModel = defaultModels[0].id;
let isLoading = false;
let currentFile = null;
let chatHistory = [];
let isImageMode = false;

async function init() {
  if (window.puter && window.puter.auth && window.puter.auth.isSignedIn()) {
    showChat();
  } else {
    showLogin();
  }
}

//Login before accessing chat
function showLogin() {
  loginView.classList.remove("hidden");
  chatView.classList.add("hidden");
}

//Show chat after login
async function showChat() {
  loginView.classList.add("hidden");
  chatView.classList.remove("hidden");

  // Animate only the chat container, not the nav
  const chatContainer = document.querySelector(".chat-container");
  chatContainer.classList.add("slide-in-up");
  setTimeout(() => chatContainer.classList.remove("slide-in-up"), 600);

  loadModels();

  const history = await loadChatHistory();
  if (history.length > 0) {
    history.forEach((msg) => addMessage(msg.role, msg.content, true));
  } else {
    addMessage("assistant", "Hello, What would you like to know?");
  }
}

// File handling
attachBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  currentFile = file;
  fileNameDisplay.textContent = file.name;
  filePreview.classList.remove("hidden");
  messageInput.focus();
});

removeFileBtn.addEventListener("click", () => {
  currentFile = null;
  fileInput.value = "";
  filePreview.classList.add("hidden");
});

// Read text files
const readTextFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// Extract text from PDF
async function readPdfFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    text += `--- Page ${i} ---\n${pageText}\n\n`;
  }

  return text;
}

// Extract text from Word documents, used mammoth here
async function readDocxFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// Read any document type
async function extractFileText(file) {
  const type = file.type;
  const name = file.name.toLowerCase();

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    return await readPdfFile(file);
  } else if (
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return await readDocxFile(file);
  } else {
    return await readTextFile(file);
  }
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  const clean = [];
  for (const msg of history) {
    if (!msg || !msg.content || !msg.role) continue;
    if (msg.role !== "user" && msg.role !== "assistant") continue;
    if (clean.length === 0 && msg.role !== "user") continue;
    if (clean.length > 0 && clean[clean.length - 1].role === msg.role) continue;
    clean.push({ role: msg.role, content: msg.content });
  }
  return clean;
}

// Save chat to cloud
async function saveChatHistory() {
  try {
    await puter.kv.set("chat_history", JSON.stringify(chatHistory));
  } catch (e) {
    console.error("Failed to save chat history:", e);
  }
}

async function loadChatHistory() {
  try {
    const data = await puter.kv.get("chat_history");
    if (data) {
      chatHistory = sanitizeHistory(JSON.parse(data));
      return chatHistory;
    }
  } catch (e) {
    console.error("Failed to load chat history:", e);
  }
  chatHistory = [];
  return [];
}

async function clearChatHistory() {
  chatHistory = [];
  try {
    await puter.kv.del("chat_history");
  } catch (e) {
    console.error("Failed to clear chat history:", e);
  }
}

// Main chat form handler
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();

  if ((!text && !currentFile) || isLoading) return;

  messageInput.value = "";
  filePreview.classList.add("hidden");
  toggleLoading(true);

  // Show user message
  let userDisplayText = text;
  if (currentFile && currentFile.type.startsWith("image/")) {
    userDisplayText = `[Attached Image: ${currentFile.name}] ${text}`;
  } else if (currentFile) {
    userDisplayText = `[Attached File: ${currentFile.name}] ${text}`;
  }
  addMessage("user", userDisplayText);

  const aiBubble = addMessage("assistant", "");

  // Image generation mode
  if (isImageMode) {
    aiBubble.innerHTML = `<span class="generating-text">Generating image...</span>`;

    try {
      const generatedImage = await generateImage(text);
      aiBubble.innerHTML = "";

      const imageContainer = document.createElement("div");
      imageContainer.className = "generated-image-container";
      imageContainer.appendChild(generatedImage);
      aiBubble.appendChild(imageContainer);

      const caption = document.createElement("p");
      caption.style.marginTop = "0.5rem";
      caption.style.fontSize = "0.85rem";
      caption.style.opacity = "0.8";
      caption.textContent = `Generated: "${text}"`;
      aiBubble.appendChild(caption);

      scrollToBottom();
    } catch (error) {
      console.error(error);
      aiBubble.textContent =
        "Error generating image: " +
        (error.message || "Failed to generate. Please try again.");
    } finally {
      toggleLoading(false);
    }
    return;
  }

  // Chat mode
  aiBubble.innerHTML = `<span class="thinking-text">AI is thinking...</span>`;

  try {
    let response;

    if (currentFile) {
      const prompt = text || "Please analyze this file.";

      if (currentFile.type.startsWith("image/")) {
        aiBubble.innerHTML = `<span class="thinking-text">Analyzing image...</span>`;
        response = await puter.ai.chat(prompt, currentFile, {
          model: currentModel,
          stream: true,
        });
      } else {
        aiBubble.innerHTML = `<span class="thinking-text">Reading ${currentFile.name}...</span>`;
        const fileContent = await extractFileText(currentFile);
        const fullPrompt = `${prompt}\n\n--- Content of ${currentFile.name} ---\n${fileContent}`;

        const messages = sanitizeHistory([
          ...chatHistory,
          { role: "user", content: fullPrompt },
        ]);

        response = await puter.ai.chat(messages, {
          model: currentModel,
          stream: true,
        });
      }
    } else {
      let promptToSend = text;
      const detectedUrl = extractUrl(text);

      if (detectedUrl) {
        aiBubble.innerHTML = `<span class="thinking-text">Browsing web page...</span>`;
        const webText = await fetchWebPage(detectedUrl);
        if (webText) {
          promptToSend = `${text}\n\n--- Web page content from ${detectedUrl} ---\n${webText}`;
        }
      } else if (shouldSearchWeb(text)) {
        aiBubble.innerHTML = `<span class="thinking-text">Searching the web...</span>`;
        const searchInfo = await fetchWebSearch(text);
        if (searchInfo) {
          promptToSend = `${text}\n\n--- Real-time web search results ---\n${searchInfo}`;
        }
      }

      const messages = sanitizeHistory([
        ...chatHistory,
        { role: "user", content: promptToSend },
      ]);

      const isGpt = currentModel.startsWith("gpt") || currentModel.includes("openai");
      const chatOptions = {
        model: currentModel,
        stream: true,
      };

      if (isGpt && !detectedUrl) {
        chatOptions.tools = [{ type: "web_search" }];
      }

      try {
        response = await puter.ai.chat(messages, chatOptions);
      } catch (err) {
        if (chatOptions.tools) {
          delete chatOptions.tools;
          response = await puter.ai.chat(messages, chatOptions);
        } else {
          throw err;
        }
      }
    }

    currentFile = null;
    fileInput.value = "";

    let fullContent = "";
    let firstChunk = true;

    for await (const part of response) {
      const chunkText = part?.text || part?.content || "";
      if (!chunkText) continue;
      if (firstChunk) {
        aiBubble.innerHTML = "";
        firstChunk = false;
      }
      fullContent += chunkText;
      if (typeof marked !== "undefined") {
        aiBubble.innerHTML = marked.parse(fullContent);
      } else {
        aiBubble.innerText = fullContent;
      }
      scrollToBottom();
    }

    if (fullContent) {
      chatHistory.push({ role: "user", content: userDisplayText });
      chatHistory.push({ role: "assistant", content: fullContent });
      saveChatHistory();
    }
  } catch (error) {
    console.error(error);
    aiBubble.textContent =
      "Error: " + (error.message || "Failed to connect. Try another model.");
  } finally {
    toggleLoading(false);
  }
});

// Helper functions
function extractUrl(str) {
  const match = str.match(
    /https?:\/\/[^\s]+|(?:www\.)?[a-zA-Z0-9-]+\.(?:com|org|net|io|ai|co|in|app|dev|xyz|info|edu|gov)(?:\/[^\s]*)?/i
  );
  if (!match) return null;
  let url = match[0];
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

async function fetchWebPage(url) {
  try {
    const res = await puter.net.fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const unwanted = doc.querySelectorAll(
      "script, style, noscript, svg, nav, footer, header, iframe"
    );
    unwanted.forEach((el) => el.remove());
    const text = (doc.body?.innerText || doc.body?.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
    return text ? text.slice(0, 3500) : null;
  } catch (e) {
    return null;
  }
}

async function fetchWebSearch(query) {
  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en`;
    const res = await puter.net.fetch(rssUrl, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const xml = await res.text();
    const items = [
      ...xml.matchAll(
        /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<pubDate>(.*?)<\/pubDate>/g
      ),
    ];
    if (!items.length) return null;
    return items
      .slice(0, 5)
      .map((it) => `- ${it[1]} (${it[2]})`)
      .join("\n");
  } catch (e) {
    return null;
  }
}

function shouldSearchWeb(text) {
  return /\b(latest|news|today|current|happening|update|weather|live|recent|who won|score)\b/i.test(
    text
  );
}

function addMessage(role, text) {
  const row = document.createElement("div");
  row.className = `message-row ${role}`;
  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  if (text)
    bubble.innerHTML =
      typeof marked !== "undefined" ? marked.parse(text) : text;
  row.appendChild(bubble);
  chatArea.appendChild(row);
  scrollToBottom();
  return bubble;
}

function scrollToBottom() {
  chatArea.scrollTop = chatArea.scrollHeight;
}

function toggleLoading(loading) {
  isLoading = loading;
  sendBtn.disabled = loading;
  messageInput.disabled = loading;
  if (!loading) messageInput.focus();
}

async function loadModels() {
  modelSelect.innerHTML = "";
  defaultModels.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.innerText = m.name;
    modelSelect.appendChild(opt);
  });
  modelSelect.value = currentModel;
}

modelSelect.addEventListener("change", (e) => {
  currentModel = e.target.value;
});

// Change between Chat and Image mode
modeToggleBtn.addEventListener("click", () => {
  isImageMode = !isImageMode;
  const icon = modeToggleBtn.querySelector("i");
  const label = modeToggleBtn.querySelector(".mode-label");

  if (isImageMode) {
    modeToggleBtn.classList.add("image-mode");
    icon.className = "fa-solid fa-image";
    label.textContent = "Image";
    modeToggleBtn.title = "Switch to Chat Mode";
    messageInput.placeholder = "Describe the image..";
  } else {
    modeToggleBtn.classList.remove("image-mode");
    icon.className = "fa-solid fa-comment";
    label.textContent = "Chat";
    modeToggleBtn.title = "Switch to Image Mode";
    messageInput.placeholder = "Type your message...";
  }
});

// Generate image from text
async function generateImage(prompt) {
  try {
    const image = await puter.ai.txt2img(prompt, {
      model: "gpt-image-2",
      quality: "low",
    });
    return image;
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
}

messageInput.addEventListener("input", () => {
  sendBtn.disabled = (!messageInput.value.trim() && !currentFile) || isLoading;
});

// Authentication
loginBtn.addEventListener("click", async () => {
  try {
    await puter.auth.signIn();
    showChat();
  } catch (e) {
    alert("Sign-in unsuccessful, Try again");
  }
});

signoutBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to sign out?")) {
    clearChatHistory();
    puter.auth.signOut();
    showLogin();
    chatArea.innerHTML = "";
  }
});

infoBtn.addEventListener("click", async () => {
  alert(
    "To check remaining credits log-in to www.puter.com and go to profile section/settings"
  );
});

// Clear chat button
clearChatBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all chat history?")) {
    clearChatHistory();
    chatArea.innerHTML = "";
    addMessage("assistant", "Chat cleared. How can I help you?");
  }
});

// Nav Switch Animations
const navHome = document.getElementById("nav-home");
const navFeatures = document.getElementById("nav-features");
const navAbout = document.getElementById("nav-about");
const heroContent = document.querySelector(".hero-content");
const featuresSection = document.querySelector(".feature-content");
const aboutSection = document.getElementById("about-sec");
const heroFooter = document.querySelector(".hero-footer");

navFeatures.addEventListener("click", (e) => {
  e.preventDefault();
  navHome.classList.remove("nav-active");
  navFeatures.classList.add("nav-active");
  navAbout.classList.remove("nav-active");

  if (!heroContent.classList.contains("hidden"))
    heroContent.classList.add("slide-out");
  if (!featuresSection.classList.contains("hidden"))
    featuresSection.classList.add("slide-out");
  if (!aboutSection.classList.contains("hidden"))
    aboutSection.classList.add("slide-out");
  heroFooter.classList.add("slide-out");

  setTimeout(() => {
    heroContent.classList.add("hidden");
    heroContent.classList.remove("slide-out");
    aboutSection.classList.add("hidden");
    aboutSection.classList.remove("slide-out");
    heroFooter.classList.add("hidden");
    heroFooter.classList.remove("slide-out");
    featuresSection.classList.remove("hidden");
    featuresSection.classList.add("slide-in");
    setTimeout(() => featuresSection.classList.remove("slide-in"), 500);
  }, 500);
});

navHome.addEventListener("click", (e) => {
  e.preventDefault();
  navFeatures.classList.remove("nav-active");
  navHome.classList.add("nav-active");
  navAbout.classList.remove("nav-active");

  if (!featuresSection.classList.contains("hidden"))
    featuresSection.classList.add("slide-out");
  if (!aboutSection.classList.contains("hidden"))
    aboutSection.classList.add("slide-out");

  setTimeout(() => {
    featuresSection.classList.add("hidden");
    featuresSection.classList.remove("slide-out");
    aboutSection.classList.add("hidden");
    aboutSection.classList.remove("slide-out");
    heroContent.classList.remove("hidden");
    heroContent.classList.add("slide-in");
    heroFooter.classList.remove("hidden");
    heroFooter.classList.add("slide-in");
    setTimeout(() => {
      heroContent.classList.remove("slide-in");
      heroFooter.classList.remove("slide-in");
    }, 500);
  }, 500);
});

navAbout.addEventListener("click", (e) => {
  e.preventDefault();
  navHome.classList.remove("nav-active");
  navFeatures.classList.remove("nav-active");
  navAbout.classList.add("nav-active");

  if (!heroContent.classList.contains("hidden"))
    heroContent.classList.add("slide-out");
  if (!featuresSection.classList.contains("hidden"))
    featuresSection.classList.add("slide-out");
  heroFooter.classList.add("slide-out");

  setTimeout(() => {
    heroContent.classList.add("hidden");
    heroContent.classList.remove("slide-out");
    featuresSection.classList.add("hidden");
    featuresSection.classList.remove("slide-out");
    heroFooter.classList.add("hidden");
    heroFooter.classList.remove("slide-out");
    aboutSection.classList.remove("hidden");
    aboutSection.classList.add("slide-in");
    setTimeout(() => aboutSection.classList.remove("slide-in"), 500);
  }, 500);
});

init();
