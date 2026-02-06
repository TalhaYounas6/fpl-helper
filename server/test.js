import {CHANNELS} from "./config/channel.js";
import {getLatestPresser} from "./services/youtubeService.js"
import {deleteAudioFile,downloadAudio} from "./services/audioService.js"

const runTest = async () => {
  console.log("Searching for Man City presser...");
  const result = await getLatestPresser(CHANNELS.leeds_united.channelId);
  console.log("Result:", result);
};

// runTest();

const runTest2 = async()=>{
    const id ="nLKjfX8o5-I";
    try {
        const output = await downloadAudio(id);
        console.log("File saved at: ",output);

    } catch (error) {
        console.log("Error in test 2: ",error);
    }
}

runTest2();


