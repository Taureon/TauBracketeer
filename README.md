# TauBracketeer
Recreation of RoboTop's Dynamic Responses engine (https://robotop.xyz/customcommands/dynamic)
```js
const TauBracketeer = require('./whereEverItIsIn/TauBracketeer.js');

let string = (
	'{var|valueA|5}'+
	'{var|valueB|6}'+
	'{var|result|{multiply|{valueA}|{valueB}}}'+
	'{valueA} times {valueB} is equal to {result}!'
);

console.log(TauBracketeer(string));
//"5 times 6 is equal to 30!"
```
For using it in discord
```js
whateverFunctionYouUseItIn(TauBracketeer(
	theCode,
	message, //the message object from 'client.on("message")'*/
	args, /*the message content but split on spaces but with the command that was called removed
	config, //object that has the attribute 'prefix' that has a string in it that is your bot's prefix
	client, //result of 'new Discord.Client()'
	Discord //result of 'require("discord.js")'
));
```
There are discord-specific features that only work then the five discord-specific arguments are provided.
