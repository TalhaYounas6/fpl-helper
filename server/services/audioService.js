import ytDlp from 'yt-dlp-exec';
import fs, { mkdirSync } from 'fs';
import path from 'path';
import ffmpegPath from 'ffmpeg-static';

const temp_dir = path.resolve('temp');

if(!fs.existsSync(temp_dir)){
    fs.mkdirSync(temp_dir);
}

export const downloadAudio = async(videoId)=>{
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const outputPath = path.join(temp_dir,`${videoId}.mp3`);

    console.log("Starting to download audio for: ",videoId);
    try {
    await ytDlp(videoUrl, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: path.join(temp_dir, '%(id)s.%(ext)s'), 
      noPlaylist: true,
      ffmpegLocation: ffmpegPath,
    })
        
    console.log("Audio download complete.For: ",outputPath);
    return outputPath;

    } catch (error) {
        console.log("Audio download failed: ",error.message);
        throw error;
    }
}

export const deleteAudioFile = async(filepath)=>{
    try {
        if(fs.existsSync(filepath)){
            fs.unlinkSync(filepath);
            console.log("File deleted: ",filepath);
        }
    } catch (error) {
        console.log("Error in deleting file: ",error.message);
    }

}