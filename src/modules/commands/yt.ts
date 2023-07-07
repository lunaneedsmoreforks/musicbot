import { owners } from "../../config";
import { Command } from "../../lib/command";
import { ArgumentParser } from "argparse";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import { Message } from "discord.js-selfbot-v13";


export default new Command({
  aliases: ['yt', 'youtube'],
  name: 'yt',
  description: 'Download a youtube video',
  usage: '+yt <url>',
  callback: async (context) => {
    if (!context.args) return;
    if (!owners.includes(context.caller.id)) return;

    let argparse = new ArgumentParser({
      description: 'Download a youtube video'
    })
    argparse.add_argument('url', {
      help: 'The url of the video to download'
    })
    argparse.add_argument('-f', '--format', {
      help: 'The format to download the video in',
      default: 'highest'
    })
    argparse.add_argument('-o', '--output', {
      help: 'The output format to send the video as',
      default: 'mp4'
    })

    let args: {
      url: string,
      format: string,
      output: string
    } = argparse.parse_args(context.args);

    if (!ytdl.validateURL(args.url)) {
      await context.channel.send('Invalid URL');
      return;
    }

    let output: string[] = [];
    let message: Message | null = null;
    let editTimeout: number = 500;
    let editLastTime: number = 0;

    async function updateMessage() {
      if (!message && output.length == 0) return;
      if (!message) {
        message = await context.channel.send(`\`\`\`\n${output.join('\n')}\n\`\`\``);
        return;
      }
      message.edit(`\`\`\`\n${output.join('\n')}\n\`\`\``);
    }
    async function maybeUpdate() {
      if (editLastTime + editTimeout < Date.now()) {
        editLastTime = Date.now();
        await updateMessage();
      }
    }
    output.push(`<Downloading \`${args.url}\`...>`);
    await maybeUpdate();
    let buffer = await ytdl(args.url, {
      quality: args.format
    });
    let out: any[] = [];
    buffer.on("data", (data) => {
      out.push(data);
    })
    buffer.on("end", async () => {
      output.push(`<Finished downloading!>`);
      await maybeUpdate();
      // await convert();
    });
    
    // async function convert() {
    //   output.push(`<Converting to \`${args.output}\`...>`);
    //   await maybeUpdate();
    //   let buffer = Buffer.concat(out);
    //   let proc = ffmpeg(buffer)
    //     .format(args.output)
    //     .pipe();
    //   proc.on('progress', (progress) => {
    //       output.push(`[${progress.percent}%] ${progress.targetSize}kb converted`);
    //       maybeUpdate();
    //     })
    //   proc.on('data', (data) => {
    //       out.push(data);
    //     })
    //   proc.on('end', async () => {
    //       output.push(`<Finished!>`);
    //       await maybeUpdate();
    //       await context.channel.send({
    //         files: [{
    //           name: `video.${args.output}`,
    //           attachment: Buffer.concat(out)
    //         }]
    //       })
    //     })
    // }
    
    
  }
});
