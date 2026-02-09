// regretLogic.js

const topicMap = {};

function extractTopic(prompt) {
  return prompt.toLowerCase().slice(0, 40); // simple topic key
}

export async function getResponse(prompt) {
  const topic = extractTopic(prompt);

  if (!topicMap[topic]) {
    topicMap[topic] = 1;
  } else {
    topicMap[topic]++;
  }

  const dependency = topicMap[topic];

  const regret = dependency >= 3;

  const message = regret
    ? "Try solving part of it yourself before asking again 🙂"
    : "";

  return {
    answer: `This is a sample AI response for: ${prompt}`,
    dependency,
    regret,
    message
  };
}
