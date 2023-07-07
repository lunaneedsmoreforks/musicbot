import { Awaitable } from "discord.js-selfbot-v13";
import { Readable } from "stream";
import ytdl from "ytdl-core";


export function ytdlAsync(url: string, options?: ytdl.downloadOptions, progressCallback?: (chunkLength: number, downloaded: number, total: number) => void): Awaitable<Readable> {
  return new Promise((resolve, reject) => {
    let stream = ytdl(url, options)
      .on("progress", (chunkLength: number, downloaded: number, total: number) => {
        
        if (progressCallback) (progressCallback as any)(...arguments);
        if (downloaded >= total) resolve(stream);
      })
      .on("error", reject)
  })
}