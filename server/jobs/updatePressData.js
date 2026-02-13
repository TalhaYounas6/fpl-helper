// import { deleteAudioFile, downloadAudio } from "../services/audioService.js";
// import { analyzeAudio } from "../services/geminiService.js";
// import { saveTeamUpdate } from "../services/redisService.js";
// import {searchLatestPressConference } from "../services/youtubeService.js";
import {CHANNELS} from "../config/channel.js"
// import { textToAudio } from "../services/transcriptionService.js";
// import { getTeamPlayers } from "../services/fplService.js";

import { processTeam } from "../services/pipelineService.js";



// const processTeam = async(fplName,config)=>{
// const {name : displayName, channelId} = config;

// console.log(`Working on ${displayName}`);

// let filePath;

// try {
//     // Searching youtube
//     const video = await searchLatestPressConference(channelId);
//     if(!video){
//         console.log("No recent press conference found.");
//         return;
//     }
//     console.log(`Video found: ${video.title}`);

//     // Download audio
//     console.log("Downloading audio");
//     filePath = await downloadAudio(video.id);

//     //text to audio
//     const rosterList = await getTeamPlayers(fplName);
//     const transcriptText = await textToAudio(filePath,rosterList);

//     // Analyzing audio
//     console.log("Analysis...");
//     const analysis = await analyzeAudio(transcriptText,fplName);

//     // Save to redis
//     const redisData = {
//         ...analysis,
//         video_title: video.title,
//         video_url: `https://www.youtube.com/watch?v=${video.id}`,
//         laste_updated : new Date().toISOString()
//     }

//     await saveTeamUpdate(fplName,redisData);
//     console.log("Saved data to redis");
    
// } catch (error) {
//     console.log(`Error processing ${displayName}: `,error.message);
// }
// finally{
//     if(filePath){
//         await deleteAudioFile(filePath);
//     }
// }
// } 

export const runUpdate = async()=>{
    console.log("Starting update job");

    const teams = Object.entries(CHANNELS);
    const [fplName,config] = teams;
    await processTeam(fplName,config);

    for(const [fplName, config] of teams){
        await processTeam(fplName,config);

        await new Promise((resolve)=> setTimeout(resolve,5000));     
    }

    console.log("Data is updated");
    process.exit(0);
    
}

