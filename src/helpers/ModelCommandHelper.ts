import { existsSync, mkdirSync, writeFileSync } from "fs";
import Command from "@oclif/command";
import Listr = require("listr");
import decamelize = require("decamelize");
import pluralize = require("pluralize");
import camelcase = require("camelcase");
import { INoreaConfig } from "../interfaces/INoreaConfig";
import { join, relative } from "path";
import Handlebars = require("handlebars");
import { InterfaceCommandHelper } from "./InterfaceCommandHelper";

const input = require("listr-input");
const UpdaterRenderer = require("listr-update-renderer");

export class ModelCommandHelper {
  static create(
    cmd: Command,
    settings: {
      modelName: string;
      template: string;
      config: INoreaConfig;
      interfaceTemplate?: string;
      separateInterface: boolean;
      timestamps?: boolean;
      softDelete?: boolean;
    }
  ) {
    // model name
    const modelName = camelcase(settings.modelName, { pascalCase: true });

    // file name
    const fileName = `${modelName}.${
      settings.config.template === "typescript" ? "ts" : "js"
    }`;

    // file directory
    const modelDirectory = `${settings.config.rootDir}/${settings.config.folders.models}`;
    const modelFullPath = `${modelDirectory}/${fileName}`;

    return new Listr(
      [
        {
          title: `Create models directory: ${modelDirectory}`,
          enabled: () => !existsSync(modelDirectory),
          task: () => {
            mkdirSync(modelDirectory, { recursive: true });
          },
        },
        {
          title: `Generate interface I${settings.modelName}`,
          enabled: () => settings.separateInterface,
          task: () =>
            InterfaceCommandHelper.create(cmd, {
              config: settings.config,
              interfaceName: `${settings.modelName}`,
              template: settings.interfaceTemplate,
              modelInterface: true,
              timestamps: settings.timestamps,
              softDelete: settings.softDelete,
            }),
        },
        {
          title: `The file ${fileName} already exist`,
          enabled: () => existsSync(modelFullPath),
          task: (ctx) =>
            input("Do you want to overwrite it? (Y/n)", {
              done: (value: "y" | "Y" | "n" | "N") => {
                ctx.skipModelGeneration = !["y", "Y"].includes(value);
              },
            }),
        },
        {
          title: `Generate model ${modelName}`,
          skip: (ctx) => ctx.skipModelGeneration,
          task: () => {
            // generate boilplate
            const renderedTemplate = Handlebars.compile(settings.template)({
              name: settings.modelName,
              collection: pluralize(decamelize(settings.modelName, "-")),
              interfacesPath: settings.interfaceTemplate
                ? join(
                    relative(
                      `${settings.config.rootDir}/${settings.config.folders.models}`,
                      `${settings.config.rootDir}/${settings.config.folders.interfaces}`
                    ),
                    `I${modelName}`
                  ).replace(/(\\)+/g, "/")
                : undefined,
              timestamps: settings.timestamps,
              softDelete: settings.softDelete,
            });

            // write file
            writeFileSync(modelFullPath, renderedTemplate);
          },
        },
      ],
      {
        renderer: UpdaterRenderer,
      }
    );
  }
}
