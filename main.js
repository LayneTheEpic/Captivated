const {BrowserWindow, app, ipcMain} = require("electron");
const iohook = require("iohook");
const fs = require("fs-extra");


const {createStream, endStream, append, outputJSConfig} = require("./src/output");
const {timestamp, getKey} = require("./src/functions");


let keyLogging = false;
let config;


let window;


app.whenReady().then(() => {
	window = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},

		contextIsolation: false,

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

	let fixedOutputDirectory = config.output_directory.split("\\").join("/");

	let formattedConfig = `{\n\t"track_keyups": ${config.track_keyups},\n\t"log_timestamps": ${config.log_timestamps},\n\t"output_directory": \"${fixedOutputDirectory}\"\n}`;

	fs.writeFileSync("json/config.json", formattedConfig, err => {
		if(err) {return console.error(err)}
	});

	outputJSConfig(config);
});


ipcMain.once("send config", e => {
	config = fs.readFileSync("json/config.json", "utf8", (err, data) => {
		if(err) {return console.error(err)}
		else {return data};
	});

	
	config = JSON.parse(config);
	
	outputJSConfig(config);

	window.webContents.send("returned config", config);
});





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