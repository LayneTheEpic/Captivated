trackKeyups.addEventListener("change", e => {
	if(!initialConfig)
		updateConfig(...getConfig())
});

logTimestamps.addEventListener("change", e => {
	if(!initialConfig)
		updateConfig(...getConfig())
});

directoryChooser.addEventListener("change", e => {
	if(!initialConfig)
		updateConfig(...getConfig());
});



function getConfig() {
	return [trackKeyups.checked,
			logTimestamps.checked,

			(!!directoryChooser.files[0]) ?
			directoryChooser.files[0].path.split("\\").reverse().slice(1).reverse().join("/")
			:
			outputDirectory
	];
}


function updateConfig(tKState, lTState, output) {
	ipcRenderer.send("config update", {
		track_keyups: tKState,
		log_timestamps: lTState,
		output_directory: output
	});

	directoryText.innerText = output;
}




ipcRenderer.send("send config");
ipcRenderer.once("returned config", (e, config) => {
	if(config.log_timestamps) {
		logTimestamps.setAttribute("checked", "true");
	} else {
		trackKeyups.removeAttribute("checked");
	}

	if(config.track_keyups) {
		trackKeyups.setAttribute("checked", "true");
	} else {
		trackKeyups.removeAttribute("checked");
	}

	directoryText.innerText = config.output_directory;
	outputDirectory = config.output_directory;

	initialConfig = false;
});