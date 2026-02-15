import { deleteAudioFile, downloadAudio } from "../services/audioService.js";
import { analyzeAudio} from "../services/geminiService.js";
import { saveTeamUpdate,getRedisTeamData } from "../services/redisService.js";
import {searchLatestPressConference } from "../services/youtubeService.js";
import { textToAudio } from "../services/transcriptionService.js";
import { getTeamPlayers } from "../services/fplService.js";


export const processTeam = async(fplName,config,forceUpdate=false)=>{
const {name : displayName, channelId} = config;

console.log(`Working on ${displayName}`);

let filePath;

try {
    // Searching youtube
    const video = await searchLatestPressConference(channelId,displayName);
    if(!video){
        console.log("No recent press conference found.");
        return;
    }
    if (!forceUpdate) {
        const currentDbData = await getRedisTeamData(fplName);

        // Check if the IDs match
        if (currentDbData && currentDbData.video_url && currentDbData.video_url.includes(video.id)) {
            console.log(`SKIPPING: Video "${video.title}" is already processed.`);
            console.log(`(Use /refresh endpoint if you want to force a re-run)`);
            return null; 
        }
    }
    console.log(`Video found: ${video.title}`);

    // Download audio
    console.log("Downloading audio");
    filePath = await downloadAudio(video.id);

    // text to audio
    
    const rosterList = await getTeamPlayers(fplName);  
    
    const transcriptText = await textToAudio(filePath,rosterList);

    // Analyzing audio
    console.log("Analysis...");
    const analysis = await analyzeAudio(transcriptText,fplName,rosterList);

    // Save to redis
    const redisData = {
        ...analysis,
        video_title: video.title,
        video_url: `https://www.youtube.com/watch?v=${video.id}`,
        laste_updated : new Date().toISOString()
    }

    await saveTeamUpdate(fplName,redisData);
    console.log("Saved data to redis");
    
} catch (error) {
    console.log(`Error processing ${displayName}: `,error.message);
}
finally{
    if(filePath){
        await deleteAudioFile(filePath);
    }
}
} 
