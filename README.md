# ChatGPT Discord Music Recommendation Bot

Recommends new music by reading music posts in a particular Discord channel, powered by ChatGPT.

Prototypal implementation that uses `gpt-3.5-turbo` and is currently only set up to run via `ts-node`.

## Run the bot

1. Clone the project

2. Create a `.env` in the project root, define all the environment variables:

```
DISCORD_TOKEN=<Your Discord bot's token>
GPT_API_KEY=<Your OpenAI key for ChatGPT>
GUILD_ID=<Your Discord server (aka guild) ID>
MUSIC_CHANNEL_ID=<Channel ID that contains music-related text posts>
MUSIC_CHANNEL_NAME=<Channel Name that contains music-related text posts>
ADMIN_USER_ID=<Discord ID for the bot admin>
RECOMMEND_COMMAND=<Command that triggers the recommendation, e.g. !music-recommend>
```

3. Boot the bot (uses ts-node): `yarn start`

4. Trigger a recommendation by sending either a DM to the bot or a message in the music channel, using the value you supplied for `RECOMMEND_COMMAND`, e.g `!music-recommend`
   
If all went well, the bot should reply to your message with some recommendations:

```blockquote
   ChatGPT did a thing: based on the last 50 messages from non-bots in #music, here are some recommendations: 
   1. Nosaj Thing - Sisters
   2. Jlin - BuZilla
   3. Holly Herndon - Frontier
   4. Ryoji Ikeda - Data.Matrix
   5. Gacha Bakradze - Toulouse
```
