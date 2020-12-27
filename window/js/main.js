const {ipcRenderer} = require("electron");

const trackKeyups = document.getElementById("track-keyups");
const logTimestamps = document.getElementById("log-timestamps");
const logButton = document.getElementById("log");
const directoryChooser = document.getElementById("output");
const directoryText = document.getElementById("output-location");


let keyLogging = false;
let initialConfig = true;

let outputDirectory = "";

logButton.addEventListener("click", () => {
	keyLogging = !keyLogging;

	logButton.classList.toggle("logging");
	
	
	(async () => {
		await new Promise(res => {setTimeout(res, 500)})

		if(keyLogging) {
			logButton.innerText = "Stop";

			trackKeyups.setAttribute("disabled", "");
			logTimestamps.setAttribute("disabled", "");
		} else {
			logButton.innerText = "Start";

			trackKeyups.removeAttribute("disabled");
			logTimestamps.removeAttribute("disabled");
		}
	})();


	ipcRenderer.send("set logging state", keyLogging);
});


function changeDirectory() {
	if(!keyLogging) {directoryChooser.click()}
}