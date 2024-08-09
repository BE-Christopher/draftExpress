import { format } from "date-fns";
import * as ffmpeg from 'fluent-ffmpeg';

const OUTPUT_PATH = 'C:/Sources/draftExpress/src/asserts/merged';
const FOLDER_PATH = 'C:/Sources/draftExpress/src/asserts/songs';

const songMerge = async () => {
    try {
        const songNames = [
            'roiEmSeOnThoi.mp3',
            'luotSongDapMay.mp3',
        ];

        const today = new Date();
        const dayParse = format(today, 'yyyy-MM-dd_hhmmss');
        const outputFileName = `${OUTPUT_PATH}/${dayParse}.mp3`;

        let source = ffmpeg();
        songNames.length && songNames.forEach((item) => {
            source.input(`${FOLDER_PATH}/${item}`);
        });
        source
            .complexFilter([
                {
                    filter: 'concat',
                    options: {
                        n: songNames.length,
                        v: 0,
                        a: 1
                    }
                }
            ])
            .output(outputFileName)
            // .on('stderr', (stderrLine) => {
            //     console.log(stderrLine);
            // })
            .on('end', () => {
                console.log('Conversion completed successfully!');
            })
            .on('error', (err) => {
                console.error('Conversion failed: ' + err.message);
            })
            .run();
        console.log(`>>>>>>>>>>.file generated on site: ${outputFileName}<<<<<<<<<<<<<<<<<<<<`);
    } catch (error) {
        console.log("🚀 ~ songMerge ~ error:", error);
    }
};

songMerge();