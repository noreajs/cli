import { Command, flags } from "@oclif/command";
import execa = require("execa");
import { green, red, yellow, cyan } from "colors";
import { exists, existsSync, writeFileSync } from "fs";

export default class Start extends Command {
  static description = "start application";

  static flags = {
    help: flags.help({ char: "h" }),
    // env
    env: flags.string({
      char: "e",
      description: "application environnement",
      options: ["local", "production", "development"],
      exclusive: ["local", "production", "development"],
      default: (ctx) => {
        // local
        if (ctx.flags.local) {
          return "local";
        }

        // development
        if (ctx.flags.development) {
          return "development";
        }

        // production
        if (ctx.flags.production) {
          return "production";
        }

        return undefined;
      },
    }),

    // port
    port: flags.string({
      description: "application port",
    }),

    // local environnement
    local: flags.boolean({
      char: "l",
      description: "local environnement",
      default: false,
      exclusive: ["development", "production"],
    }),

    // development environnement
    development: flags.boolean({
      char: "d",
      description: "development environnement",
      default: false,
      exclusive: ["local", "production"],
    }),

    // production environnement
    production: flags.boolean({
      char: "p",
      description: "production environnement",
      default: false,
      exclusive: ["local", "development"],
    }),
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(Start);

    if (flags.env && !existsSync(`.env.${flags.env}`)) {
      writeFileSync(`.env.${flags.env}`, null);
    }

    // starting the app
    await execa("npm", ["run", flags.env ? `start:${flags.env}` : "start"], {
      env: {
        PORT: flags.port,
      },
      stdio: [0, 1, 2],
    })
      .then((result) => {
        console.log(result.stdout);
        console.log(cyan(result.stderr));
      })
      .catch((reason) => {
        this.log(cyan(reason));
      });
  }
}
