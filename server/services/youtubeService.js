import Parser from "rss-parser";
import axios from "axios"
import {youtube} from "../config/youtube.js"


// const parser = new Parser();

// const fetchVideos = async(channelId,searchType)=>{
//     try {
//     const params = {
//       part: 'snippet',
//       channelId: channelId,
//       type: 'video',
//       order: 'date', 
//       maxResults: 30, 
//       key: process.env.YOUTUBE_DATA_API_KEY,
//     };

//     if (searchType === 'live') {
//       params.eventType = 'completed';
//     }

//     const response = await youtube.search.list(params);
//     return response.data.items || [];
//   } catch (error) {
//     console.log(`Yotube Search failed for ${searchType}:`, error.message);
//     return [];
//   }
// };

// export const searchLatestPressConference = async (channelId) => {
//   // const query = "press conference"; 
  
//   console.log(`Youtube Searching both Live & Video tabs...`);

//   try {
//     const [liveResults, videoResults] = await Promise.all([
//       fetchVideos(channelId,'live'), 
//       fetchVideos(channelId, 'video')  
//     ]);

//     const allCandidates = [...liveResults, ...videoResults];

//     if (allCandidates.length === 0) return null;

//     const validVideos = allCandidates
//       .filter(video => {
//         const title = video.snippet.title.toLowerCase();

//         if (video.snippet.liveBroadcastContent === 'upcoming') {
//            console.log(`Skipping upcoming stream: ${title}`);
//            return false;
//         }

//         return (
//           title.includes("press conference") || 
//           title.includes("media briefing") || 
//           title.includes("manager preview") ||
//           title.includes("embargoed section") ||
//           title.includes("manager's preview") ||
//           title.includes("preview") ||
//           title.includes("scott parker")
//         ) && !title.includes("u21") && !title.includes("women") && !title.includes("post match") && !title.includes("reay") && !title.includes("post") && !title.includes("FA") && !title.includes("carabao")&& !title.includes("cup"); 
//       })
//       .sort((a, b) => {
//         return new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt);
//       });

//     if (validVideos.length > 0) {
//       const bestMatch = validVideos[0];
//       return {
//         id: bestMatch.id.videoId,
//         title: bestMatch.snippet.title,
//         publishedAt: bestMatch.snippet.publishedAt,
//         url: `https://www.youtube.com/watch?v=${bestMatch.id.videoId}`
//       };
//     }

//     console.log(`No valid press conferences found.`);
//     return null;

//   } catch (error) {
//     console.log("YouTube  Error:", error);
//     return null;
//   }
// };



// export const searchLatestPressConference = async (channelId, teamName) => {
//   // const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${channelId}`;
//   console.log(`Checking feed for ${teamName}...`);
//  for(const domain of MIRRORS){
//   try {
    
//     const rssUrl = `${domain}/feed/channel/${channelId}`;
      
//       const response = await axios.get(rssUrl, {
//         timeout: 5000 // 5 second timeout per mirror
//       });
//     //  parse the raw xml
//     const feed = await parser.parseString(response.data);
//     const videos = feed.items || [];
//     if (videos.length === 0) {
//       console.log("Failed to fetch videos.")
//       return null;
//     }

//     const validVideos = videos.filter(video => {
//       const title = video.title.toLowerCase();

//       const isRelevant = (
//         title.includes("press conference") || 
//         title.includes("media briefing") || 
//         title.includes("manager preview") ||
//         title.includes("embargoed section") ||
//         title.includes("manager's preview") ||
//         title.includes("preview") ||
//         title.includes("scott parker")
//       );

//       const isJunk = (
//         title.includes("u21") || 
//         title.includes("women") || 
//         title.includes("post match") || 
//         title.includes("reay") || 
//         title.includes("post") || 
//         title.includes("fa") || 
//         title.includes("carabao") || 
//         title.includes("cup") ||
//         title.includes("ucl")
//       );

//       return isRelevant && !isJunk;
//     })
//     .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

//     if (validVideos.length > 0) {
//       const bestMatch = validVideos[0];
      
//       // RSS ID format is "yt:video:VIDEO_ID"
//       const cleanId = bestMatch.id.split(':')[2]; 

//       return {
//         id: cleanId,
//         title: bestMatch.title,
//         publishedAt: bestMatch.pubDate,
//         url: bestMatch.link
//       };
//     }

//     console.log(`No valid press conferences found.`);
//     return null;

//   } catch (error) {
//     console.log(`RSS Error for ${teamName}:`, error.message);
//     return null;
//   }
// }
// };

import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const fetchTab = async (channelId, tab) => {
  try {
    const url = `https://www.youtube.com/channel/${channelId}/${tab}`;
    
    const command = `yt-dlp --flat-playlist --print "%(id)s|||%(title)s|||%(upload_date)s" --playlist-end 30 "${url}"`;
    
    const { stdout } = await execPromise(command);
    
    return stdout.trim().split('\n').map(line => {
      const parts = line.split('|||');
      if (parts.length < 3) return null;
      return { id: parts[0], title: parts[1], date: parts[2], type: tab };
    }).filter(Boolean);

  } catch (error) {
    
    return [];
  }
};

export const searchLatestPressConference = async (channelId, teamName) => {
  console.log(`Scanning last 30 videos in 'Videos' AND 'Live' for ${teamName}...`);

  try {
    const [videoTabResults, liveTabResults] = await Promise.all([
      fetchTab(channelId, 'videos'),
      fetchTab(channelId, 'streams')
    ]);

    const allVideos = [...videoTabResults,...liveTabResults];
    
    // Deduplicate based on ID
    const seen = new Set();
    const uniqueVideos = allVideos.filter(video => {
    if (seen.has(video.id)) return false; // skip 
    seen.add(video.id); 
    return true; 
  });

    if (uniqueVideos.length === 0) {
        console.log(`Channel empty.`);
        return null;
    }

    const validVideos = uniqueVideos.filter(video => {
    const title = video.title.toLowerCase();
      
    const relevanceRegex = /\b(press conference|media briefing|preview|embargoed|pre-match|pre match|scott parker)\b/i;

    const junkRegex = /\b(u21|women|post match|post-match|fa|carabao|cup|highlights|fantasy|goals|reaction|show|special|post)\b/i;

    const isRelevant = relevanceRegex.test(title);
    const isJunk = junkRegex.test(title);

      return isRelevant && !isJunk;
    });
    
    validVideos.sort((a, b) => b.date.localeCompare(a.date));

    if (validVideos.length > 0) {
      const bestMatch = validVideos[0];
      console.log(`Found: "${bestMatch.title}" (${bestMatch.date})`);
      return {
        id: bestMatch.id,
        title: bestMatch.title,
        publishedAt: bestMatch.date, 
        url: `https://www.youtube.com/watch?v=${bestMatch.id}`
      };
    }

    console.log(`No relevant video found in last 30 items.`);
    
    
    return null;

  } catch (error) {
    console.error(`yt-dlp Error:`, error.message);
    return null;
  }
};