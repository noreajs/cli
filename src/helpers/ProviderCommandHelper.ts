import inquirer = require("inquirer");
import { existsSync, mkdirSync, writeFileSync } from "fs";
import Command from "@oclif/command";
import Listr = require("listr");
import decamelize = require("decamelize");
import pluralize = require("pluralize");
import Mustache = require("mustache");
import { green } from "colors";
import camelcase = require("camelcase");
import { INoreaConfig } from "../interfaces/INoreaConfig";

export class ProviderCommandHelper {
  static async createModal(
    cmd: Command,
    settings: {
      providerName: string;
      template: any;
      config: INoreaConfig;
    }
  ) {
    return new Promise<void>(async (resolve, reject) => {
      // provider name
      const providerName = camelcase(settings.providerName, {
        pascalCase: true,
      });

      // file name
      const fileName = `${decamelize(
        providerName,
        "-"
      ).toLowerCase()}.provider.${
        settings.config.template === "typescript" ? "ts" : "js"
      }`;

      // file directory
      const directory = `${settings.config.rootDir}/${settings.config.folders.providers}`;
      const fullPath = `${directory}/${fileName}`;

      let fileExist = existsSync(fullPath);

      if (fileExist) {
        cmd.log(`The file \`${fileName}\` already exist!`);
      }

      if (fileExist) {
        const answer: any = await inquirer.prompt([
          /* Pass your questions in here */
          {
            name: "overwrite",
            type: "confirm",
            default: false,
            message: "Do you want to overwrite it?",
          },
        ]);

        // update overwrite
        fileExist = !answer.overwrite;
      }

      if (!fileExist) {
        const tasks = new Listr([
          {
            title: `Create providers directory: ${directory}`,
            enabled: () => !existsSync(directory),
            task: () => {
              mkdirSync(directory, { recursive: true });
            },
          },
          {
            title: `Generate provider`,
            task: () => {
              // generate boilplate
              const renderedTemplate = Mustache.render(settings.template, {
                name: settings.providerName,
                collection: pluralize(decamelize(settings.providerName, "-")),
              });

              // write file
              writeFileSync(fullPath, renderedTemplate);
            },
          },
        ]);

        await tasks
          .run()
          .then(() => {
            cmd.log(
              green(
                `\n The provider \`${settings.providerName}Provider\` has been successfully created!\n`
              )
            );

            resolve();
          })
          .catch((err) => {
            cmd.log(
              `\n Failed to create the provider ${settings.providerName}.\n`
            );

            reject(err);
          });
      }
    });
  }
}
