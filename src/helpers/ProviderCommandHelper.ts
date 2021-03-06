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

export class ProviderCommandHelper {
  static create(
    cmd: Command,
    settings: {
      providerName: string;
      template: string;
      config: INoreaConfig;
    }
  ) {
    // provider name
    const providerName = camelcase(settings.providerName, {
      pascalCase: true,
    });

    // file name
    const fileName = `${decamelize(providerName, "-").toLowerCase()}.provider.${
      settings.config.template === "typescript" ? "ts" : "js"
    }`;

    // file directory
    const directory = `${settings.config.rootDir}/${settings.config.folders.providers}`;
    const fullPath = `${directory}/${fileName}`;

    return new Listr(
      [
        {
          title: `Create providers directory: ${directory}`,
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
          title: `Generate provider`,
          task: () => {
            // generate boilplate
            const renderedTemplate = Handlebars.compile(settings.template)({
              name: settings.providerName,
              collection: pluralize(decamelize(settings.providerName, "-")),
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
