import Discord from "discord.js";

export async function pullMessages(channel: Discord.TextChannel) {
  const messages = (await channel.messages.fetch({ limit: 50 })).reverse();
  const filteredMessages: string[] = [];

  for (const message of messages.values()) {
    let text = message.content.replace(/\n/g, " ").trim();
    if (
      message.embeds.length > 0 &&
      message.embeds[0].data &&
      message.embeds[0].data.title
    ) {
      text = message.embeds[0].data.title;
    }
    if (
      text !== "" &&
      message.author.bot === false && // Bots
      !text.startsWith("<") && // Emojis
      !text.startsWith("!") && // Bot commands etc
      !text.startsWith("http") && // URLs are useless (we already pull titles from embeds)
      text.length > 7 && // Rule out very short words
      text.length < 60 // Exclude long messages
    ) {
      filteredMessages.push("- " + text);
    }
  }

  return filteredMessages;
}
