// popup.js

document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const promptInput = document.getElementById("promptInput");

  const aiResponseBox = document.getElementById("aiResponse");
  const dependencyBox = document.getElementById("dependencyScore");
  const regretBox = document.getElementById("regretLevel");

  analyzeBtn.addEventListener("click", () => {
    const prompt = promptInput.value.trim();

    if (!prompt) {
      aiResponseBox.innerText = "Please enter a prompt.";
      return;
    }

    aiResponseBox.innerText = "Analyzing...";
    dependencyBox.innerText = "";
    regretBox.innerText = "";

    // Send prompt to background.js
    chrome.runtime.sendMessage(
      {
        action: "ANALYZE_PROMPT",
        data: prompt
      },
      (response) => {
        if (chrome.runtime.lastError) {
          aiResponseBox.innerText = "Error connecting to background.";
          return;
        }

        if (!response || response.error) {
          aiResponseBox.innerText = "Analysis failed.";
          return;
        }

        // Display results
        aiResponseBox.innerText = response.aiResponse;
        dependencyBox.innerText = `AI Dependency Score: ${response.dependencyScore}`;
        regretBox.innerText = `Regret Risk: ${response.regretLevel}`;
      }
    );
  });
});
