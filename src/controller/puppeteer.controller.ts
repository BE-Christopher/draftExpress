import { Request, Response } from 'express';
import * as puppeteer from 'puppeteer';
import { v4 as uuidV4 } from 'uuid';

export interface IVideo {
    shortLink: string;
    originLink: string;
    keyword: string[];
    // fakeKeyword?: String[]; -- professional feature
    expectIncreaseView: number;
    videoDuration: number;
    increasedView: number;
}

export interface IViewRunning {
    element: IVideo,
    timeWatching: number;
}

const DAILYMOTION_PAGE = 'https://www.dailymotion.com';
const SEARCH_BTN_ELEMENT = '[data-testid="search-button"]';
const INPUT_SEARCH_ELEMENT = 'input#search';
const VIDEO_CARD_ELEMENT = '[data-testid="video-card"]';
const MAX_WINDOW_OPEN = 5;
const DURATION_WAITING = 5 * 60 * 1000;
const WINDOW_WAITING = 3 * 60 * 1000;

class PuppeteerController {
    delayTime = async (time: number) => {
        return new Promise((resolved) => {
            setTimeout(resolved, time);
        });
    };

    randomWatchingTime = (videoDuration: number) => {
        const minDuration = 3 * 60 * 1000;
        return Math.floor(Math.random() * (videoDuration - minDuration)) + minDuration;
    };

    randomWaitingTIme = () => {
        const min = 1 * 6 * 1000;
        const max = 15 * 6 * 1000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    booleanRandom = () => Math.random() < 0.5;

    viewByLink = async ({
        element,
        timeWatching
    }: IViewRunning) => {
        const windowId = uuidV4();
        console.log('???????????????????view by link//', windowId);

        // waiting time
        const waitingTime = this.randomWaitingTIme();
        console.log(`>>>>>>>>>>>>>>>>>>>>${windowId} waiting in ${waitingTime / 6000}<<<<<<<<<<<<<<<<<<<<<<<<`);
        await this.delayTime(waitingTime);

        const browser = await puppeteer.launch({
            headless: false,
            // executablePath: "C:/Users/locbt/OneDrive/Máy tính/Tor Browser/Browser/firefox.exe",
            // args: ['--proxy-server=192.168.1.5:8118'] - laptop
            args: ['--proxy-server=192.168.0.151:8118']

        });
        try {
            const page = await browser.newPage();

            // navigate to page
            await page.goto(element.shortLink, {
                waitUntil: ['domcontentloaded', 'load', 'networkidle2'],
                timeout: WINDOW_WAITING
            });

            // watching video
            await this.delayTime(timeWatching);

            // random next video -- professional

            // cls browser
            await browser.close();
        } catch (error) {
            console.log("🚀 ~ error:", error);
            await browser.close;
            throw error;
        }
    };

    viewBySearch = async ({
        element,
        timeWatching
    }: IViewRunning) => {
        const windowId = uuidV4();
        console.log('???????????????????view by search//', windowId);
        const waitingTime = this.randomWaitingTIme();
        console.log(`>>>>>>>>>>>>>>>>>>>>${windowId} waiting in ${waitingTime / 6000}<<<<<<<<<<<<<<<<<<<<<<<<`);
        await this.delayTime(5000);

        const browser = await puppeteer.launch({
            headless: false,
            // executablePath: "C:/Users/locbt/OneDrive/Máy tính/Tor Browser/Browser/firefox.exe",
            // args: ['--proxy-server=192.168.1.5:8118']
            args: ['--proxy-server=192.168.0.151:8118']
        });

        try {
            const page = await browser.newPage();
            // navigate to root page
            await page.goto(DAILYMOTION_PAGE, {
                waitUntil: ['domcontentloaded', 'load', 'networkidle2'],
                timeout: WINDOW_WAITING
            });

            await this.delayTime(5000);

            // click and search
            await page.click(SEARCH_BTN_ELEMENT, { delay: 1000 });
            await page.waitForSelector(INPUT_SEARCH_ELEMENT);
            const condition = await page.$(INPUT_SEARCH_ELEMENT);
            Boolean(condition) ? null : await browser.close();

            // type fakeKeyword -- professional

            // type keyword
            await page.type(INPUT_SEARCH_ELEMENT, element.keyword[Math.floor(Math.random() * element.keyword.length)], { delay: 100 });
            await page.keyboard.press('Enter', { delay: 1000 });

            // search video card
            await page.waitForSelector(VIDEO_CARD_ELEMENT);
            const targetVideoSelector = `a[href="${element.originLink}"]${VIDEO_CARD_ELEMENT}`;
            const targetVideo = await page.$(targetVideoSelector);

            const triggerWatching = async () => {
                await page.click(targetVideoSelector, { delay: 200 });
                await this.delayTime(timeWatching);
            };

            // trigger watch video or scroll to recheck
            if (targetVideo) {
                await triggerWatching();
            } else {
                let i = 1;
                while (i < 3) {
                    // scroll to load - professional

                    // re-check element
                    const researchVideo = await page.$(targetVideoSelector);
                    researchVideo ? async () => {
                        await triggerWatching();
                        i = 5;
                    } : i++;
                }
            }

            await browser.close();
        } catch (error) {
            console.log("🚀 ~ error:", error);
            await browser.close();
            throw error;
        }
    };

    randomTargetVideos = (videos: Array<IVideo>) => {
        let result: Array<IVideo> = [];

        if (videos.length < 3) {
            result = [...videos];
        } else {
            let count = 1;
            let flagLoop = 0;
            while (count < 3) {
                const pickingItemIdx = Math.floor(Math.random() * (videos.length + 1));
                videos[pickingItemIdx].expectIncreaseView === videos[pickingItemIdx].increasedView ? null : () => {
                    result.push(videos[pickingItemIdx]);
                    count++;
                };
                flagLoop++;
                flagLoop === videos.length ? count = 3 : null;
            }
        }

        return result;
    };

    puppeteerRunning = async (req: Request, res: Response) => {
        res.status(200).send('success');

        try {
            const { source } = req.body;
            const videos = source as unknown as Array<IVideo>;
            // pick 3 element from root arr
            const targetVideos = this.randomTargetVideos(videos);
            for (let i = 0; i < targetVideos.length; i++) {
                const pickedVideo = targetVideos[i];

                if (pickedVideo.increasedView < pickedVideo.expectIncreaseView) {
                    const windows = [];
                    let index = 0;
                    const increaseNumber = Math.abs(MAX_WINDOW_OPEN - pickedVideo.increasedView);

                    while (index < increaseNumber) {
                        const timeWatching: number = this.randomWatchingTime(pickedVideo.videoDuration);
                        console.log("🚀 ~ puppeteerRunning ~ timeWatching:", timeWatching / 60000);
                        console.log('\n');

                        const randomFlag: boolean = this.booleanRandom();
                        // const runningFnc = randomFlag ? this.viewByLink : this.viewBySearch; 0;
                        const runningFnc = this.viewBySearch;
                        windows.push(runningFnc({
                            element: pickedVideo,
                            timeWatching
                        }));

                        const videoIncreasedIndex = videos.findIndex((item) => item.shortLink === pickedVideo.shortLink);
                        videoIncreasedIndex !== -1 ? videos[videoIncreasedIndex].increasedView++ : null;
                        index++;
                    }

                    await Promise.allSettled(windows);
                } else {
                    continue;
                }
            }

        } catch (error) {
            console.log("🚀 ~ puppeteerRunning ~ error:", error);
            res.status(500).send(error);

        }
    };
}


export default new PuppeteerController();
