import { Command, flags } from "@oclif/command";
import colors = require("colors");
import figlet = require("figlet");

export default class Hello extends Command {
  static description = "describe the command here";

  static examples = [`$ norea hello`];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(Hello);

    this.log(
      colors.green(
        figlet.textSync("Norea.js", {
          font: "Standard",
        })
      )
    );

    this.log("\tHello funny guy\n");
  }
}
