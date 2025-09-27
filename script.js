// EchoAI by JoyCode Studios â€” Markdown-enabled, model-swappable, mission-aware

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatLog = document.getElementById("chat");
  const message = input.value.trim();
  if (!message) return;

  renderMessage("user", message);
  input.value = "";

  if (typeof ECHOAI_KEY === "undefined" || !ECHOAI_KEY) {
    renderMessage("bot", "EchoAI is offline. API key is missing or not loaded.");
    console.warn("Missing API key: ECHOAI_KEY is undefined.");
    return;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ECHOAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.2-24b-instruct:free",
        messages: [
          {
            role: "system",
            content: "You are EchoAI, an assistant built by JoyCode Studios. Respond with precision, markdown clarity, and respect for user agency."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    if (response.status === 429) {
      renderMessage("bot", "EchoAI is cooling down. Too many requests â€” try again shortly.");
      console.warn("Rate limit hit: 429 Too Many Requests");
      return;
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      renderMessage("bot", "EchoAI couldnâ€™t process that. Check your model name or API key.");
      console.error("OpenRouter response error:", data);
      return;
    }

    const reply = data.choices[0].message.content;
    renderMessage("bot", reply);
    chatLog.scrollTop = chatLog.scrollHeight;

  } catch (error) {
    renderMessage("bot", "EchoAI encountered an error. Check your connection or try again.");
    console.error("Fetch error:", error);
  }
}

function renderMessage(role, text) {
  const chatLog = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = role;
  div.innerHTML = marked.parse(text); // Markdown to HTML
  chatLog.appendChild(div);
}

// ðŸ”‘ Enter key triggers sendMessage
document.getElementById("userInput").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});