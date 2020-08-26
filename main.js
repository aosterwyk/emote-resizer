const fs = require('fs');
const Jimp = require('jimp');
const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow, ipcMain } = require('electron');
const emoteSizes = [112, 56, 28];

// const testImg = 'test.png'; // test file 

async function resize(imgName, newSizeWidth, newSizeHeight, newResizeMode) {
    if(imgName.includes('.png')) {
        console.log(`Reading image ${imgName}`);
        const sourceImg = await Jimp.read(`${imgName}`);
        console.log(`Resizing image ${imgName}`);
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
        console.log(`${imgName} resized to ${newSizeWidth} x ${newSizeHeight} (${resizeMode})`);
        let splitImgName = imgName.split(".png");
        let newFilename = `${splitImgName[0]}-${newSizeHeight}x${newSizeWidth}.png`;
        let saveResult = await sourceImg.writeAsync(newFilename);
        console.log(`Resized image saved to ${newFilename}`);
    }
    else { console.log('Filename does not end in .png. Skipping...'); }
}

function createWindow() { 
    const win = new BrowserWindow({
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
    console.log(args);
    // for(let i = 0; i < emoteSizes.length; i++) {
    //     await resize(args,emoteSizes[i],emoteSizes[i]);
    // }
    for(let i = 0; i < args.resolutions.length; i++) {
        await resize(args.filePath, args.resolutions[i], args.resolutions[i], args.resizeMode);
    }
});
