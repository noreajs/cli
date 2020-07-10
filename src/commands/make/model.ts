import { Command, flags } from "@oclif/command";
import NoreaConfigHelper from "../../helpers/NoreaConfigHelper";

export default class MakeModel extends Command {
  static description = "create a new model";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(MakeModel);

    const configHelper = new NoreaConfigHelper();

    if (!configHelper.initialized) {
      this.log("There is not norea.js project in this folder.");
    } else {
      this.log("config file", configHelper.config);
      configHelper.update({ template: "typescript" });
      await configHelper.save();
    }
  }
}
