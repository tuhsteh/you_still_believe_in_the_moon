import {request} from 'urllib';
import {config} from 'dotenv';
import {mkdir, writeFile} from 'fs/promises';
import {execSync} from 'child_process';


let target,
    url,
    platform,
    workingPath,
    installPath,
    driverVersion;


/**
 * Fetch the page and return the json data.
 * @returns {Promise<any>} - the json data from the page.
 */
const fetchPage = async function () {
    // console.debug('    fetching page');

    const {data, res} = await request(target);
    // console.info(`${res.status}:  ${res.statusText}`);
    // console.info(`body size:  [${data.length}]`);
    return JSON.parse(data);
};

/**
 * Find the download link for the version of the driver we are looking for.
 * @param data - the json data from the page.
 */
const findVersionDownloadLink = function (data) {
    if (driverVersion !== 'latest') {
        console.error(`    Version not supported by this Update tool:  [${driverVersion}].`);
        console.error(`    Consult https://googlechromelabs.github.io/chrome-for-testing/ for available versions to install manually.`)
        return '';
    }
    let stable = data.channels.Stable;
    let found = '';
    // console.info(`    Using version:  [${stable.version}]`);
    stable.downloads.chromedriver.forEach((install) => {
        if (platform === install.platform) {
            // console.info(`    Found download link:  [${install.url}]`);
            found = install.url;
        }
    });
    return found;
}

/**
 * Hydrate the properties from the '.env' environment file.
 * Set your platform, workingPath, installPath especially.
 */
const hydrateProperties = function () {
    config();
    target = process.env.TARGET;
    platform = process.env.PLATFORM;
    workingPath = process.env.WORKING_PATH;
    installPath = process.env.INSTALL_PATH;
    driverVersion = process.env.DRIVER_VERSION;

    console.info(`    target:         ${target}`);
    console.info(`    platform:       ${platform}`);
    console.info(`    workingPath:    ${workingPath}`);
    console.info(`    installPath:    ${installPath}`);
    console.info(`    driverVersion:  ${driverVersion}`);
};


/**
 * Ensure the directory exists.
 * @param path - the path to the directory.
 * @returns {Promise<void>} - the promise of creating the directory.
 */
const ensureDirectoryExists = async function (path) {
    try {
        await mkdir(path, {recursive: true});
        // console.info(`    Directory created or already exists:  [${path}]`);
    } catch (err) {
        console.error(`    Error creating directory:  [${err.message}]`);
        throw err;
    }
};


/**
 * Download the file to the configured working path.
 * @param url - the url of the file to download.
 * @returns {Promise<void>} - the promise of downloading the file.
 */
const downloadFile = async function (url) {
    const savePath = `${workingPath}/chromedriver.zip`;
    // console.debug(`    downloading file from ${url}`);

    const {data, res} = await request(url);
    if (res.statusCode !== 200) {
        throw new Error(`Failed to download file:  [${res.statusCode}:  ${res.statusText}]`);
    }

    await writeFile(savePath, data);
    // console.info(`    file saved to ${savePath}`);
};


/**
 * Unzip the file.
 * @returns {Promise<void>} - the promise of unzipping the file.
 */
const unzipFile = async function () {
    // console.debug('    unzipping file');
    execSync(`unzip -o -d ${workingPath} ${workingPath}/chromedriver.zip`, (err, stdout, stderr) => {
        if (err) {
            console.error(`    Error unzipping file:  [${err.message}]`);
            return;
        }
        if (stderr) {
            console.error(`    Error unzipping file:  [${stderr}]`);
            return;
        }
        // console.info(`    Unzipped file:  [${stdout}]`);
    });
}


/**
 * Move the file to the configured install path.
 * @returns {Promise<void>} - the promise of moving the file.
 */
const moveFileToInstallPath = async function () {
    // console.debug('    moving file to install path');
    execSync(`sudo mv ${workingPath}/chromedriver-${platform}/chromedriver ${installPath}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`    Error moving file:  [${err.message}]`);
            return;
        }
        if (stderr) {
            console.error(`    Error moving file:  [${stderr}]`);
            return;
        }
        // console.info(`    Moved file:  [${stdout}]`);
    });
}


////////////////////////////////////////


console.log('Starting...');

hydrateProperties();
fetchPage()
    .then((data) => {
        url = findVersionDownloadLink(data);
        console.log(`Download link:  [${url}]`);
        ensureDirectoryExists(workingPath)
            .then(() => {
                console.log(`Directory exists.  [${workingPath}]`);
                downloadFile(url)
                    .then(() => {
                        console.log(`Download finished.`);
                        unzipFile()
                            .then(() => {
                                console.log('Unzipped file.');
                                moveFileToInstallPath().then(() => {
                                    console.log(`Moved file to install path.  [${installPath}]`);
                                    console.log('Done.');
                                });
                            });
                    });
            });
    });


