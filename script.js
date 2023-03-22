const API_URL = "https://api.openai.com/v1/chat/completions";
const apiKeyInput = document.getElementById("apiKeyInput");
const modelSelect = document.getElementById("modelSelect");
const contextInput = document.getElementById("contextInput");
const userInput = document.getElementById("userInput");

let MODEL = "gpt-4";

modelSelect.addEventListener("change", () => {
  MODEL = modelSelect.value;
});

let messageHistory = [
  {
    role: "system",
    content: contextInput.value,
  },
];

// Mettre à jour le contexte lorsqu'il est modifié
contextInput.addEventListener("input", () => {
  messageHistory[0].content = contextInput.value;
});

async function sendMessage(userMessage) {
  messageHistory.push({ role: "user", content: userMessage });

  const data = {
    model: MODEL,
    messages: messageHistory,
  };

  const API_KEY = apiKeyInput.value.trim();

  if (!API_KEY) {
    alert("Veuillez entrer votre clé API");
    return;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const json = await response.json();
    return json.choices[0].message.content;
  } else {
    throw new Error(`Erreur API: ${response.status}`);
  }
}

function appendMessage(content, role) {
  const messagesDiv = document.getElementById("messages");
  const message = document.createElement("p");
  message.innerText = `${role}: ${content}`;
  messagesDiv.appendChild(message);
}

userInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const userMessage = userInput.value.trim();
    if (userMessage) {
      appendMessage(userMessage, "Vous");
      userInput.value = "";

      try {
        const assistantResponse = await sendMessage(userMessage);
        messageHistory.push({ role: "assistant", content: assistantResponse });
        appendMessage(assistantResponse, "Assistant");
      } catch (error) {
        console.error(error);
      }
    }
  }
});

// Fonction pour copier le texte dans le presse-papier
function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function appendMessage(content, role) {
  const messagesDiv = document.getElementById("messages");

  if (role === "Assistant") {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("assistantMessage");
    
    const message = document.createElement("p");
    message.innerText = `${role}: ${content}`;
    messageContainer.appendChild(message);
    
    const copyButton = document.createElement("button");
    copyButton.innerText = "Copier";
    copyButton.classList.add("copyButton");
    copyButton.onclick = () => copyToClipboard(content);
    messageContainer.appendChild(copyButton);
    
    messagesDiv.appendChild(messageContainer);
  } else {
    const message = document.createElement("p");
    message.innerText = `${role}: ${content}`;
    messagesDiv.appendChild(message);
  }
}
