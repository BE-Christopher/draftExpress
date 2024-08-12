import axios from "axios";

const API_PATH = '';

const apiCalling = async () => {
    try {
        const res = await axios.post(API_PATH);
        console.log("🚀 ~ apiCalling ~ res:", res);
    } catch (error) {
        console.log("🚀 ~ apiCalling ~ error:", error);
    }
};

const getRandomDelay = () => Math.floor(Math.random() * (10 - 5 + 1) + 5) * 60 * 1000;

const scheduleRandomCalls = () => {
    apiCalling();
    setInterval(() => {
        apiCalling();
    }, getRandomDelay());
};

scheduleRandomCalls();