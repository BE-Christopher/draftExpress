import { Browser, Builder } from "selenium-webdriver";
import { seleniumSignUp } from "./selenium/startSignUp";
import 'chromedriver';

const seleniumRunning = async () => {
    console.log('>>>>>>>>>>>>>>>>.Running<<<<<<<<<<<<<<<<<');

    try {
        const drive = await new Builder().forBrowser(Browser.CHROME).build();

        await seleniumSignUp({ drive });
    } catch (error) {
        console.log("🚀 ~ seleniumRunning ~ error:", error);
    }
};

seleniumRunning();