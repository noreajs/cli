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

    // add timestamps attributes in interface
    timestamps: flags.boolean({
      char: "t",
      default: false,
      description:
        "add createdAt and updatedAt attributes in the model's interface",
    }),

    // add deletedAt attribute in interface
    softDelete: flags.boolean({
      char: "S",
      default: false,
      description: "add deletedAt attribute in the model's interface",
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
      // run
      ModelCommandHelper.create(this, {
        modelName: args.modelName,
        config: configHelper.config,
        separateInterface: flags.separate,
        softDelete: flags.softDelete,
        timestamps: flags.timestamps,
        template: fs
          .readFileSync(
            path.resolve(
              __dirname,
              configHelper.config.template === "typescript"
                ? `../../templates/model${flags.separate ? "" : "-interface"}.${
                    configHelper.config.dbStrategy
                  }.ts.hbs`
                : `../../templates/model.${configHelper.config.dbStrategy}.js.hbs`
            )
          )
          .toString(),
        interfaceTemplate:
          configHelper.config.template === "typescript"
            ? fs
                .readFileSync(
                  path.resolve(__dirname, `../../templates/interface.ts.hbs`)
                )
                .toString()
            : undefined,
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
