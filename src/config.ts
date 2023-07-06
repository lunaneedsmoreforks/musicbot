import _config from '../config.json'
interface Config {
  token: string;
  prefix: string;
  owners: string[];
}

var config = _config as Config;

export default config;

export const token = config.token;
export const prefix = config.prefix;
export const owners = config.owners;