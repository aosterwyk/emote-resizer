const fs = require('fs');
const resizeImg = require('resize-img');

const emoteSizes = [112, 56, 28];

const testImg = 'test.png'; // test file 

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
    else { console_log('Filename does not end in .png. Skipping...'); }
}

// test loop for basic emote sizes
(async () => {
    for(let i = 0; i < emoteSizes.length; i++) {
        await resize(testImg, emoteSizes[i], emoteSizes[i]);
    }
})();

