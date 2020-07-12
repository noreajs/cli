import { Command, flags } from "@oclif/command";
import path = require("path");
import fs = require("fs");
import NoreaConfigHelper from "../../helpers/NoreaConfigHelper";
import { ModelCommandHelper } from "../../helpers/ModelCommandHelper";

export default class MakeModel extends Command {
  static description = "create a new model";

  static flags = {
    help: flags.help({ char: "h" }),
    // separate interface
    separate: flags.boolean({
      char: "s",
      description: "separate the model's interface",
      default: false,
    })
  };

  static args = [
    {
      name: "modelName",
      required: true,
      description: "model name",
    },
  ];

  async run() {
    const { args, flags } = this.parse(MakeModel);

    const configHelper = new NoreaConfigHelper();

    if (!configHelper.initialized) {
      this.log("There is not norea.js project in this folder.");
    } else {
      await ModelCommandHelper.createModal(this, {
        modelName: args.modelName,
        config: configHelper.config,
        template: fs
          .readFileSync(
            path.resolve(
              __dirname,
              `../../templates/model${flags.separate ? "" : "-interface"}.${
                configHelper.config.dbStrategy
              }.mustache`
            )
          )
          .toString(),
        interfaceTemplate: fs
          .readFileSync(
            path.resolve(__dirname, `../../templates/interface.mustache`)
          )
          .toString(),
      });
    }
  }
}
