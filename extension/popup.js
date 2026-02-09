document.addEventListener("DOMContentLoaded", () => {

  const sendBtn = document.getElementById("sendBtn");
  const inputEl = document.getElementById("userInput");
  const chat = document.getElementById("chat");

  function timeNow(){
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function appendUserBubble(text){
    const bubble = document.createElement("div");
    bubble.className = "bubble user";
    bubble.textContent = text;

    const meta = document.createElement("span");
    meta.className = "meta";
    meta.textContent = timeNow();

    bubble.appendChild(meta);
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
  }

  function appendBotBubble(){
    const bubble = document.createElement("div");
    bubble.className = "bubble bot";

    const answer = document.createElement("div");
    answer.textContent = "Thinking...";

    const bar = document.createElement("div");
    bar.className = "progress-bar";

    const inner = document.createElement("div");
    inner.className = "progress-bar-inner";

    bar.appendChild(inner);
    bubble.appendChild(answer);
    bubble.appendChild(bar);

    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;

    return { bubble, answer, inner };
  }

  /* ---------- Local dependency logic ---------- */

  const conceptualWords = ["why","how","explain","derive","reason","prove"];
  function isConceptual(text){
    return conceptualWords.some(w => text.toLowerCase().includes(w));
  }

  function computeDependency(prompt){
    const key = prompt.toLowerCase().slice(0,20);
    const map = JSON.parse(localStorage.getItem("topicMap") || "{}");
    map[key] = (map[key] || 0) + 1;
    localStorage.setItem("topicMap", JSON.stringify(map));

    let score = map[key];
    if(isConceptual(prompt)) score += 2;
    return Math.min(score, 10);
  }

  function sendPrompt(prompt){
    appendUserBubble(prompt);
    const { bubble, answer, inner } = appendBotBubble();

    chrome.runtime.sendMessage(
      { action: "ASK_AI", prompt },
      (response) => {

        let score;

        if (chrome.runtime.lastError || !response) {
          score = computeDependency(prompt);
          answer.textContent = "Simulated response for: " + prompt;
        } else {
          answer.textContent = response.answer || "No reply";
          score = Number(response.dependency) || computeDependency(prompt);
        }

        const percent = Math.min(score * 10, 100);
        inner.style.width = percent + "%";

        if (score >= 7) {
          inner.style.background = "#ff4d4d";
          bubble.classList.add("high-risk");
        } else if (score > 4) {
          inner.style.background = "#ffd54f";
          bubble.classList.add("medium-risk");
        }
      }
    );
  }

  sendBtn.addEventListener("click", () => {
    const text = inputEl.value.trim();
    if (text) {
      sendPrompt(text);
      inputEl.value = "";
    }
  });

  inputEl.addEventListener("keydown", e => {
    if (e.key === "Enter") sendBtn.click();
  });

});
