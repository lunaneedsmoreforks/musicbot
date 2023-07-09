module.exports = {
  apps: [{
      name: "selfbot",
      script: "./out/src/index.js",
      log_file: "selfbot.log",
  }],

  deploy: {
      server: {
          user: "aenri",
          host: process.env.SERVER_IP,
          ref: "origin/main",
          repo: "git@github.com:chimera-organization/selfbot.git",
          path: "/home/aenri/stack/selfbot",
          "post-deploy": "yarn install && yarn build && pm2 startOrRestart ecosystem.config.js"
      }
  }
}