const functions = require('./functions.js');

module.exports = (code = "", message = {}, args = [], config = {}, client, Discord) => {
	
	//why is the prefix an exclaimation mark? because everyone uses it for some reason (c'mon, be creative, lads)
	config.prefix = config.prefix || "!";

	//if both of them dont exist, make them an empty attribute object so it doesnt throw an error
	message.guild = message.guild || {};
	message.member = message.member || {};
	
	//pre-defined variables
	let tvars = {
		'@': `<@${message.author.id}>`,
		'id': message.author.id,
		'color': message.author.tag,
		'discrim': message.author.discriminator,
		'nickname': message.member.displayName,
		'username': message.author.username
	};

	function calculate(array) {
		if (array[1]) {
			switch (array[0]) {
					
				//returns random number 
				case "rng":
					array.shift()
					array = array.map(Number);
					if (!array[1]) {
						array.push(array[0]);
						array[0] = 0;
					}
					if (array.includes(NaN)) return 0;
					return functions.rng(array[0], array[1]);
					
				case "add":
					array.shift()
					array = array.map(Number);
					return array.shift() + functions.sum(array);
					
				case "subtract":
					array.shift()
					array = array.map(Number);
					return array.shift() - functions.sum(array);
					
				case "multiply":
					array.shift()
					array = array.map(Number);
					return array.shift() * functions.sumMult(array);
					
				case "divide":
					array.shift()
					array = array.map(Number);
					return array.shift() / functions.sumMult(array);
				
				//sets/gets variable
				case "var":
					if (typeof array[2] === 'string') {
						tvars[array[1]] = array[2];
						return "";
					}
					return `{${array.join('|')}}`;

				//if item 1 and item 2 are equal, returns 3rd string, else it returns 4th one
				case "test":
					if (typeof array[4] === 'string') {
						if (array[1] === array[2]) {
							return array[3];
						} else {
							return array[4];
						}
					}

				//returns length of string
				case "length":
					return array[1].length

				//turns string lowercase
				case "lower":
					return array[1].toLowerCase();

				//turns string uppercase
				case "upper":
					return array[1].toUpperCase();

				//reverses string
				case "reverse":
					return functions.reverse(array[1]);

				//read functions.js
				case "capitalize":
					return functions.toGrammarCase(array[1], array[2] === "true");

				//url encoder
				case "url":
					return encodeURIComponent(array[1]);

				//chooses random string from the array
				case "choose":
					array.shift();
					return array[functions.rng(0, array.length - 1)];

				//repeats string
				case "repeat":
					if (!isNaN(Number(array[2]))) {
						return array[1].repeat(functions.limit(Number(array[2]), 0, 100))
					}
					
				//comments, so other people who read the code can understand what the hell is going on
				case "comment":
				case "#":
					return "";
			}
		}
		//if no pipes (this character => "|"), it is probably a variable, else just return it, maybe it gets defined later
		return tvars[array[0]] || `{${array.join('|')}}`;
	}
	
	//cant explain that one, just look at it and hopefully you will understand it
	function literation(str = "") {
		return str.replace(/{[^{]+?}/g, substring => {
			return calculate(substring.slice(1, -1).split("|")).toString() || "";
		});
	}
	
	//run until literation doesnt change anything
	var prevCode = "";
	while (prevCode !== code) {
		prevCode = code;
		code = literation(code);
	}
	return code;
};
