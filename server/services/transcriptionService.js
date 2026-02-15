import {client} from "../config/assemblyAi.js"

export const textToAudio = async(audioFile,rosterList)=>{
    console.log("Converting text to audio...");
    try {
        const transcript = await client.transcripts.transcribe({
        audio: audioFile,
        // "language_detection": true,
        language_code :"en",
        // Uses universal-3-pro for en, es, de, fr, it, pt. Else uses universal-2 for support across all other languages
        "speech_models": ["universal-3-pro", "universal-2"],
        speaker_labels: true,
        keyterms_prompt: rosterList || []
}
);
        return transcript.text;
        
    } catch (error) {
        console.log("Error in transcription service: ",error.message);
        throw error;
    }
   
   
}

