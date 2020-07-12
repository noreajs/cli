import {Command, flags} from '@oclif/command'
import { InterfaceCommandHelper } from '../../helpers/InterfaceCommandHelper'
import NoreaConfigHelper from '../../helpers/NoreaConfigHelper'
import { resolve } from 'path';
import { readFileSync } from 'fs';

export default class MakeInterface extends Command {
  static description = 'create a new interface'

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [
    {
      name: "interfaceName",
      required: true,
      description: "interface name",
    },
  ];

  async run() {
    const {args, flags} = this.parse(MakeInterface)

    const configHelper = new NoreaConfigHelper();

    if (!configHelper.initialized) {
      this.log("There is not norea.js project in this folder.");
    } else {
      await InterfaceCommandHelper.createModal(this, {
        interfaceName: args.interfaceName,
        config: configHelper.config,
        template: readFileSync(
            resolve(__dirname, `../../templates/interface.mustache`)
          )
          .toString()
      });
    }
  }
}
