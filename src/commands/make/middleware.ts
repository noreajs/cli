import { Command, flags } from "@oclif/command";
import NoreaConfigHelper from "../../helpers/NoreaConfigHelper";
import { MiddlewareCommandHelper } from "../../helpers/MiddlewareCommandHelper";
import { readFileSync } from "fs";
import { resolve } from "path";
import { green } from "colors";

export default class MakeMiddleware extends Command {
  static description = "create a middleware";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [
    {
      name: "middlewareName",
      required: true,
      description: "middleware name",
    },
  ];

  async run() {
    const { args, flags } = this.parse(MakeMiddleware);

    const configHelper = new NoreaConfigHelper();

    if (!configHelper.initialized) {
      this.log("There is not norea.js project in this folder.");
    } else {
      // file extension
      const ext = configHelper.config.template === "typescript" ? "ts" : "js";

      // run
      MiddlewareCommandHelper.create(this, {
        middlewareName: args.middlewareName,
        config: configHelper.config,
        template: readFileSync(
          resolve(__dirname, `../../templates/middleware.${ext}.hbs`)
        ).toString(),
      })
        .run()
        .then(() => {
          this.log(green(`\n The middleware has been successfully created!\n`));
        })
        .catch((err) => {
          this.log(`\n Failed to create the middleware.\n`);
        });
    }
  }
}
