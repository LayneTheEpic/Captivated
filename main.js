const {BrowserWindow, app, ipcMain} = require("electron");
const iohook = require("iohook");
const fs = require("fs");


const {timestamp, pad, getKey} = require("./src/functions");


let keyLogging = false;
let config;

let stream;

let window;


app.whenReady().then(() => {
	window = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},

		show: false
	});

	window.loadFile("window/index.html");
	//window.webContents.openDevTools();

	//window.removeMenu();

	window.maximize();

	window.show();
});


ipcMain.on("set logging state", (e, val) => {
	keyLogging = val;

	if(keyLogging) createStream();
	else endStream();
});


ipcMain.on("config update", (e, val) => {
	config = val;

	console.log(val);

	let fixedOutputDirectory = config.output_directory.split("\\").join("\\\\")	

	let formattedConfig = `{\n\t"track_keyups": ${config.track_keyups},\n\t"log_timestamps": ${config.log_timestamps},\n\t"output_directory": \"${fixedOutputDirectory}\"\n}`;

	fs.writeFileSync("json/config.json", formattedConfig, err => {
		if(err) {return console.error(err)}
	});
});


ipcMain.once("send config", e => {
	config = fs.readFileSync("json/config.json", "utf8", (err, data) => {
		if(err) {return console.error(err)}
		else {return data};
	});
	
	config = JSON.parse(config);
	
	window.webContents.send("returned config", config);
});





//#region file shit
function createStream() {
	let d = new Date();
	stream = fs.createWriteStream(`${config.output_directory}/${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}.txt`, {flags: "a"});
}

function endStream() {
	stream.end();
}

function append(data) {
	stream.write(data + "\n");
}
//#endregion file shit



//#region iohook
iohook.on("keydown", e => {
	if(!keyLogging) {return}

	append(`${(config.log_timestamps) ? timestamp() + " " : ""}Key ${getKey(e)} down`);
});

iohook.on("keyup", e => {
	if(!keyLogging || !config.track_keyups) {return}

	append(`${(config.log_timestamps) ? timestamp() + " " : ""}Key ${getKey(e)} up`);
});

iohook.start();
//#endregion iohook