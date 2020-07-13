import { Command, flags } from "@oclif/command";
import path = require("path");
import fs = require("fs");
import NoreaConfigHelper from "../../helpers/NoreaConfigHelper";
import { ModelCommandHelper } from "../../helpers/ModelCommandHelper";
import { green } from "colors";

export default class MakeModel extends Command {
  static description = "create a new model";

  static flags = {
    help: flags.help({ char: "h" }),
    // separate interface
    separate: flags.boolean({
      char: "s",
      description: "separate the model's interface",
      default: false,
    }),
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
      // file extension
      const ext = configHelper.config.template === "typescript" ? "ts" : "js";

      // run
      ModelCommandHelper.create(this, {
        modelName: args.modelName,
        config: configHelper.config,
        separateInterface: flags.separate,
        template: fs
          .readFileSync(
            path.resolve(
              __dirname,
              `../../templates/model${flags.separate ? "" : "-interface"}.${
                configHelper.config.dbStrategy
              }.${ext}.hbs`
            )
          )
          .toString(),
        interfaceTemplate: fs
          .readFileSync(
            path.resolve(__dirname, `../../templates/interface.${ext}.hbs`)
          )
          .toString(),
      })
        .run()
        .then(() => {
          this.log(green(`\n The model has been successfully created!\n`));
        })
        .catch((err) => {
          this.log(`\n Failed to create the model.\n`);
        });
    }
  }
}
