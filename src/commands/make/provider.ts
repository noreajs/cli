import { Command, flags } from "@oclif/command";
import NoreaConfigHelper from "../../helpers/NoreaConfigHelper";
import { ProviderCommandHelper } from "../../helpers/ProviderCommandHelper";
import { readFileSync } from "fs";
import { resolve } from "path";
import { green } from 'colors';

export default class MakeProvider extends Command {
  static description = "create a new provider";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [
    {
      name: "providerName",
      required: true,
      description: "provider name",
    },
  ];

  async run() {
    const { args, flags } = this.parse(MakeProvider);

    const configHelper = new NoreaConfigHelper();

    if (!configHelper.initialized) {
      this.log("There is not norea.js project in this folder.");
    } else {
      // file extension
      const ext = configHelper.config.template === "typescript" ? "ts" : "js";

      // run
      ProviderCommandHelper.create(this, {
        providerName: args.providerName,
        config: configHelper.config,
        template: readFileSync(
          resolve(__dirname, `../../templates/provider.${ext}.hbs`)
        ).toString(),
      })
        .run()
        .then(() => {
          this.log(green(`\n The provider has been successfully created!\n`));
        })
        .catch((err) => {
          this.log(`\n Failed to create the provider.\n`);
        });
    }
  }
}
