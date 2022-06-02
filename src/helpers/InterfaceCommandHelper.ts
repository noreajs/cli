import { existsSync, mkdirSync, writeFileSync } from "fs";
import Command from "@oclif/command";
import Listr = require("listr");
import camelcase = require("camelcase");
import Handlebars = require("handlebars");
import { INoreaConfig } from "../interfaces/INoreaConfig";

const UpdaterRenderer = require("listr-update-renderer");
const input = require("listr-input");

export class InterfaceCommandHelper {
  static INTERFACE_NAME_PREFIX = "I";

  static create(
    cmd: Command,
    settings: {
      interfaceName: string;
      template: any;
      config: INoreaConfig;
      modelInterface: boolean;
      timestamps?: boolean;
      softDelete?: boolean;
    }
  ) {
    // interface name
    const interfaceName = `${
      InterfaceCommandHelper.INTERFACE_NAME_PREFIX
    }${camelcase(settings.interfaceName, {
      pascalCase: true,
    })}`;

    // file name
    const fileName = `${interfaceName}.${
      settings.config.template === "typescript" ? "ts" : "js"
    }`;

    // file directory
    const directory = `${settings.config.rootDir}/${settings.config.folders.interfaces}`;
    const fullPath = `${directory}/${fileName}`;

    return new Listr(
      [
        {
          title: `Create interfaces directory: ${directory}`,
          enabled: () => !existsSync(directory),
          task: () => {
            mkdirSync(directory, { recursive: true });
          },
        },
        {
          title: `The file ${fileName} already exist`,
          enabled: () => existsSync(fullPath),
          task: (ctx) =>
            input("Do you want to overwrite it? (Y/n)", {
              done: (value: "y" | "Y" | "n" | "N") => {
                ctx.skipGeneration = !["y", "Y"].includes(value);
              },
            }),
        },
        {
          title: `Generate interface`,
          skip: (ctx) => ctx.skipGeneration,
          task: () => {
            // generate boilplate
            const renderedTemplate = Handlebars.compile(settings.template)({
              name: interfaceName,
              mongoose:
                settings.modelInterface &&
                settings.config.dbStrategy === "mongoose",
              sequelize:
                settings.modelInterface &&
                settings.config.dbStrategy === "sequelize",
                timestamps: settings.timestamps,
                softDelete: settings.softDelete
            });

            // write file
            writeFileSync(fullPath, renderedTemplate);
          },
        },
      ],
      {
        renderer: UpdaterRenderer,
      }
    );
  }
}
