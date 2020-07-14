import { Command, flags } from "@oclif/command";
import { InterfaceCommandHelper } from "../../helpers/InterfaceCommandHelper";
import NoreaConfigHelper from "../../helpers/NoreaConfigHelper";
import { resolve } from "path";
import { readFileSync } from "fs";
import { green, cyan } from "colors";

export default class MakeInterface extends Command {
  static description = "create a new interface";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [
    {
      name: "interfaceName",
      required: true,
      description: "interface name",
    },
  ];

  async run() {
    const { args, flags } = this.parse(MakeInterface);

    const configHelper = new NoreaConfigHelper();

    if (!configHelper.initialized) {
      this.log("There is not norea.js project in this folder.");
    } else {
      /**
       * Typescript only
       */
      if (configHelper.config.template === "typescript") {
        // run
        await InterfaceCommandHelper.create(this, {
          interfaceName: args.interfaceName,
          config: configHelper.config,
          modelInterface: false,
          template: readFileSync(
            resolve(__dirname, `../../templates/interface.ts.hbs`)
          ).toString(),
        })
          .run()
          .then((result) => {
            // this.log(result);
            this.log(
              green(`\n The interface has been successfully created!\n`)
            );
          })
          .catch((err) => {
            this.log(`\n Failed to create the interface\n`);
          });
      } else {
        this.log(
          cyan("\n Interface is not supported with `javascript` template\n")
        );
      }
    }
  }
}
