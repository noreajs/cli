import { existsSync, mkdirSync, writeFileSync } from "fs";
import Command from "@oclif/command";
import Listr = require("listr");
import decamelize = require("decamelize");
import pluralize = require("pluralize");
import camelcase = require("camelcase");
import Handlebars = require("handlebars");
import { INoreaConfig } from "../interfaces/INoreaConfig";

const input = require("listr-input");
const UpdaterRenderer = require("listr-update-renderer");

export class MiddlewareCommandHelper {
  static create(
    cmd: Command,
    settings: {
      middlewareName: string;
      template: string;
      config: INoreaConfig;
    }
  ) {
    // middleware name
    const middlewareName = camelcase(settings.middlewareName, {
      pascalCase: true,
    });

    // file name
    const fileName = `${decamelize(
      middlewareName,
      "-"
    ).toLowerCase()}.middleware.${
      settings.config.template === "typescript" ? "ts" : "js"
    }`;

    // file directory
    const directory = `${settings.config.rootDir}/${settings.config.folders.middlewares}`;
    const fullPath = `${directory}/${fileName}`;

    return new Listr(
      [
        {
          title: `Create middlewares directory: ${directory}`,
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
          title: `Generate middleware`,
          skip: (ctx) => ctx.skipGeneration,
          task: () => {
            // generate boilplate
            const renderedTemplate = Handlebars.compile(settings.template)({
              name: settings.middlewareName
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
