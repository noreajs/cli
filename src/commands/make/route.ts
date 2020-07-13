import { Command, flags } from "@oclif/command";
import { RouteCommandHelper } from "../../helpers/RouteCommandHelper";
import { readFileSync } from "fs";
import { resolve } from "path";
import { green } from "colors";
import NoreaConfigHelper from "../../helpers/NoreaConfigHelper";

export default class MakeRoute extends Command {
  static description = "create a route file";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [
    {
      name: "routeName",
      required: true,
      description: "route name",
    },
  ];

  async run() {
    const { args, flags } = this.parse(MakeRoute);

    const configHelper = new NoreaConfigHelper();

    if (!configHelper.initialized) {
      this.log("There is not norea.js project in this folder.");
    } else {
      // file extension
      const ext = configHelper.config.template === "typescript" ? "ts" : "js";

      // run
      RouteCommandHelper.create(this, {
        routeName: args.routeName,
        config: configHelper.config,
        template: readFileSync(
          resolve(__dirname, `../../templates/route.${ext}.hbs`)
        ).toString(),
        templateData: {},
      })
        .run()
        .then(() => {
          this.log(green(`\n The route has been successfully created!\n`));
        })
        .catch((err) => {
          this.log(`\n Failed to create the route.\n`);
        });
    }
  }
}
