// get references to our html elements
const
	fileList = document.getElementById('file-list');

// helper function to list uploaded files
function listUploadedFiles() {
	// remove the existing list items
	while (fileList.children.length) {
		fileList.lastChild.remove();
	}
	// fetch the list of files from the server
	fetch('/list')
		// convert the response to a json object
		.then(response => response.json())
		// process the json object
		.then(files => {
			// check if there are any files
			if (files.length) {
				// add a list item for each file
				files.forEach(file => {
					// create a link to the file
					const fileLink = document.createElement('a');
					fileLink.textContent = file;
					fileLink.href = `/uploads/${file}`;
					fileLink.target = '_blank';
					// add the link to a list item
					const listItem = document.createElement('li');
					listItem.appendChild(fileLink);
					// add the list item to the list
					fileList.appendChild(listItem);
				});
			} else {
				// create a list item with the placeholder text
				const emptyListItem = document.createElement('li');
				emptyListItem.textContent = 'No files found.';
				// add the list item to the list
				fileList.appendChild(emptyListItem);
			}
		});
}

// This example uses MediaRecorder to record from a live audio stream,
// and uses the resulting blob as a source for an audio element.
//
// The relevant functions in use are:
//
// navigator.mediaDevices.getUserMedia -> to get audio stream from microphone
// MediaRecorder (constructor) -> create MediaRecorder instance for a stream
// MediaRecorder.ondataavailable -> event to listen to when the recording is ready
// MediaRecorder.start -> start recording
// MediaRecorder.stop -> stop recording (this will generate a blob of data)
// URL.createObjectURL -> to create a URL from a blob, which we can use as audio src

var recordButton, stopButton, recorder;

window.onload = function () {
	recordButton = document.getElementById('record');
	stopButton = document.getElementById('stop');

	// get audio stream from user's mic
	navigator.mediaDevices.getUserMedia({
		audio: true
	})
		.then(function (stream) {
			recordButton.disabled = false;
			recordButton.addEventListener('click', startRecording);
			stopButton.addEventListener('click', stopRecording);
			recorder = new MediaRecorder(stream);

			// listen to dataavailable, which gets triggered whenever we have
			// an audio blob available
			recorder.addEventListener('dataavailable', onRecordingReady);
		});
};

function startRecording() {
	recordButton.disabled = true;
	stopButton.disabled = false;

	recorder.start();
}

function stopRecording() {
	recordButton.disabled = false;
	stopButton.disabled = true;

	// Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
	recorder.stop();
}

function onRecordingReady(e) {
	var audio = document.getElementById('audio');
	// e.data contains a blob representing the recording
	const formData = new FormData();
	formData.append('recording', e.data);
	fetch(
			'/upload',
			{
				method: 'POST',
				body: formData
			}
		)
		.then(() => {
			listUploadedFiles();
		});
}

// list the uploaded files on page load
listUploadedFiles();