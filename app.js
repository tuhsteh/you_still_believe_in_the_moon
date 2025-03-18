import { request } from 'urllib';
import { config } from 'dotenv';
import { mkdir, writeFile } from 'fs/promises';
import { execSync } from 'child_process';


/**
 * make room, i'm about to monologue.
 */
const bridgestoneArena = function (message) {
    (loudly > 3) && console.log(`        ${message}`);
}
const morrisonCenter = function (message) {
    (loudly > 2) && console.info(`    ${message}`);
}
const flyingM = function (message) {
    (loudly > 1) && console.debug(message);
}
/**
 * thank you.
 */


let target,
    url,
    platform,
    workingPath,
    installPath,
    driverVersion,
    loudly = 9;


/**
 * GET the chrome/chromedriver versions API endpoint,
 * and give back the whole JSON document.
 * @returns {Promise<any>} - the json data from the page.
 */
const bitte = async function () {
    morrisonCenter('fetching page...');

    const {data, res} = await request(target);
    bridgestoneArena(`${res.status}:  ${res.statusText}`);
    bridgestoneArena(`body size:  [${data.length}]`);
    morrisonCenter('done fetching page.');
    return JSON.parse(data);
};


/**
 * Find the download link for the version of the driver we are looking for.
 * @param data - the json data from the page.
 */
const threeOhTwo = function (data) {
    morrisonCenter('finding the correct download url...');
    if (driverVersion !== 'latest') {
        console.error(`Version not supported by this Update tool:  [${driverVersion}].`);
        console.error(`Consult https://googlechromelabs.github.io/chrome-for-testing/ for available versions to install manually.`)
        throw new Error('Version not supported.');
    }
    let stable = data.channels.Stable;
    let found = '';
    bridgestoneArena(`using version:  [${stable.version}]`);
    stable.downloads.chromedriver.forEach((install) => {
        if (platform === install.platform) {
            morrisonCenter(`found download url:  [${install.url}]`);
            found = install.url;
        }
    });
    return found;
}


/**
 * Hydrate the properties from the '.env' environment file.
 * Set your platform, workingPath, installPath especially.
 */
const miseEnPlace = function () {
    config();
    loudly = process.env.LOUDLY;
    target = process.env.TARGET;
    platform = process.env.PLATFORM;
    workingPath = process.env.WORKING_PATH;
    installPath = process.env.INSTALL_PATH;
    driverVersion = process.env.DRIVER_VERSION;
    morrisonCenter('hydrating properties...');

    bridgestoneArena(`target:         ${target}`);
    bridgestoneArena(`platform:       ${platform}`);
    bridgestoneArena(`workingPath:    ${workingPath}`);
    bridgestoneArena(`installPath:    ${installPath}`);
    bridgestoneArena(`driverVersion:  ${driverVersion}`);
    bridgestoneArena(`loudly:         ${loudly}`);
    morrisonCenter('done hydrating properties.');
};


/**
 * Ensure the directory exists.
 * @param path - the path to the directory.
 * @returns {Promise<void>} - the promise of creating the directory.
 */
const blueLightSpecialInMensIntimates = async function (path) {
    morrisonCenter(`checking if [${path}] exists...`);
    try {
        await mkdir(path, {recursive: true});
        bridgestoneArena(`directory created or already exists:  [${path}]`);
    } catch (err) {
        console.error(`Error creating directory:  [${err.message}]`);
        throw err;
    }
    morrisonCenter('directory exists.');
};


/**
 * Download the file to the configured working path.
 * @param url - the url of the file to download.
 * @returns {Promise<void>} - the promise of downloading the file.
 */
const fourHundredIllBeThereInTwoSeconds = async function (url) {
    morrisonCenter(`downloading file from ${url}`);
    const savePath = `${workingPath}/chromedriver.zip`;

    const {data, res} = await request(url);
    if (res.statusCode !== 200) {
        throw new Error(`Failed to download file:  [${res.statusCode}:  ${res.statusText}]`);
    }

    await writeFile(savePath, data);
    morrisonCenter(`file saved to ${savePath}`);
};


/**
 * Unzip the file.
 * @returns {Promise<void>} - the promise of unzipping the file.
 */
const iCantHoldAllTheseLemons = async function () {
    morrisonCenter('unzipping file...');
    const command = `unzip -o -d ${workingPath} ${workingPath}/chromedriver.zip`;
    const result = execSync(command, { encoding: 'utf8' });
    if (result.stderr) {
        throw new Error(`Error unzipping file:  [${result.stderr}]`);
    }
    result.stdout && morrisonCenter(`unzipped file:  [${result.stdout}]`);
}


/**
 * Move the file to the configured install path.
 * @returns {Promise<void>} - the promise of moving the file.
 */
const pleaseStandAwayFromThePlatform = async function () {
    morrisonCenter('moving file to install path...');
    const command = `sudo mv ${workingPath}/chromedriver-${platform}/chromedriver ${installPath}`;
    const result = execSync(command, { encoding: 'utf8' });
    if (result.stderr) {
        throw new Error(`Error unzipping file:  [${result.stderr}]`);
    }
    result.stdout && morrisonCenter(`moved file:  [${result.stdout}]`);
}


////////////////////////////////////////


flyingM('Let\'s get started...');
miseEnPlace();
bitte()
    .then((data) => {
        url = threeOhTwo(data);
        flyingM(`Download link:  [${url}]`);
        blueLightSpecialInMensIntimates(workingPath)
            .then(() => {
                flyingM(`Directory exists.  [${workingPath}]`);
                fourHundredIllBeThereInTwoSeconds(url)
                    .then(() => {
                        flyingM(`Download finished.`);
                        iCantHoldAllTheseLemons()
                            .then(() => {
                                flyingM('Unzipped file.');
                                pleaseStandAwayFromThePlatform()
                                    .then(() => {
                                        flyingM(`Moved file to install path.  [${installPath}]`);
                                        flyingM('Done.');
                                });
                            });
                    });
            });
    });
