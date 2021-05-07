import { Command, flags } from "@oclif/command";
import Listr = require("listr");
import execa = require("execa");
import fs = require("fs");
import figlet = require("figlet");
import stringify = require("json-stringify-pretty-compact");
import colors = require("colors");
import NoreaConfigHelper from "../helpers/NoreaConfigHelper";

export default class New extends Command {
  static description = "create a new norea.js application (API)";

  static flags = {
    help: flags.help({ char: "h" }),
    // template
    template: flags.string({
      multiple: false,
      options: ["typescript", "javascript"],
      char: "t",
      default: "typescript",
      description: "project template",
    }),

    // package manager
    package: flags.string({
      multiple: false,
      options: ["npm", "yarn"],
      char: "p",
      default: "npm",
      description: "package manager to use",
    }),

    // database strategy
    dbStrategy: flags.string({
      multiple: false,
      options: ["mongoose", "sequelize"],
      char: "d",
      default: "mongoose",
      description:
        "mongoose for MongoDB database and sequelize ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server database",
    }),

    // release version
    version: flags.string({
      char: "v",
      description: "Release version (ex: v1.0.1)",
    }),

    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [
    {
      name: "appName",
      required: true,
      description: "application name",
      parse: (input: string) => input.toLowerCase(),
    },
  ];

  async run() {
    const { args, flags } = this.parse(New);

    const noreaConfig = new NoreaConfigHelper();

    this.log(
      colors.green(
        figlet.textSync("Norea.js", {
          font: "Standard",
        })
      )
    );
    this.log(
      ` Creating the application ${args.appName} with the ${flags.template} template\n`
    );

    const appDirectoryExist = fs.existsSync(args.appName);

    const tasks = new Listr(
      [
        {
          title: "Delete existing folder",
          enabled: (ctx) => flags.force && appDirectoryExist,
          task: (ctx, task) =>
            new Promise((resolve, reject) => {
              fs.unlink(args.appName, (error) => {
                if (error) {
                  task.output =
                    "failed to delete de folder, try to do it manually";
                  reject(new Error(error.message));
                } else {
                  resolve("folder deleted successfully");
                }
              });
            }),
        },
        {
          title: "Git",
          task: () => {
            return new Listr(
              [
                {
                  title: `Cloning ${flags.template} starter project`,
                  enabled: () =>
                    !!flags.version && `${flags.version}`.length !== 0,
                  task: (ctx, task) =>
                    execa("git", [
                      "clone",
                      `https://github.com/noreajs/api-starter-${flags.template}.git`,
                      args.appName,
                    ]).then((result) => {
                      if (result.exitCode !== 0) {
                        throw new Error(
                          result.stderr ?? "Unable to clone the project"
                        );
                      }
                    }),
                },
                {
                  title: `Cloning ${flags.template} starter project`,
                  enabled: () =>
                    !flags.version || `${flags.version}`.length === 0,
                  task: (ctx, task) =>
                    execa("git", [
                      "clone",
                      "--branch",
                      flags.version,
                      `https://github.com/noreajs/api-starter-${flags.template}.git`,
                      args.appName,
                    ]).then((result) => {
                      if (result.exitCode !== 0) {
                        throw new Error(
                          result.stderr ?? "Unable to clone the project"
                        );
                      }
                    }),
                },
                {
                  title: `Removing default remote origin`,
                  task: (ctx, task) =>
                    execa("git", ["remote", "remove", "origin"]).then(
                      (result) => {
                        if (result.exitCode !== 0) {
                          throw new Error(
                            result.stderr ?? "Unable to remove remote origin"
                          );
                        }
                      }
                    ),
                },
              ],
              { concurrent: true }
            );
          },
        },
        {
          title: "Install package dependencies with Yarn",
          enabled: () => flags.package === "yarn",
          task: (ctx, task) =>
            execa("yarn", [], { cwd: args.appName }).catch(() => {
              ctx.yarn = false;

              task.skip(
                "Yarn not available, install it via `npm install -g yarn`"
              );
            }),
        },
        {
          title: "Install package dependencies with npm",
          enabled: (ctx) => flags.package === "npm" || ctx.yarn === false,
          task: () => execa("npm", ["install"], { cwd: args.appName }),
        },
        {
          title: "Creating config file",
          task: () =>
            new Promise(async (resolve, reject) => {
              // update config
              noreaConfig.update({
                template: flags.template as any,
                dbStrategy: flags.dbStrategy as any,
              });

              // save config
              await noreaConfig
                .save(args.appName)
                .then(() => {
                  resolve("config file added successfully");
                })
                .catch((err) => {
                  reject(err);
                });
            }),
        },
      ],
      {}
    );

    tasks
      .run()
      .then(() => {
        this.log(
          colors.green("\n Your application has been successfully created!\n")
        );
      })
      .catch((err) => {
        this.log("\n Application creation failed.\n");
      });
  }
}
