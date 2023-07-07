import { CommandModule } from "../../../lib/commandModule";

import add from "./add";
import remove from "./remove";
import info from "./info";
export default new CommandModule({
  name: 'user',
  description: 'User commands',
  usage: 'user <subcommand>',
})
  .withSubcommand(add)
  .withSubcommand(remove)
  .withSubcommand(info)