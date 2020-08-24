const fs = require('fs');
const resizeImg = require('resize-img');
const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow, ipcMain } = require('electron');
const emoteSizes = [112, 56, 28];

// const testImg = 'test.png'; // test file 

async function resize(imgName, newSizeWidth, newSizeHeight) {
    if(imgName.includes('.png')) {
        const newImg = await resizeImg(fs.readFileSync(imgName), {
            width: newSizeWidth,
            height: newSizeHeight
            });
        let splitImgName = imgName.split(".png");
        let newFilename = `${splitImgName[0]}-${newSizeHeight}x${newSizeWidth}.png`;
        fs.writeFileSync(newFilename, newImg);
        console.log(`Resized image: ${newFilename}`);
    }
    else { console.log('Filename does not end in .png. Skipping...'); }
}

// test loop for basic emote sizes
// (async () => {
//     for(let i = 0; i < emoteSizes.length; i++) {
//         await resize(testImg, emoteSizes[i], emoteSizes[i]);
//     }
// })();

function createWindow() { 
    const win = new BrowserWindow({
        width: 800,
        height: 600,
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
    for(let i = 0; i < emoteSizes.length; i++) {
        await resize(args,emoteSizes[i],emoteSizes[i]);
    }
});
