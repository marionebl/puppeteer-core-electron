const Electron = require('electron');
const executablePath = Electron.app.getPath('exe');
const puppeteer = require('puppeteer-core');
const yargsParser = require('yargs-parser');

const state = {};

async function main(flags) {
    if (flags.isPage) {
        return;
    }

    const browser = await puppeteer.launch({
        executablePath,
        args: [__filename, '--is-page']
    });

    const [page] = await browser.pages();

    await page.setViewport({ width: 1240, height: 720 });
    await page.goto('https://google.com');
    await page.screenshot({ path: 'google.png' });

    Electron.app.quit();
}

process.on('exit', () => {
    if (state.browser) {
        state.browser.close();
    }
    Electron.app.quit();
});

main(yargsParser(process.argv.slice(2)))
    .catch(err => {
        throw err;
    });