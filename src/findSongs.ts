import { OpenAIApi } from "openai";

// So far, ChatGPT has come up with this structure when reponding to the first (get songs from messages) prompt
interface Song {
  artist: string;
  song: string;
}

export async function findSongs(
  openAiClient: OpenAIApi,
  messages: string[]
): Promise<string[]> {
  const songs: string[] = [];
  const mainPrompt =
    "Find real Artist and Song combinations found in within following list of messages. Your output should be a list of the artist and song combinations, in json.";

  const prompt = `${mainPrompt}\n\n${messages.join("\n")}`;

  console.log("STEP 1 - findSongs - Sending the following prompt to ChatGPT:");
  console.log("========");
  console.log(prompt);
  console.log("========");

  const response = await openAiClient.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  if (!response.data.choices[0] || !response.data.choices[0].message?.content) {
    throw new Error("findSongs() - couldnt get choices");
  }

  let matches: Song[] = [];

  try {
    matches = JSON.parse(response.data.choices[0].message?.content) as {
      artist: string;
      song: string;
    }[];
  } catch (e) {
    throw new Error("ChatGPT couldn't work out any songs from recent messages");
  }

  if (!matches || matches.length === 0) {
    throw new Error("ChatGPT couldn't work out any songs from recent messages");
  }

  for (const match of matches) {
    // ChatGPT doesn't always return both fields, it sometimes gets things a bit wrong
    if (match.artist && match.song) {
      songs.push(`${match.artist} - ${match.song}`);
    }
  }

  return songs;
}
