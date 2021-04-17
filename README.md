# TauBracketeer
Recreation of RoboTop's Dynamic Responses engine
```js
const TauBracketeer = require('./whereEverItIsIn/TauBracketeer.js');

let string =	'{var|valueA|5}'+
		'{var|valueB|6}'+
		'{var|result|{multiply|{valueA}|{valueB}}}'+
		'{valueA} times {valueB} is equal to {result}!';

console.log(TauBracketeer(string));
//"5 times 6 is equal to 30!"
```
For using it in discord
```js
whateverFunctionYouUseItIn(TauBracketeer(
	theCode,
	message, //the message object from client.on('message')*/, args /*the message but split on spaces WITHOUT the command that was called!
	config, //object that has the attribute 'prefix' that has a string that is your bot's prefix
	Discord //result of 'require("discord.js")'
));
```
there are discord-specific features that only work then the three discord-specific arguments
