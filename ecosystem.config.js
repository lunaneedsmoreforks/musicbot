module.exports = {
  apps: [{
      name: "musicbot",
      script: "./out/src/index.js",
      log_file: "musicbot.log",
  }],

  deploy: {
      server: {
          user: "luna",
          host: "dad.lvna.me",
          ref: "origin/main",
          repo: "git@github.com:lunaneedsmoreforks/musicbot.git",
          path: "/home/luna/servers/musicbot",
          "post-deploy": "yarn install && yarn build && pm2 startOrRestart ecosystem.config.js"
      }
  }
}