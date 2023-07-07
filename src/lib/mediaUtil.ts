import { Awaitable } from "discord.js-selfbot-v13";
import { Readable } from "stream";
import ytdl from "ytdl-core";


export function ytdlAwaitable(url: string, options: ytdl.downloadOptions = {}) {
  return new Promise<Readable>((resolve, reject) => {
    ytdl(url, options)
      .on('error', (err) => reject(err))
      .on('readable', () => resolve(ytdl(url, options)));
  })
}