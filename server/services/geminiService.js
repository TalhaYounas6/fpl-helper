import { model } from "../config/gemini.js";
import { fileManager } from "../config/gemini.js";
import { getTeamPlayers } from "./fplService.js";
import { SLUG_TO_FPL_NAME } from "../config/constants.js";
import { check } from "../utils/playerNameSpellChecker.js";

export const analyzeAudio = async(transcript,teamName)=>{
try {
    console.log("Fetching official squad for context...");
    const squadList = await getTeamPlayers(teamName);
    const squadString = squadList.join(", ");

    // console.log("Uploading audio to Gemini...");

    // const uploadResponse = await fileManager.uploadFile(filepath,{
    //     mimeType: "audio/mp3",
    //     displayName : `${teamName} Press Conference`,
    // });

    // console.log("Upload complete. Processing audio...");

    // let file = await fileManager.getFile(uploadResponse.file.name);
    // while(file.state === "PROCESSING"){
    //     await new Promise((resolve)=>setTimeout(resolve,2000));
    //     file = await fileManager.getFile(uploadResponse.file.name);
    // }

    // if(file.state === "FAILED"){
    //     throw new Error("Video processing failed");
    // }

    console.log("Gemini generating analysis");

    const result = await model.generateContent([
        {
            text: `You are a strict Fantasy Premier League (FPL) data extractor.
        
        CONTEXT:
        Here is a transcript of a press conference:
        "${transcript}"
        The manager of ${teamName} is speaking.
        Here is the OFFICIAL list of players in this squad:
        [${squadString}]

        INSTRUCTIONS:
        1. Listen to the entire audio. Do not summarize until the end.
        2. Extract EVERY injury, illness, or availability update mentioned.
        3. If a player name is mentioned, you MUST match it to the closest name in the official list above. Do not invent spellings. 
           Make sure you also use the correct player name spelling in direct quotes.
        4. If the manager is vague (e.g., "we will see tomorrow"), mark the status as "Doubtful" and the Flag Color as "yellow".
        5. Do not include or mention players that are out on loan. Ignore loan talk.
        6. Do not include direct quotes in the summary.
        
        OUTPUT FORMAT (JSON ONLY):
        {
          "summary": "Detailed summary of the press conference focusing on player availability.",
          "fraud_score": (Integer 1-10. 10 = Manager was very vague/annoyed. 1 = Manager was clear/helpful),
          "injuries": [
            {
              "player": "Exact Name from Official List",
              "status": "Available" | "Doubtful" | "Out",
              "quote": "Direct quote from manager",
              "flag_color": "green" | "yellow" | "red"
            }
          ]
        }
      `
        }
    ]);

    // await fileManager.deleteFile(uploadResponse.file.name);

    const textResponse = result.response.text();
    const cleanedJson = cleanString(textResponse);
    const analysis = JSON.parse(cleanedJson);


    return analysis;


} catch (error) {
    console.log("Error in gemini service: ",error);
    throw error;
}

};

function cleanString(str){
    return str.replace(/```json|```/g, "").trim(); 
}