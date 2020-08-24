const { ipcRenderer } = require('electron');

document.addEventListener('drop', (event) => { 
	event.preventDefault(); 
	event.stopPropagation(); 
    for(const file of event.dataTransfer.files) {
        console.log(file.path);
        ipcRenderer.invoke('draggedItem', file.path);
    }
}); 

document.addEventListener('dragover', (e) => { 
	e.preventDefault(); 
	e.stopPropagation(); 
}); 

// document.addEventListener('dragenter', (event) => { 
// 	console.log('File is in the Drop Space'); 
// }); 

// document.addEventListener('dragleave', (event) => { 
// 	console.log('File has left the Drop Space'); 
// }); 
