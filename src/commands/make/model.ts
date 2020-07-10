import { Command, flags } from "@oclif/command";

export default class MakeModel extends Command {
  static description = "create a new model";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(MakeModel);

    const name = flags.name ?? "world";
    this.log(
      `hello ${name} from F:\\codes-sources-projets\\node-js\\noreajs-cli\\src\\commands\\make\\model.ts`
    );
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
