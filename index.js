const editor = document.getElementById("editor");
const echoaiOutput = document.getElementById("echoai-output");

editor.addEventListener("input", async () => {
  const userText = editor.value;
  if (!userText.trim()) {
    echoaiOutput.innerText = "Start typing to see suggestions.";
    return;
  }

  echoaiOutput.innerText = "EchoAI is thinking…";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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" // ← Insert your OpenRouter key
      },
      body: JSON.stringify({
        model: "mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: "You are EchoAI, a writing assistant that improves clarity, grammar, and tone."
          },
          {
            role: "user",
            content: `Improve this writing:\n\n${userText}`
          }
        ]
      })
    });

    const data = await response.json();
    const improvedText = data.choices?.[0]?.message?.content || "No suggestion returned.";
    echoaiOutput.innerText = improvedText;
  } catch (error) {
    echoaiOutput.innerText = "EchoAI failed to respond. Check your API key or network.";
    console.error("EchoAI error:", error);
  }
});

function isEditorEmpty() {
  const text = editor.value.trim();
  if (!text) {
    alert("You need to type something before exporting.");
    return true;
  }
  return false;
}

function exportText() {
  if (isEditorEmpty()) return;
  const text = editor.value;
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "joycode-doc.txt";
  link.click();
}

function exportPDF() {
  if (isEditorEmpty()) return;
  const text = editor.value;
  const win = window.open("", "", "height=700,width=700");
  win.document.write("<pre>" + text + "</pre>");
  win.document.close();
  win.print();
}

function exportDocx() {
  if (isEditorEmpty()) return;
  const text = editor.value;
  const blob = new Blob([text], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "joycode-doc.docx";
  link.click();
}