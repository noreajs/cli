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

export class InterfaceCommandHelper {
  static async createModal(
    cmd: Command,
    settings: {
      interfaceName: string;
      template: any;
      config: INoreaConfig;
    }
  ) {
    return new Promise<void>(async (resolve, reject) => {
      // interface name
      const interfaceName = camelcase(settings.interfaceName, {
        pascalCase: true,
      });

      // file name
      const fileName = `${interfaceName}.${
        settings.config.template === "typescript" ? "ts" : "js"
      }`;

      // file directory
      const directory = `${settings.config.rootDir}/${settings.config.folders.interfaces}`;
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
            title: `Create interfaces directory: ${directory}`,
            enabled: () => !existsSync(directory),
            task: () => {
              mkdirSync(directory, { recursive: true });
            },
          },
          {
            title: `Generate interface ${settings.interfaceName}`,
            task: () => {
              // generate boilplate
              const renderedTemplate = Mustache.render(settings.template, {
                name: settings.interfaceName,
                collection: pluralize(decamelize(settings.interfaceName, "-")),
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
                `\n The interface ${settings.interfaceName} has been successfully created!\n`
              )
            );

            resolve();
          })
          .catch((err) => {
            cmd.log(
              `\n Failed to create the interface ${settings.interfaceName}.\n`
            );

            reject(err);
          });
      }
    });
  }
}
