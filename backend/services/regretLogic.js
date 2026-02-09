// regretLogic.js

const topicMap = {};
const topicMeta = {};

const conceptualWords = [
  "why", "how", "explain", "derive",
  "reason", "prove", "difference"
];

const learningSignals = [
  "i am new",
  "beginner",
  "learning",
  "i dont understand",
  "first time",
  "can you explain again"
];

function extractTopic(prompt) {
  return prompt
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter(w => w.length > 3)
    .slice(0, 4)
    .join("-");
}

function isConceptual(prompt) {
  const lower = prompt.toLowerCase();
  return conceptualWords.some(word => lower.includes(word));
}

function isLearning(prompt) {
  const lower = prompt.toLowerCase();
  return learningSignals.some(signal => lower.includes(signal));
}

export async function getResponse(prompt) {
  const topic = extractTopic(prompt);

  if (!topicMap[topic]) {
    topicMap[topic] = 1;
    topicMeta[topic] = { firstSeen: Date.now() };
  } else {
    topicMap[topic]++;
  }

  const usageCount = topicMap[topic];
  const conceptual = isConceptual(prompt);
  const learning = isLearning(prompt);

  let dependency = 0;

  // 🟢 Beginner safeguard
  if (learning || usageCount <= 2) {
    dependency = 0;
  } else {
    // 🔁 Progressive dependency growth (out of 10)
    if (usageCount === 3) dependency = 1;
    else if (usageCount === 4) dependency = 2;
    else if (usageCount === 5) dependency = 4;
    else if (usageCount >= 6) {
      dependency = 4 + (usageCount - 5); // gradual increase
    }

    // 🧠 Conceptual reliance adds small weight
    if (conceptual && usageCount >= 3) {
      dependency += 1;
    }

    dependency = Math.min(dependency, 10);
  }

  const regret = dependency >= 7;

  const message = regret
    ? "Pause for a moment and think about how you would approach this yourself 🙂"
    : "";

  return {
    answer: `This is a sample AI response for: ${prompt}`,
    dependency,
    regret,
    message
  };
}
