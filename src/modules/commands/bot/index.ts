import { CommandModule } from "../../../lib/commandModule";
import ping from "./ping";


export default new CommandModule({
  name: 'bot',
  description: 'Bot commands',
  usage: 'bot <subcommand>',
})
  .withSubcommand(ping)
