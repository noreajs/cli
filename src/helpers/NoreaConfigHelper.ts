import path = require("path");
import fs = require("fs");
import { INoreaConfig, INoreaConfigUpdate } from "../interfaces/INoreaConfig";
import stringify = require("json-stringify-pretty-compact");
import { validateObject } from "./ObjectValidation";

export default class NoreaConfigHelper {
  static CONFIG_FILE_NAME = "noreaconfig.json";
  static TEMPLATE_LIST = ["typescript", "javascript"];
  static DB_STRATEGIES = ["mongoose", "sequelize"];

  initialized: boolean;
  config: INoreaConfig;

  constructor() {
    const initialized = fs.existsSync(
      path.resolve(NoreaConfigHelper.CONFIG_FILE_NAME)
    );

    // set initialized
    this.initialized = initialized;

    if (initialized) {
      this.config = JSON.parse(
        fs.readFileSync(NoreaConfigHelper.CONFIG_FILE_NAME).toString()
      );
    } else {
      // setting default config
      this.config = {
        template: "typescript",
        dbStrategy: "mongoose",
        rootDir: "src",
        folders: {
          controllers: "controllers",
          interfaces: "interfaces",
          middlewares: "middlewares",
          models: "models",
          providers: "providers",
          routes: "routes",
        },
      };
    }
  }

  update(params: INoreaConfigUpdate) {
    const paramsValidation = validateObject<INoreaConfigUpdate>(params, {
      template: [
        {
          errorMessage: `template value must be within [${NoreaConfigHelper.TEMPLATE_LIST.join(
            ", "
          )}]`,
          validator: (value) => {
            return NoreaConfigHelper.TEMPLATE_LIST.includes(value);
          },
        },
      ],
      dbStrategy: [
        {
          errorMessage: `dbStrategy must be within [${NoreaConfigHelper.DB_STRATEGIES.join(
            ", "
          )}]`,
          validator: (value) => {
            return NoreaConfigHelper.DB_STRATEGIES.includes(value);
          },
        },
      ],
    });

    if (paramsValidation.valid) {
        
    } else {
      throw Error(paramsValidation.message);
    }
  }

  save(cwd?: string) {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        `${cwd ? cwd + "/" : ""}noreaconfig.json`,
        stringify(this.config, {
          indent: "\t",
        }),
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve("config file added successfully");
          }
        }
      );
    });
  }
}
