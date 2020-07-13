import { existsSync, mkdirSync, writeFileSync, exists } from "fs";
import Command from "@oclif/command";
import Listr = require("listr");
import decamelize = require("decamelize");
import pluralize = require("pluralize");
import camelcase = require("camelcase");
import Handlebars = require("handlebars");
import { INoreaConfig } from "../interfaces/INoreaConfig";
import { join, relative } from "path";
import { ModelCommandHelper } from "./ModelCommandHelper";
import { ProviderCommandHelper } from "./ProviderCommandHelper";
import { MiddlewareCommandHelper } from "./MiddlewareCommandHelper";
import { RouteTemplateType, RouteCommandHelper } from "./RouteCommandHelper";

const input = require("listr-input");
const UpdaterRenderer = require("listr-update-renderer");

export type ControllerTemplateType = {
  name: string;
  model?: {
    separateInterface: boolean;
    name: string;
    path: string;
  };
  interface?: {
    name: string;
    path: string;
  };
  provider?: {
    name: string;
    path: string;
  };
  actions?: string[];
};

export class ControllerCommandHelper {
  static CONTROlLER_DEFAULT_METHODS = [
    "index",
    "create",
    "show",
    "edit",
    "delete",
  ];

  /**
   * Generate a controller
   * @param cmd oclif command
   * @param settings settings
   */
  static create(
    cmd: Command,
    settings: {
      ext: "js" | "ts";
      name: string;
      includeActions: boolean;
      config: INoreaConfig;
      controller: {
        name: string;
        template: string;
        routeTemplate: string;
      };
      model?: {
        name: string;
        template: string;
        separateInterface: boolean;
        interfaceTemplate: string;
      };
      middleware?: {
        name: string;
        template: string;
      };
      provider?: {
        name: string;
        template: string;
      };
    }
  ) {
    /**
     * Controller template data
     */
    const controllerTemplateData: ControllerTemplateType = {
      name: `${camelcase(settings.name, {
        pascalCase: true,
      })}Controller`,
      actions: settings.includeActions
        ? ControllerCommandHelper.CONTROlLER_DEFAULT_METHODS
        : undefined,

      /**
       * Interface
       */
      interface: settings.model
        ? {
            name: `I${camelcase(settings.model.name, {
              pascalCase: true,
            })}`,
            path: join(
              relative(
                `${settings.config.rootDir}/${settings.config.folders.controllers}`,
                `${settings.config.rootDir}/${settings.config.folders.interfaces}`
              ),
              `I${camelcase(settings.model.name, {
                pascalCase: true,
              })}`
            ).replace(/(\\)+/g, "/"),
          }
        : undefined,

      /**
       * Model
       */
      model: settings.model
        ? {
            name: camelcase(settings.model.name, {
              pascalCase: true,
            }),
            path: join(
              relative(
                `${settings.config.rootDir}/${settings.config.folders.controllers}`,
                `${settings.config.rootDir}/${settings.config.folders.models}`
              ),
              `${camelcase(settings.model.name, {
                pascalCase: true,
              })}`
            ).replace(/(\\)+/g, "/"),
            separateInterface: false,
          }
        : undefined,

      /**
       * Provider
       */
      provider: settings.provider
        ? {
            name: `${camelcase(settings.provider.name, {
              pascalCase: true,
            })}Provider`,
            path: join(
              relative(
                `${settings.config.rootDir}/${settings.config.folders.controllers}`,
                `${settings.config.rootDir}/${settings.config.folders.providers}`
              ),
              `${decamelize(
                settings.provider.name,
                "-"
              ).toLowerCase()}.provider`
            ).replace(/(\\)+/g, "/"),
          }
        : undefined,
    };

    /**
     * Route template data
     */
    const routeTemplateData: RouteTemplateType = {
      controller: {
        routePrefix: pluralize(decamelize(settings.name, "-")),
        name: `${camelcase(settings.name)}Controller`,
        path: join(
          relative(
            `${settings.config.rootDir}/${settings.config.folders.routes}`,
            `${settings.config.rootDir}/${settings.config.folders.controllers}`
          ),
          `${decamelize(settings.name, "-").toLowerCase()}.controller`
        ).replace(/(\\)+/g, "/"),
      },
      middleware: settings.middleware
        ? {
            name: `${camelcase(settings.name)}Middleware`,
            path: join(
              relative(
                `${settings.config.rootDir}/${settings.config.folders.routes}`,
                `${settings.config.rootDir}/${settings.config.folders.middlewares}`
              ),
              `${decamelize(settings.name, "-").toLowerCase()}.middleware`
            ).replace(/(\\)+/g, "/"),
          }
        : undefined,
      actions: settings.includeActions
        ? [
            {
              description: `Get all ${pluralize(
                decamelize(settings.name, " ")
              )}`,
              httpMethod: "get",
              method: "index",
              route: "",
              controller: `${camelcase(settings.name)}Controller`,
            },
            {
              description: `Create ${decamelize(settings.name, " ")}`,
              httpMethod: "post",
              method: "create",
              route: "",
              controller: `${camelcase(settings.name)}Controller`,
            },
            {
              description: `Show ${decamelize(settings.name, " ")}`,
              httpMethod: "get",
              method: "show",
              route: "/:id",
              controller: `${camelcase(settings.name)}Controller`,
            },
            {
              description: `Edit ${decamelize(settings.name, " ")}`,
              httpMethod: "put",
              method: "edit",
              route: "/:id",
              controller: `${camelcase(settings.name)}Controller`,
            },
            {
              description: `Delete ${decamelize(settings.name, " ")}`,
              httpMethod: "delete",
              method: "delete",
              route: "/:id",
              controller: `${camelcase(settings.name)}Controller`,
            },
          ]
        : undefined,
    };

    // file name
    const controllerFileName = `${decamelize(
      settings.name,
      "-"
    ).toLowerCase()}.controller.${settings.ext}`;

    // file directory
    const directory = `${settings.config.rootDir}/${settings.config.folders.controllers}`;
    const fullPath = `${directory}/${controllerFileName}`;
    const controllerExist = existsSync(fullPath);

    return new Listr(
      [
        {
          title: `Create controllers directory: ${directory}`,
          enabled: () => !existsSync(directory),
          task: () => {
            mkdirSync(directory, { recursive: true });
          },
        },
        {
          title: "Generate model",
          enabled: () => !!settings.model,
          task: () =>
            settings.model
              ? ModelCommandHelper.create(cmd, {
                  modelName: settings.model.name,
                  config: settings.config,
                  interfaceTemplate: settings.model.interfaceTemplate,
                  template: settings.model.template,
                  separateInterface: settings.model.separateInterface,
                })
              : undefined,
        },
        {
          title: "Generate provider",
          enabled: () => !!settings.provider,
          task: () =>
            settings.provider
              ? ProviderCommandHelper.create(cmd, {
                  providerName: settings.provider.name,
                  config: settings.config,
                  template: settings.provider.template,
                })
              : undefined,
        },
        {
          title: "Generate middleware",
          enabled: () => !!settings.middleware,
          task: () =>
            settings.middleware
              ? MiddlewareCommandHelper.create(cmd, {
                  middlewareName: settings.middleware.name,
                  config: settings.config,
                  template: settings.middleware.template,
                })
              : undefined,
        },
        {
          title: `The file ${controllerFileName} already exist`,
          enabled: () => controllerExist,
          task: (ctx) =>
            input("Do you want to overwrite it? (Y/n)", {
              done: (value: "y" | "Y" | "n" | "N") => {
                ctx.skipModelGeneration = !["y", "Y"].includes(value);
              },
            }),
        },
        {
          title: `Generate controller`,
          task: () => {
            // generate boilplate
            const renderedTemplate = Handlebars.compile(
              settings.controller.template
            )(controllerTemplateData);

            // write file
            writeFileSync(fullPath, renderedTemplate);
          },
        },
        {
          title: "Generate controller's routes",
          task: () =>
            RouteCommandHelper.create(cmd, {
              routeName: settings.name,
              config: settings.config,
              template: settings.controller.routeTemplate,
              templateData: routeTemplateData,
            }),
        },
      ],
      {}
    );
  }
}
