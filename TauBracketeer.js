const functions = require('./functions.js');

//https://robotop.xyz/customcommands/dynamic

module.exports = (code = "", message, args, config, client, Discord) => {

	message.guild = message.guild || {};
	message.member = message.member || {};
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
					
				case "var":
					if (!tvars[array[1]]) return `{${array.join('|')}}`;
					tvars[array[1]] = array[2];
					return "";

				case "test":
					if (array[4]) {
						if (array[1] === array[2]) {
							return array[3];
						} else {
							return array[4];
						}
					}

				case "length":
					return array[1].length

				case "lower":
					return array[1].toLowerCase();

				case "reverse":
					return functions.reverse(array[1]);

				case "capitalize":
					return functions.toGrammarCase(array[1], array[2] === "true");

				case "upper":
					return array[1].toUpperCase();

				case "choose":
					array.shift();
					return array[functions.rng(0, array.length - 1)];

				case "repeat":
					if (!isNaN(Number(array[2]))) {
						return array[1].repeat(functions.limit(Number(array[2]), 0, 100))
					}
				case "comment":
				case "#":
					return "";
			}
		}
		return tvars[array[0]] || `{${array.join('|')}}`;
	}
	function literation(str = "") {
		return str.replace(/{[^{]+?}/g, substring => {
			return calculate(substring.slice(1, -1).split("|")).toString() || "";
		});
	}
	var prevCode = "";
	while (prevCode !== code) {
		prevCode = code;
		code = literation(code);
	}
	return code;
};
