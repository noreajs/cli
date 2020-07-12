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
import { join, format, normalize, posix, relative } from "path";

export class ModelCommandHelper {
  static async createModal(
    cmd: Command,
    settings: {
      modelName: string;
      template: string;
      config: INoreaConfig;
      interfaceTemplate?: string;
    }
  ) {
    return new Promise<void>(async (resolve, reject) => {
      // model name
      const modelName = camelcase(settings.modelName, { pascalCase: true });

      // file name
      const fileName = `${modelName}.${
        settings.config.template === "typescript" ? "ts" : "js"
      }`;

      // file directory
      const modelDirectory = `${settings.config.rootDir}/${settings.config.folders.models}`;
      const interfaceDirectory = `${settings.config.rootDir}/${settings.config.folders.interfaces}`;
      const modelFullPath = `${modelDirectory}/${fileName}`;
      const interfaceFullPath = `${interfaceDirectory}/I${fileName}`;

      let modelFileExist = existsSync(modelFullPath);
      let interfaceFileExist = existsSync(interfaceFullPath);

      // interface needed and file exist
      if (settings.interfaceTemplate && interfaceFileExist) {
        cmd.log(`The file \`I${fileName}\` already exist!`);

        await inquirer
          .prompt([
            /* Pass your questions in here */
            {
              name: "overwrite",
              type: "confirm",
              default: false,
              message: "Do you want to overwrite it?",
            },
          ])
          .then((answer) => {
            // update overwrite
            interfaceFileExist = !answer.overwrite;
          });
      }

      // model file already exist
      if (modelFileExist) {
        cmd.log(`The file \`${fileName}\` already exist!`);

        await inquirer
          .prompt([
            /* Pass your questions in here */
            {
              name: "overwrite",
              type: "confirm",
              default: false,
              message: "Do you want to overwrite it?",
            },
          ])
          .then((answer) => {
            // update overwrite
            modelFileExist = !answer.overwrite;
          });
      }

      if (!modelFileExist) {
        const tasks = new Listr([
          {
            title: `Create models directory: ${modelDirectory}`,
            enabled: () => !existsSync(modelDirectory),
            task: () => {
              mkdirSync(modelDirectory, { recursive: true });
            },
          },
          {
            title: `Generate interface I${settings.modelName}`,
            enabled: () => !!settings.interfaceTemplate && !interfaceFileExist,
            task: () => {
              if (settings.interfaceTemplate) {
                // generate boilplate
                const renderedTemplate = Mustache.render(
                  settings.interfaceTemplate,
                  {
                    name: settings.modelName,
                  }
                );

                // write file
                writeFileSync(
                  `${settings.config.rootDir}/${settings.config.folders.interfaces}/I${fileName}`,
                  renderedTemplate
                );
              }
            },
          },
          {
            title: `Generate model ${settings.modelName}`,
            task: () => {
              // generate boilplate
              const renderedTemplate = Mustache.render(settings.template, {
                name: settings.modelName,
                collection: pluralize(decamelize(settings.modelName, "-")),
                interfacesPath: settings.interfaceTemplate
                  ? join(
                      relative(
                        `${settings.config.rootDir}/${settings.config.folders.controllers}`,
                        `${settings.config.rootDir}/${settings.config.folders.interfaces}`
                      ),
                      `I${modelName}`
                    ).replace(/(\\)+/g, "/")
                  : undefined,
              });

              // write file
              writeFileSync(modelFullPath, renderedTemplate);
            },
          },
        ]);

        await tasks
          .run()
          .then(() => {
            cmd.log(
              green(
                `\n The model \`${settings.modelName}\` has been successfully created!\n`
              )
            );
            resolve();
          })
          .catch((err) => {
            cmd.log(`\n Failed to create the model ${settings.modelName}.\n`);

            reject(err);
          });
      }
    });
  }
}
