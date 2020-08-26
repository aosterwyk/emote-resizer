const fs = require('fs');
const Jimp = require('jimp');
const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const emoteSizes = [112, 56, 28];
var win;

// const testImg = 'test.png'; // test file 

function sendStatusMsg(newMsgType, newMsg) {
    let sendMsg = {
        msgType: newMsgType,
        message: newMsg
    }
    win.webContents.send('statusMessage', sendMsg);
    console.log(newMsg);
}

async function resize(imgName, newSizeWidth, newSizeHeight, newResizeMode) {
    if(imgName.includes('.png')) {
        // console.log(`Reading image ${imgName}`);
        sendStatusMsg(`info`,`Reading image ${imgName}`);
        const sourceImg = await Jimp.read(`${imgName}`);
        // console.log(`Resizing image ${imgName}`);
        sendStatusMsg(`info`,`Resizing image ${imgName}`);
        let resizeMode = Jimp.RESIZE_BILINEAR; 
        if(newResizeMode !== `default`) {
            if(newResizeMode == `nearestNeighbor`) {
                resizeMode = Jimp.RESIZE_NEAREST_NEIGHBOR;
            }
            else if(newResizeMode == `bilinear`) {
                resizeMode = Jimp.RESIZE_BILINEAR;
            }
            else if(newResizeMode == `bicubic`) {
                resizeMode = Jimp.RESIZE_BICUBIC;
            }
            else if(newResizeMode == `hermite`) {
                resizeMode = Jimp.RESIZE_HERMITE;
            }
            else if(newResizeMode == `bezier`) {
                resizeMode = Jimp.RESIZE_BEZIER;
            }
        }
        sourceImg.resize(newSizeWidth, newSizeHeight, resizeMode);
        // console.log(`${imgName} resized to ${newSizeWidth} x ${newSizeHeight} (${resizeMode})`);
        sendStatusMsg(`success`, `${imgName} resized to ${newSizeWidth} x ${newSizeHeight} (${resizeMode})`);
        let splitImgName = imgName.split(".png");
        let newFilename = `${splitImgName[0]}-${newSizeHeight}x${newSizeWidth}.png`;
        try {
            await sourceImg.writeAsync(newFilename);
        }
        catch(error) {
            sendStatusMsg(`error`, `Error saving image ${newFilename}: ${error}`);
        }
        // console.log(`Resized image saved to ${newFilename}`);
        sendStatusMsg(`success`, `Resized image saved to ${newFilename}`);
    }
    else { sendStatusMsg(`error`, 'Filename does not end in .png. Skipping...'); }
}

function createWindow() { 
    win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('index.html');
    win.menuBarVisible = false;
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.handle('draggedItem', async (event, args) => {
    for(let i = 0; i < args.resolutions.length; i++) {
        await resize(args.filePath, args.resolutions[i], args.resolutions[i], args.resizeMode);
    }
});
