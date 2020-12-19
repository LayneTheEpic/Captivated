trackKeyups.addEventListener("change", e => {
	if(!initialConfig)
		updateConfig(trackKeyups.checked, logTimestamps.checked, (directoryChooser.files) ? directoryChooser.files[0].path.split("\\").reverse().slice(1).reverse().join("\\") : outputDirectory);
});

logTimestamps.addEventListener("change", e => {
	if(!initialConfig)
		updateConfig(trackKeyups.checked, logTimestamps.checked, (directoryChooser.files) ? directoryChooser.files[0].path.split("\\").reverse().slice(1).reverse().join("\\") : outputDirectory);
});

directoryChooser.addEventListener("change", e => {
	if(!initialConfig)
		updateConfig(trackKeyups.checked, logTimestamps.checked, (directoryChooser.files) ? directoryChooser.files[0].path.split("\\").reverse().slice(1).reverse().join("\\") : outputDirectory);
});



function updateConfig(tKState, lTState, output) {
	ipcRenderer.send("config update", {
		track_keyups: tKState,
		log_timestamps: lTState,
		output_directory: output
	});

	console.log("sending", {
		track_keyups: tKState,
		log_timestamps: lTState,
		output_directory: output
	})
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

	outputDirectory = config.output_directory;

	//outputDirectoryText.innerHTML = config.output_directory;

	initialConfig = false;
});