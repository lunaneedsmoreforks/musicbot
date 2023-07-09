import { CommandModule } from "../../../lib/commandModule";
import ping from "./ping";
import eval from "./eval";
import shell from "./shell";


export default new CommandModule({
  name: 'bot',
  description: 'Bot commands',
  usage: 'bot <subcommand>',
})
  .withSubcommand(ping)
  .withSubcommand(eval)
  .withSubcommand(shell)
