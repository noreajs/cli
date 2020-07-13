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

export type RouteTemplateType = {
  group: string;
  middleware?: {
    name: string;
    path: string;
  };
  controller?: {
    name: string;
    path: string;
  };
  actions?: Array<{
    description: string;
    route: string;
    httpMethod: "get" | "post" | "put" | "delete";
    method: string;
    controller: string;
  }>;
};

export class RouteCommandHelper {
  /**
   * Render template
   * @param param template rendering data
   */
  static renderTemplate(param: {
    template: string;
    templateData: RouteTemplateType;
  }) {
    return Handlebars.compile(param.template)(param.templateData);
  }

  /**
   * Generate route
   * @param cmd command
   * @param settings settings
   */
  static create(
    cmd: Command,
    settings: {
      routeName: string;
      template: string;
      templateData: RouteTemplateType;
      config: INoreaConfig;
    }
  ) {
    // route name
    const routeName = camelcase(settings.routeName, {
      pascalCase: true,
    });

    // file name
    const fileName = `${decamelize(routeName, "-").toLowerCase()}.route.${
      settings.config.template === "typescript" ? "ts" : "js"
    }`;

    // file directory
    const directory = `${settings.config.rootDir}/${settings.config.folders.routes}`;
    const fullPath = `${directory}/${fileName}`;

    return new Listr(
      [
        {
          title: `Create routes directory: ${directory}`,
          enabled: () => !existsSync(directory),
          task: () => {
            mkdirSync(directory, { recursive: true });
          },
        },
        {
          title: `The route file ${fileName} already exist`,
          enabled: () => existsSync(fullPath),
          task: (ctx) =>
            input("Do you want to overwrite it? (Y/n)", {
              done: (value: "y" | "Y" | "n" | "N") => {
                ctx.skipGeneration = !["y", "Y"].includes(value);
              },
            }),
        },
        {
          title: `Generate route`,
          task: () => {
            // generate boilplate
            const renderedTemplate = RouteCommandHelper.renderTemplate({
              templateData: settings.templateData,
              template: settings.template,
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
