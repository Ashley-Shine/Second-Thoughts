export async function getResponse(prompt, dependency) {
  let regret = false;
  let message = "";

  if (dependency >= 3) {
    regret = true;
    message = "Try attempting this yourself before seeing the answer.";
  }

  // mock AI response for now
  return {
    answer: "This is a sample AI response for: " + prompt,
    regret,
    message
  };
}
