// src/copyToClipboard.js
document.addEventListener("DOMContentLoaded", function() {
  const preElements = document.querySelectorAll("pre");
  preElements.forEach((pre) => {
    const codeElement = pre.querySelector("code");
    if (codeElement) {
      const copyButton = document.createElement("button");
      copyButton.className = "copy-button";
      copyButton.innerHTML = "\u{1F4CB}";
      copyButton.setAttribute("title", "Copy to Clipboard");
      copyButton.addEventListener("click", () => {
        const textToCopy = codeElement.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
          copyButton.textContent = "Copied!";
          setTimeout(() => {
            copyButton.innerHTML = "\u{1F4CB}";
          }, 2e3);
        }).catch((err) => {
          console.error("Failed to copy text: ", err);
        });
      });
      pre.style.position = "relative";
      pre.appendChild(copyButton);
    }
  });
});
