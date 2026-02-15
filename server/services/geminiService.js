import { model } from "../config/gemini.js";


export const analyzeAudio = async(transcript,teamName,rosterList)=>{
try {
    console.log("Fetching official squad for context...");
    const squadList = rosterList;
    const squadString = squadList.join(", ");


    console.log("Gemini generating analysis");

    const result = await model.generateContent([
        {
            text: `You are a strict Fantasy Premier League (FPL) data extractor.
        
        CONTEXT:
        Here is a transcript of the press conference:
        "${transcript}"
        The manager of ${teamName} is speaking.
        Here is the OFFICIAL list of players in this squad:
        [${squadString}]

        INSTRUCTIONS:
        1. Extract EVERY injury, illness, or availability update mentioned.
        2. Map them ONLY to names in the squad list.
        3. Calculate a "Fraud Score" (0-10) based on how vague the manager's language is (e.g. "touch and go" = High Fraud).
        3. If a player name is mentioned, you MUST match it to the closest name in the official list above. Do not invent spellings. 
           Make sure you also use the correct player name spelling in direct quotes.
        4. If the manager is vague (e.g., "we will see tomorrow"), mark the status as "Doubtful" and the Flag Color as "yellow".
        5. Do not include or mention players that are out on loan. Ignore loan talk.
        6. Do not include direct quotes in the summary.

        Follow these classification rules RIGIDLY for labelling player availability:

1. **OUT**:
   - Use this if the manager says: "will miss", "not available", "out for X weeks", "won't make it", "too soon".
   - CRITICAL RULE: If a player is described as "improving", "closer", or "doing well" but is explicitly stated to NOT play this weekend, they are **OUT**. Do not use sentiment to upgrade them.

2. **DOUBT**:
   - Use this ONLY if there is a realistic chance they might play.
   - Keywords: "touch and go", "late fitness test", "we'll assess him tomorrow", "50/50", "could be an option".

3. **AVAILABLE**:
   - Use this if the manager confirms they are fit, training, or in the squad.
        
        OUTPUT FORMAT (JSON ONLY):
        {
          "summary": "Detailed summary of the press conference focusing on player availability.",
          "fraud_score": (Integer 1-10. 10 = Manager was very vague/annoyed. 1 = Manager was clear/helpful),
          "injuries": [
            {
              "player": "Exact Name from Official List",
              "quote": "Direct quote from manager",
              "status": "Available" | "Doubtful" | "Out",
              "flag_color": "green" | "yellow" | "red"
            }
          ]
        }
      `
        }
    ]);


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