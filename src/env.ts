export function validateEnv() {
  const {
    DISCORD_TOKEN,
    GPT_API_KEY,
    GUILD_ID,
    MUSIC_CHANNEL_ID,
    MUSIC_CHANNEL_NAME,
    ADMIN_USER_ID,
    RECOMMEND_COMMAND,
  } = process.env;

  if (
    !DISCORD_TOKEN ||
    !GPT_API_KEY ||
    !GUILD_ID ||
    !MUSIC_CHANNEL_ID ||
    !MUSIC_CHANNEL_NAME ||
    !ADMIN_USER_ID ||
    !RECOMMEND_COMMAND
  ) {
    throw new Error("All env vars are required");
  }

  return {
    DISCORD_TOKEN,
    GPT_API_KEY,
    GUILD_ID,
    MUSIC_CHANNEL_ID,
    MUSIC_CHANNEL_NAME,
    ADMIN_USER_ID,
    RECOMMEND_COMMAND,
  };
}
