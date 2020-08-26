const { ipcRenderer, shell } = require('electron');

document.addEventListener('drop', (event) => { 
	event.preventDefault(); 
	event.stopPropagation(); 
    for(const file of event.dataTransfer.files) {
        // console.log(file.path);
        
        let outputSizes = [];
        if(document.getElementById(`emotes`).checked) { 
            outputSizes.push(28, 56, 112);
        }
        if(document.getElementById(`badges`).checked) {
            outputSizes.push(18, 36, 72);
        }
        console.log(outputSizes);

        let resizeMode = ``;
        let resizeModes = document.getElementsByName(`resizeModeChoice`);
        for(let i=0; i < resizeModes.length; i++) {
            if(resizeModes[i].checked) { 
                // console.log(`${resizeModes[i].value} is checked`);
                resizeMode = resizeModes[i].value;
            }
            else {
                // console.log(`${resizeModes[i].value} is not checked`);
            }
        }
        // console.log(`Using resize mode: ${resizeMode}`);

        let resizeJob = {
            filePath: file.path,
            resizeMode: resizeMode,
            resolutions: outputSizes
        }
        ipcRenderer.invoke('draggedItem', resizeJob);
        // ipcRenderer.invoke('draggedItem', file.path);        
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

function externalLink(destination) {
    if(destination == `discord`) {
        shell.openExternal(`https://discord.gg/QNppY7T`);
    }
    if(destination == `help`) {
        shell.openExternal(`https://github.com/VariXx/emote-resizer/wiki`); 
    }
}
