import {client} from "../config/assemblyAi.js"

// const audioFile = 'https://assembly.ai/wildfires.mp3'

// const params = {
//   audio: audioFile,
//   "language_detection": true,
//   // Uses universal-3-pro for en, es, de, fr, it, pt. Else uses universal-2 for support across all other languages
//   "speech_models": ["universal-3-pro", "universal-2"]
// };

export const textToAudio = async(audioFile)=>{
    const transcript = await client.transcripts.transcribe({
  audio: audioFile,
  "language_detection": true,
  // Uses universal-3-pro for en, es, de, fr, it, pt. Else uses universal-2 for support across all other languages
  "speech_models": ["universal-3-pro", "universal-2"]
}
);
    return transcript;
}

// const run = async () => {
//   const transcript = await client.transcripts.transcribe(params);

//   console.log(transcript.text);
// };

// run();