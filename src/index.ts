import Discord, { Client, GatewayIntentBits } from "discord.js";
import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
import { validateEnv } from "./env";
import { pullMessages } from "./pullMessages";
import { findSongs } from "./findSongs";
import { getRecommendations } from "./getRecommendations";

dotenv.config();

const {
  DISCORD_TOKEN,
  GPT_API_KEY,
  GUILD_ID,
  MUSIC_CHANNEL_ID,
  MUSIC_CHANNEL_NAME,
  ADMIN_USER_ID,
  RECOMMEND_COMMAND,
} = validateEnv();

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const configuration = new Configuration({
  apiKey: GPT_API_KEY,
});
const openAiClient = new OpenAIApi(configuration);

async function main() {
  let musicChannel: Discord.TextChannel | undefined | null;
  await discordClient.login(DISCORD_TOKEN);

  discordClient.on("ready", async () => {
    console.log(`Logged in as ${discordClient.user?.tag}!`);

    // If you want to fetch channels
    const guild = await discordClient.guilds.fetch(GUILD_ID);
    const channels = await guild.channels.fetch();
    musicChannel = channels.get(MUSIC_CHANNEL_ID) as Discord.TextChannel;

    // Open a DM with the admin.
    // If you want to test this bot via DMs, opening this DM channel is neccessary, even if you have a DM interaction with the bot already.
    const admin = await discordClient.users.fetch(ADMIN_USER_ID);
    const adminDm = await admin.createDM();
    adminDm.send("Booted!");
  });

  discordClient.on("messageCreate", async (message) => {
    if (musicChannel && message.content === RECOMMEND_COMMAND) {
      let messages: string[] = [];
      try {
        // Despite starting with 50 messages, limit the list of songs to 25, to keep the prompt size down.
        // Also, after message filtering, we are very likely to have between 25-50 actual songs.
        // Always use the most recent messages.
        messages = await pullMessages(musicChannel);
        if (messages.length > 25) {
          messages = messages.slice(messages.length - 25, messages.length);
        }
      } catch (e) {
        console.error(e);
        message.reply(
          `Sorry - could not parse messages from #${MUSIC_CHANNEL_NAME} for some reason. There is probably some message or embed that my code hasn\'t been tested against.`
        );
        return;
      }
      if (messages.length === 0) {
        console.error("Zero discord messages");
        message.reply(
          `Sorry - could not pull messages from #${MUSIC_CHANNEL_NAME} for some reason.`
        );
        return;
      }

      let songs: string[] = [];
      try {
        songs = await findSongs(openAiClient, messages);
      } catch (e) {
        message.reply(
          `Sorry - ChatGPT failed to work out any songs from recent messages in #${MUSIC_CHANNEL_NAME}, so can't recommend anything right now.`
        );
        return;
      }

      if (songs.length === 0) {
        message.reply(
          `Sorry - ChatGPT failed to work out any songs from recent messages in #${MUSIC_CHANNEL_NAME}, so can't recommend anything right now.`
        );
        return;
      }

      let recommendations: string[] = [];
      try {
        recommendations = await getRecommendations(openAiClient, songs);
      } catch (e) {
        message.reply(
          `Sorry - ChatGPT was sent a prompt based on recent messages in #${MUSIC_CHANNEL_NAME}, but wasn't able to recommend anything right now.`
        );
        return;
      }

      // It worked! Reply with the recommendations
      message.reply(
        `ChatGPT did a thing: based on the last 50 messages from non-bots in #${MUSIC_CHANNEL_NAME}, here are some recommendations: \n${recommendations.join(
          "\n"
        )}`
      );
    }
  });
}

(async () => {
  await main();
})();
