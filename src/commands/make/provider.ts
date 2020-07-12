import { Command, flags } from "@oclif/command";
import NoreaConfigHelper from "../../helpers/NoreaConfigHelper";
import { ProviderCommandHelper } from "../../helpers/ProviderCommandHelper";
import { readFileSync } from "fs";
import { resolve } from "path";

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
      await ProviderCommandHelper.createModal(this, {
        providerName: args.providerName,
        config: configHelper.config,
        template: readFileSync(
          resolve(__dirname, `../../templates/provider.mustache`)
        ).toString(),
      });
    }
  }
}
