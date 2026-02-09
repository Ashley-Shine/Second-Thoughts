// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ANALYZE_PROMPT") {
    const userPrompt = request.data;

    fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: userPrompt
      })
    })
      .then((res) => res.json())
      .then((data) => {
        sendResponse({
          aiResponse: data.ai_response,
          dependencyScore: data.dependency_score,
          regretLevel: data.regret_level
        });
      })
      .catch((error) => {
        sendResponse({
          error: "Backend error"
        });
      });

    // IMPORTANT: keep message channel open for async response
    return true;
  }
});
