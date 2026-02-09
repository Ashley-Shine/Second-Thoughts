// regretLogic.js

const topicStats = {};

const conceptualWords = [
  "why", "how", "explain", "derive",
  "reason", "prove", "difference"
];

const learningSignals = [
  "i am new",
  "beginner",
  "learning",
  "first time",
  "trying to learn"
];

function extractTopic(prompt) {
  const keywords = prompt
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter(w => w.length > 4)
    .slice(0, 2);

  return keywords.join("_") || "general";
}

function contains(words, prompt) {
  return words.some(w => prompt.toLowerCase().includes(w));
}

function getHumanMessage(dep) {
  if (dep <= 2) return "";

  if (dep <= 4)
    return "You’ve revisited this a few times. Try writing your own approach first 🙂";

  if (dep <= 6)
    return "You may be leaning on AI here. A short pause to think independently could help.";

  if (dep <= 8)
    return "This reliance pattern often reduces confidence during exams or interviews.";

  return "High dependency detected. Attempt this independently before continuing.";
}

export async function getResponse(prompt) {
  const topic = extractTopic(prompt);

  if (!topicStats[topic]) {
    topicStats[topic] = {
      usage: 0,
      dependency: 0
    };
  }

  const stats = topicStats[topic];
  stats.usage++;

  const isLearning = contains(learningSignals, prompt);
  const isConceptual = contains(conceptualWords, prompt);

  // 🟢 Beginner grace period
  if (isLearning && stats.usage <= 3) {
    stats.dependency = 0;
  } else {
    // 🔁 Increment only every 2 uses
    if (stats.usage >= 4 && stats.usage % 2 === 0) {
      stats.dependency += 1;
    }

    // 🧠 Conceptual acceleration (very gentle)
    if (isConceptual && stats.usage >= 6 && stats.usage % 3 === 0) {
      stats.dependency += 1;
    }
  }

  stats.dependency = Math.min(stats.dependency, 10);

  return {
    answer: `This is a sample AI response for: ${prompt}`,
    dependency: stats.dependency,
    regret: stats.dependency >= 6,
    message: getHumanMessage(stats.dependency)
  };
}
