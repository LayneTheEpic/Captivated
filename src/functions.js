const lookupTable = require("../json/lookup.json");


function timestamp() {
	let d = new Date(); return `[${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}]`
}



function pad(num, zeroes = 2) {
	return ("0").repeat(zeroes - num.toString().length) + num.toString();
}



function getKey(e) {
	if(lookupTable[e.rawcode]) {return lookupTable[e.rawcode]}
	else {return String.fromCharCode(e.rawcode)}
}


module.exports = {timestamp, pad, getKey}