module.exports = (code = "", message = {}, args = [], config = {}, bot, Discord) => {
	// Array args
	let arArgs = removeA(args, '');
	// Unix date
	let udate = new Date().getTime() / 1000;
	// Preset variables for single-tag responses
	let tvars = {
		'username': message.author.username,
		'tag': message.author.tag,
		'@': `<@${message.author.id}>`,
		'nickname': message.member.displayName,
		'discrim': message.author.discriminator,
		'id': message.author.id,
		'avatar': message.author.avatarURL(),
		'color': message.member.displayHexColor,
		'status': message.author.presence.status,
		'bot': message.author.bot.toString(),
		'joined': message.member.joinedAt.getTime() / 1000,
		'created': message.author.createdAt.getTime() / 1000,
		'prefix': config.prefix,
		'server': message.guild.name,
		'channel': message.channel.name,
		'args': arArgs.join(' '),
		'unix': udate
	};
	// Calculate multi-tag responses
	function calculate(array) {
		// Remove defining tag
		let arrayArgs = array.slice(1);
		// Attempt to find a user
		try {
			var user = message.guild.members.cache.find(user => user.id == array[1]);
			if (!user) var user = message.guild.members.cache.find(user => user.user.username == array[1]);
			if (!user) var user = message.guild.members.cache.find(user => user.nickname == array[1]);
			if (!user) var user = undefined;
		} catch (error) {
			console.log(error)
		};
		// If there's a second tag
		if (arrayArgs[0]) {
			switch (array[0]) {
				case "rng":
					array = array.slice(1).map(Number);
					if (array.includes(NaN)) return 0;
					if (!array[1]) {
						array.push(array[0]);
						array[0] = 0;
					}
					return rng(array[0], array[1]);
				case "add":
					return array[1] + sum(array.slice(2).map(Number));
				case "subtract":
					return array[1] - sum(array.slice(2).map(Number));
				case "multiply":
					return array[1] * sumMult(array.slice(2).map(Number));
				case "divide":
					return array[1] / sumMult(array.slice(2).map(Number));
				case "modulo":
					array = array.slice(1).map(Number);
					var num = array.shift();
					array.forEach(x => {
						num %= x
					});
					return num;
				case "xor":
					var num = 0;
					array.slice(1).map(x => num ^= Number(x));
					return num
				case "var":
					if (typeof array[2] === 'string') {
						tvars[array[1]] = array[2];
						return "";
					}
					return tvars[array[1]];
				case "test":
					return array[1] === array[2] ? array[3] || '' : array[4] || '';
				case "round":
					return Math.round(Number(array[1]));
				case "fixed":
					return decimalRound(array[1], array[2]);
				case "highest":
					return Math.max(...array.slice(1).map(Number));
				case "lowest":
					return Math.min(...array.slice(1).map(Number));
				case "absolute":
					return Math.abs(Number(array[1]));
				case "clamp":
					return limit(...array.slice(1).map(Number));
				case "commafy":
					return commafy(array[1]);
				case "nth":
					switch (Math.abs(Number(array[1])) % 10) {
						case 1:
							return array[1] + "st";
						case 2:
							return array[1] + "nd";
						case 3:
							return array[1] + "rd";
						default:
							return array[1] + "th";
					};
				case "replace":
					return array[4] ? array[1].replace(new RegExp(array[2], "g"), array[3]) : array[1].replace(new RegExp(array[2], "gi"), array[3]);
				case "length":
					return array[1].length
				case "lower":
					return array[1].toLowerCase();
				case "upper":
					return array[1].toUpperCase();
				case "reverse":
					return reverse(array[1]);
				case "capitalize":
					return toGrammarCase(array[1], array[2] === "true");
				case "url":
					return encodeURIComponent(array[1]);
				case "choose":
					array.shift();
					return array[rng(0, array.length - 1)];
				case "multichoose":
					return multichoose(array.slice(3), array[1]).join(array[2]);
				case "repeat":
					if (!isNaN(Number(array[2]))) {
						return array[1].repeat(limit(Number(array[2]), 0, 100))
					};
				case "comment":
				case "#":
					return "";
				case "date":
					return createDate(array);
					// BUG: CAUSES CODE TO LOOP DUE TO ATTEMPTING TO REPLACE {ARGS} OVER AND OVER
				case "args":
					if (!array[1]) return arArgs.join(' ');
					if (array[2]) {
						return arArgs.slice(array[1] - 1, array[2]).join(' ');
					};
					return arArgs[array[1] - 1] ? arArgs[array[1] - 1] : '';
				case 'empty':
					for (var i = 1; array[i] === "" && i < array.length; i++) {}
					return array[i];
				case "power":
					var num = array[1];
					array.slice(2).forEach(x => num **= Number(x));
					return num;
				case 'username':
					return user ? user.user.username : 'Unknown';
				case 'tag':
					return user ? user.user.tag : 'Unknown';
				case '@':
					return user ? `<@${user.id}>` : 'Unknown';
				case 'nickname':
					return user ? user.displayName : 'Unknown';
				case 'discrim':
					return user ? user.user.discriminator : 'Unknown';
				case 'id':
					return user ? user.id : 'Unknown';
				case 'avatar':
					return user ? user.user.avatarURL() : 'Unknown';
				case 'color':
					return user ? user.displayHexColor : 'Unknown';
				case 'status':
					return user ? user.user.presence.status : 'Unknown';
				case 'bot':
					return user ? `${user.user.bot}` : 'Unknown';
				case 'joined':
					return user ? user.joinedAt.getTime() / 1000 : 'Unknown'
				case 'created':
					return user ? user.user.createdAt.getTime() / 1000 : 'Unknown';
				case 'channel':
					var targetChannel = message.channel;
					if (array[2]) targetChannel = bot.channels.cache.find(c => c.id == array[2]);
					switch (array[1]) {
						case 'name':
							return targetChannel.name;
						case 'id':
							return targetChannel.id;
						case 'topic':
							return targetChannel.topic ? targetChannel.topic : 'none';
						case 'type':
							return targetChannel.type;
						case 'nsfw':
							return targetChannel.nsfw ? targetChannel.nsfw.toString() : 'Unknown';
						case 'category':
							if (!targetChannel.parentID) return 'none';
							let parentID = targetChannel.parentID;
							let parent = message.guild.channels.cache.find(c => c.id == parentID);
							return parent ? parent.name : 'none';
						case 'tag':
							return targetChannel.toString();
						case 'url':
							return `https://discord.com/channels/${message.guild.id}/${targetChannel.id}`;
						case 'slowmode':
							return targetChannel.rateLimitPerUser ? targetChannel.rateLimitPerUser : '0';
					};
					return 'Unknown';
				case 'server':
					switch (array[1]) {
						case 'name':
							return message.guild.name;
						case 'id':
							return message.guild.id;
						case 'members':
							return message.guild.memberCount;
						case 'bots':
							return message.guild.members.cache.filter(m => m.user.bot === true).size;
						case 'roles':
							return message.guild.roles.cache.size;
						case 'channels':
							if (!array[2]) return message.guild.channels.cache.size;
							switch (array[2]) {
								case 'text':
									return message.guild.channels.cache.filter(c => c.type === 'text').size;
								case 'voice':
									return message.guild.channels.cache.filter(c => c.type === 'voice').size;
								case 'news':
									return message.guild.channels.cache.filter(c => c.type === 'news').size;
							}
							return 'Unknown';
						case 'categories':
							return message.guild.channels.cache.filter(c => c.type === 'category').size;
						case 'emojis':
							if (array[2] == 'animated') return message.guild.emojis.cache.filter(c => c.animated === true).size;
							if (array[2] == 'still') return message.guild.emojis.cache.filter(c => c.animated === false).size;
							if (!array[2]) return message.guild.emojis.cache.size;
							return 'Unknown';
						case 'boost':
							if (array[2] == 'count') return message.guild.premiumSubscriptionCount;
							if (array[2] == 'tier') return message.guild.premiumTier;
							return 'Unknown';
						case 'region':
							return message.guild.region;
						case 'filter':
							return message.guild.explicitContentFilter;
						case 'verification':
							return message.guild.verificationLevel;
						case 'notifs':
							return message.guild.defaultMessageNotifications;
						case 'created':
							return message.guild.createdAt.getTime();
						case 'owner':
							return message.guild.ownerID;
						case 'icon':
							return message.guild.iconURL();
					}
					return 'Unknown';
			};
		};
		// If there is only one tag return preset var
		return tvars[array[0]] || `{${array.join('|')}}`;
	};
	// What the fuck does literation mean
	function literation(str = "") {
		// Find response
		return str.replace(/{[^{]+?}/g, substring => {
			// Replace with calculated response
			return calculate(substring.slice(1, -1).split("|")).toString() || "";
		});
	};
	// Literate each possible response
	var prevCode = "";
	while (prevCode !== code) {
		prevCode = code;
		code = literation(code);
	};
	// If it return nothing, return "Empty" to prevent error
	if (code == '') return 'Empty';
	// If message is too big
	if (code.length > 2000) return 'Message to big!';
	// Return message with calculated responses
	return code;
};

// FUNCTIONS
// Limit number between two values
function limit(number, min = 0, max = 4294967296) {
	return number < min ? min : number > max ? max : number;
};
// Reduce array two certain number of items (default is 10)
function reduce(array, maxsize = 10) {
	var ret = [],
		limit = array.length > maxsize ? maxsize : array.length;
	for (var i = 0; i < limit; i++) {
		ret.push(array[i]);
	}
	return ret;
};
// Create array of range of numbers
function range(min = 0, max = min) {
	max++;
	var ret = [];
	for (var i = min; i < max; i++) {
		ret.push(i);
	}
	return ret;
};
// Return a random number between two values
function rng(min, max) {
	return min + Math.floor(Math.random() * ((max - min) + 1));
};
// Format number into commafied version (1000000 -> 1,000,000)
function commafy(num) {
	var str = num.toString().split('.');
	if (str[0].length > 3) {
		str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
	}
	if (str[1] && str[1].length > 3) {
		str[1] = str[1].replace(/(\d{3})/g, '$1,');
		if (str[1].endsWith(",")) str[1] = str.slice(0, -1);
	}
	return str.join('.');
};
// Adds all numbers in a list
function sum(arr) {
	var num = 0;
	arr.forEach(x => {
		num += x
	});
	return num;
};
// Multiply all numbers in a list
function sumMult(arr) {
	var num = 1;
	arr.forEach(x => {
		num *= x
	});
	return num;
};
// ... round decimals I think?
function decimalRound(num, dec) {
	dec = Math.pow(10, dec);
	return Math.round(num * dec) / dec;
};
// Reverses a string
function reverse(str) {
	return str.split('').reverse().join('');
};
// Capitalize first letter in string
function toFirstCase(str) {
	if (str.length < 2) return str;
	str = str[0].toUpperCase() + str.slice(1).toLowerCase();
};
// Capitalises the first letter of each word if "all" is true, unless "all" isn't, then it acts exactly like toFirstCase
function toGrammarCase(str, all) {
	if (!all) return module.exports.toFirstCase(str);
	return str.split(' ').map(module.exports.toFirstCase).join(' ');
};
// Shuffles an array
function shuffle(arr) {
	var ret = Array(arr.length);
	var picked = [];
	var j = Math.floor(Math.random() * ret.length);
	for (var i = 0; i < ret.length; i++) {
		while (picked.includes(j)) j = Math.floor(Math.random() * ret.length);
		ret[i] = arr[j];
		picked.push(j)
	}
	return ret;
};
// Chooses multiple things from an array
function multichoose(arr, n) {
	if (isNaN(parseInt(n))) n = 1;
	var result = []
	var extendedArr = [];
	while (extendedArr.length < n) shuffle(arr).forEach(x => extendedArr.push(x));
	for (var i = 0; i < n; i++) result.push(extendedArr[i]);
	return result;
};
// Removes item from array by value
function removeA(arr) {
	var what, a = arguments,
		L = a.length,
		ax;
	while (L > 1 && arr.length) {
		what = a[--L];
		while ((ax = arr.indexOf(what)) !== -1) {
			arr.splice(ax, 1);
		}
	}
	return arr;
};
// Creates a formmated date (just the old case: 'date' code moved here so I don't have to look at it)
function createDate(array) {
	let date = new Date();
	if (array[2]) date = new Date(date.getTime() + (3600000 * parseInt(array[2])));
	if (array[3]) date = new Date(parseInt(array[3]) * 1000 + (3600000 * parseInt(array[2])));
	let dayString = date.getDay().toString().replace('0', 'Sunday').replace('1', 'Monday').replace('2', 'Tuesday').replace('3', 'Wednesday').replace('4', 'Thursday').replace('5', 'Friday').replace('6', 'Saturday');
	let dayStringShort = dayString.substring(0, 3);
	let dayStringShorter = dayString.substring(0, 2);
	let day = date.getUTCDate();
	let month = date.getUTCMonth() + 1;
	if (month.toString().length == 1) {
		var longMonth = `0${month}`;
	} else {
		longMonth = `${month}`;
	};
	let longerMonth = month.toString().replace(12, 'December').replace(11, 'November').replace(10, 'October').replace(9, 'September').replace(8, 'August').replace(7, 'July').replace(6, 'June').replace(5, 'May').replace(4, 'April').replace(3, 'March').replace(2, 'February').replace(1, 'January');
	let year = date.getUTCFullYear();
	let shortYear = year.toString().substring(2, 4);
	let hour = date.getUTCHours();
	let meridiem = hour >= 12 ? 'p.m.' : 'a.m.';
	if (hour >= 12) hour = hour - 12;
	if (hour == 0) hour = 12;
	if (hour.toString().length == 1) {
		var longHour = `0${hour}`
	} else {
		var longHour = hour;
	};
	let minutes = date.getUTCMinutes();
	let seconds = date.getUTCSeconds();
	if (minutes.toString().length == 1) minutes = `0${minutes}`;
	if (seconds.toString().length == 1) seconds = `0${seconds}`;
	let formatted = array[1].replace(/A/g, 'l%&ll%&ll%&l').replace(/DD/g, day).replace(/D/g, day).replace(/MMMM/g, 'k%&kk%&kk%&k').replace(/MMM/g, 'j%&jj%&jj%&j').replace(/MM/g, longMonth).replace(/M/g, month).replace(/YYYY/g, year).replace(/YY/g, shortYear).replace(/Y/g, year).replace(/hh/g, longHour).replace(/h/g, hour).replace(/mm/g, minutes).replace(/m/g, minutes).replace(/ss/g, seconds).replace(/s/g, seconds).replace(/dddd/g, dayString).replace(/ddd/g, dayStringShort).replace(/dd/g, dayStringShorter).replace(/j%&jj%&jj%&j/g, longerMonth.substring(0, 3)).replace(/k%&kk%&kk%&k/g, longerMonth).replace(/l%&ll%&ll%&l/g, meridiem);
	return formatted;
};
