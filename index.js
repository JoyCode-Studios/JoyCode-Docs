const editor = document.getElementById("editor");
const output = document.getElementById("output");

editor.addEventListener("input", () => {
  const userText = editor.value;
  if (!userText.trim()) {
    output.innerText = "Start typing to see your text.";
    return;
  }

  output.innerText = userText;
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