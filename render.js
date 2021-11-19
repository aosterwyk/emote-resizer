const { ipcRenderer, shell } = require('electron');

function updateStatus(newMsgType, newMsg) {
    let oldStatus = document.getElementById(`statusMsg`);
    if(newMsgType === `error`) {
        msgColor = `text-danger`;
    }
    else if(newMsgType === `success`) {
        msgColor = `text-success`;
    }
    else {
        msgColor = `text-muted`;
    }
    oldStatus.innerHTML = `<small class='${msgColor} text-xl-left'>${newMsg}</small><br>${oldStatus.innerHTML}`;
    console.log(newMsg);
}

ipcRenderer.on(`statusMessage`, (event, msg) => {
    updateStatus(msg.msgType, msg.message);
});

document.addEventListener('drop', (event) => { 
	event.preventDefault(); 
	event.stopPropagation(); 
    for(const file of event.dataTransfer.files) {
        updateStatus(`info`, `Loaded ${file.path}`);
        
        let outputSizes = [];
        if(document.getElementById(`emotes`).checked) { 
            outputSizes.push(28, 56, 112);
        }
        if(document.getElementById(`badges`).checked) {
            outputSizes.push(18, 36, 72);
        }

        let resizeMode = ``;
        let resizeModes = document.getElementsByName(`resizeModeChoice`);
        for(let i=0; i < resizeModes.length; i++) {
            if(resizeModes[i].checked) { 
                resizeMode = resizeModes[i].value;
            }
        }
        updateStatus(`info`, `Using resize mode: ${resizeMode}`);

        let resizeJob = {
            filePath: file.path,
            resizeMode: resizeMode,
            resolutions: outputSizes
        }
        ipcRenderer.invoke('draggedItem', resizeJob);
    }
}); 

document.addEventListener('dragover', (e) => { 
	e.preventDefault(); 
	e.stopPropagation(); 
}); 

function externalLink(destination) {
    if(destination == `discord`) {
        shell.openExternal(`https://discord.gg/QNppY7T`);
    }
    if(destination == `help`) {
        shell.openExternal(`https://github.com/aosterwyk/emote-resizer/wiki`); 
    }
}
