module.exports = {
	
	//makes sure a number is in between two values
	limit: (number, min = 0, max = 4294967296) => {
		return number < min ? min : number > max ? max : number;
	},
	
	//if given array is longer than the max size (default: ten items), it removed everything pastposition ten
	reduce: (array, maxsize = 10) => {
		var ret = [], limit = array.length > maxsize ? maxsize : array.length;
		for (var i = 0; i < limit; i++) {
			ret.push(array[i]);
		}
		return ret;
	},
	
	//returns a number between min and max
	rng: (min, max) => {
		return min + Math.floor(Math.random() * ((max - min) + 1));
	},
	
	//adds all numbers in a list up
	sum: arr => {
		var num = 0;
		arr.forEach(x => {num += x});
		return num;
	},
	
	//same as sum but it multiplies instead of adding
	sumMult: arr => {
		var num = 1;
		arr.forEach(x => {num *= x});
		return num;
	},
	
	//reverses a string
	reverse: str => {
		return str.split('').reverse().join('');
	},
	
	//capitalized first letter
	toFirstCase: str => {
		if (str.length < 2) return str;
		str = str[0].toUpperCase() + str.slice(1).toLowerCase;
	},
	
	//capitalises the first letter of each word if "all" is true, unless "all" isn't, then it acts exactly like toFirstCase
	toGrammarCase: (str, all) => {
		if (!all) return module.exports.toFirstCase(str);
		return str.split(' ').map(module.exports.toFirstCase).join(' ');
	}
};
