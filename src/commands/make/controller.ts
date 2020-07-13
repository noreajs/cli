import { Command, flags } from "@oclif/command";
import NoreaConfigHelper from "../../helpers/NoreaConfigHelper";
import { ControllerCommandHelper } from "../../helpers/ControllerCommandHelper";
import { resolve } from "path";
import { readFileSync } from "fs";
import { green } from "colors";

export default class MakeController extends Command {
  static description = "create a new controller";

  static flags = {
    help: flags.help({ char: "h" }),
    // separate interface
    separate: flags.boolean({
      char: "s",
      description: "separate the model's interface",
      default: false,
    }),

    // separate interface
    noActions: flags.boolean({
      char: "n",
      description:
        "not include controller actions (index, edit, show, delete, create)",
      default: false,
    }),

    // include model
    model: flags.boolean({
      name: "model",
      description: "include a model, generate if not exist.",
      default: (ctx: any) => {
        return !!ctx.flags.modelName;
      },
    }),

    // model name
    modelName: flags.string({
      name: "modelName",
      description:
        "include a model with the given name, generate if not exist.",
    }),

    // include middleware
    middleware: flags.boolean({
      name: "middleware",
      description: "include a middleware, generate if not exist.",
      default: (ctx: any) => {
        return !!ctx.flags.middlewareName;
      },
    }),

    // middleware name
    middlewareName: flags.string({
      name: "middlewareName",
      description:
        "include a middleware with the given name, generate if not exist.",
    }),

    // include provider
    provider: flags.boolean({
      name: "provider",
      description: "include a provider, generate if not exist.",
      default: (ctx: any) => {
        return !!ctx.flags.providerName;
      },
    }),

    // provider name
    providerName: flags.string({
      name: "providerName",
      description:
        "include a provider with the given name, generate if not exist.",
    }),
  };

  static args = [
    {
      name: "name",
      required: true,
      description: "controller name",
    },
  ];

  async run() {
    const { args, flags } = this.parse(MakeController);

    const configHelper = new NoreaConfigHelper();

    if (!configHelper.initialized) {
      this.log("There is not norea.js project in this folder.");
    } else {
      // file extension
      const ext = configHelper.config.template === "typescript" ? "ts" : "js";

      // excecute command
      ControllerCommandHelper.create(this, {
        ext: ext,
        name: args.name,
        includeActions: !flags.noActions,
        config: configHelper.config,
        controller: {
          name: args.name,
          template: readFileSync(
            resolve(__dirname, `../../templates/controller.${ext}.hbs`)
          ).toString(),
          routeTemplate: readFileSync(
            resolve(__dirname, `../../templates/route.${ext}.hbs`)
          ).toString(),
        },
        model: flags.model
          ? {
              name: flags.modelName ?? args.name,
              separateInterface: flags.separate,
              template: readFileSync(
                resolve(
                  __dirname,
                  `../../templates/model${flags.separate ? "" : "-interface"}.${
                    configHelper.config.dbStrategy
                  }.${ext}.hbs`
                )
              ).toString(),
              interfaceTemplate: readFileSync(
                resolve(__dirname, `../../templates/interface.${ext}.hbs`)
              ).toString(),
            }
          : undefined,
        middleware: flags.middleware
          ? {
              name: flags.middlewareName ?? args.name,
              template: readFileSync(
                resolve(__dirname, `../../templates/middleware.${ext}.hbs`)
              ).toString(),
            }
          : undefined,
        provider: flags.provider
          ? {
              name: flags.providerName ?? args.name,
              template: readFileSync(
                resolve(__dirname, `../../templates/provider.${ext}.hbs`)
              ).toString(),
            }
          : undefined,
      })
        .run()
        .then(() => {
          this.log(green(`\n The controller has been successfully created!\n`));
        })
        .catch((err) => {
          this.log(`\n Failed to create the controller.\n`);
        });
    }
  }
}
