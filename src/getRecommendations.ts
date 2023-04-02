import { OpenAIApi } from "openai";

export async function getRecommendations(
  openAiClient: OpenAIApi,
  songs: string[]
): Promise<string[]> {
  // We ask for "relatively rare", otherwise ChatGPT is tempted to recommend super popular music - not interesting!
  const prompt = `Generate 5 relatively rare song recommendations based on the following songs:\n${songs.join(
    "\n"
  )}\n`;

  console.log(
    "STEP 2 - getRecommendations - Sending the following prompt to ChatGPT:"
  );
  console.log("========");
  console.log(prompt);
  console.log("========");

  const response = await openAiClient.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  if (!response.data.choices[0] || !response.data.choices[0].message?.content) {
    throw new Error("getRecommendations() - couldnt get choices");
  }

  // Formatting that been reliable thus far
  const recommendations = response.data.choices[0].message.content
    .trim()
    .split("\n")
    .map((r) => r.trim());

  return recommendations;
}
