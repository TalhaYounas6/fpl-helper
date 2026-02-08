import {CHANNELS} from "./config/channel.js";
import {getLatestPresser} from "./services/youtubeService.js"
import {deleteAudioFile,downloadAudio} from "./services/audioService.js"
import { analyzeAudio } from "./services/geminiService.js";
import { getTeamPlayers } from "./services/fplService.js";

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

// runTest2();

// backend/test-full-flow.js
const runTest3 = async () => {
  const TEST_VIDEO_ID = "ngLocojJYVs"; 
  const TEAM_NAME = "Leeds";

  let filePath;

  try {
    console.log("--- STEP 1: DOWNLOADING ---");
    filePath = await downloadAudio(TEST_VIDEO_ID);
    
    console.log("--- STEP 2: ANALYZING ---");
    const analysis = await analyzeAudio(filePath, TEAM_NAME);
    
    console.log("\n--- FINAL RESULT ---");
    console.log(JSON.stringify(analysis, null, 2));

  } catch (error) {
    console.error("Test Failed:", error);
  } finally {

    if (filePath) deleteAudioFile(filePath);
  }
};

runTest3();

async function runTest4 () {
    console.log("Fetching players...");
    const players = await getTeamPlayers("Leeds");
    console.log("First 5 players: ",players.slice(0,5));
}

// runTest4();

async function t5(){
  const players = await getTeamPlayers("Leeds");
  console.log(players);
}

// t5();