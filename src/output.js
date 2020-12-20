const {pad} = require("./functions");
const fs = require("fs-extra");
let stream;
let config;

function createStream() {
	let d = new Date();
	fs.ensureDirSync(config.output_directory);
	stream = fs.createWriteStream(`${config.output_directory}/${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}.txt`, {flags: "a"});

	// maybe I'll use timestamp function and chop off milis, replace colons with -
}

function endStream() {
	stream.end();
}

function append(data) {
	stream.write(data + "\n");
}


function outputJSConfig(cf) {
	config = cf;
}


module.exports = {createStream, endStream, append, outputJSConfig}