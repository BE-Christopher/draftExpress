import { WebDriver } from "selenium-webdriver";
interface ISeleniumSignUp {
    drive: WebDriver
}
export const seleniumSignUp = async ({ drive }: ISeleniumSignUp) => {
    try {

        await drive.get('https://www.youtube.com');
    } catch (error) {
        console.log("🚀 ~ seleniumSignUp ~ error:", error);
    }
};