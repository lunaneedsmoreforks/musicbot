/*

This file imports all the modules

*/
import { _commands } from '../command';
let modules = 0;


import './eval';
modules++;
import './shell';
modules++;


console.log(`Loaded ${modules} modules and ${_commands.length} commands!`)