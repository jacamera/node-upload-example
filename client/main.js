// get references to our html elements
const
	fileList = document.getElementById('file-list'),
	textInput = document.getElementById('text-input'),
	fileInput = document.getElementById('file-input');

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

// attach a listener to the submit button
document
	.getElementById('submit-button')
	.addEventListener('click', event => {
		// prevent the default form submission behavior
		event.preventDefault();
		// create a FormData object to hold the form values
		const formData = new FormData();
		// get the text from the text input
		formData.append('testText', textInput.value);
		// get the file from the file input
		formData.append('testFile', fileInput.files[0]);
		// send the data to the server
		fetch(
				'/upload',
				{
					method: 'POST',
					body: formData
				}
			)
			.then(() => {
				// update the file list after uploading
				listUploadedFiles();
			});
	});

// list the uploaded files on page load
listUploadedFiles();