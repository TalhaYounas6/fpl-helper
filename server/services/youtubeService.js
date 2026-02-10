import {youtube} from "../config/youtube.js"



const fetchVideos = async(channelId,query,searchType)=>{
    try {
    const params = {
      part: 'snippet',
      channelId: channelId,
      q: query,
      type: 'video',
      order: 'date', 
      maxResults: 10, 
      key: process.env.YOUTUBE_DATA_API_KEY,
    };

    if (searchType === 'live') {
      params.eventType = 'completed';
    }

    const response = await youtube.search.list(params);
    return response.data.items || [];
  } catch (error) {
    console.log(`Yotube Search failed for ${searchType}:`, error.message);
    return [];
  }
};

export const searchLatestPressConference = async (channelId) => {
  const query = "press conference"; 
  
  console.log(`Youtube Searching both Live & Video tabs...`);

  try {
    const [liveResults, videoResults] = await Promise.all([
      fetchVideos(channelId, query, 'live'), 
      fetchVideos(channelId, query, 'video')  
    ]);

    const allCandidates = [...liveResults, ...videoResults];

    if (allCandidates.length === 0) return null;

    const validVideos = allCandidates
      .filter(video => {
        const title = video.snippet.title.toLowerCase();
        return (
          title.includes("press conference") || 
          title.includes("media briefing") || 
          title.includes("manager preview") ||
          title.includes("embargoed section") ||
          title.includes("manager's preview")
        ) && !title.includes("u21") && !title.includes("women") && !title.includes("post match") && !title.includes("reay"); 
      })
      .sort((a, b) => {
        return new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt);
      });

    if (validVideos.length > 0) {
      const bestMatch = validVideos[0];
      return {
        id: bestMatch.id.videoId,
        title: bestMatch.snippet.title,
        publishedAt: bestMatch.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${bestMatch.id.videoId}`
      };
    }

    console.log(`No valid press conferences found.`);
    return null;

  } catch (error) {
    console.log("YouTube  Error:", error);
    return null;
  }
};

// export const getLatestPresser = async (channelId)=>{
//     try {
//         const response = await youtube.search.list({
//             part:"snippet",
//             channelId : channelId,
//             maxResults : 15,
//             order:"date",
//             type:'video',
//             q: SEARCH_QUERY,
//         });

//         const videos = response.data.items;

//         if(!videos || videos.length==0){
//             console.log("No videos found");
//             return null;
//         }

//         const latest = videos[0];

//         return{
//             videoId: latest.id.videoId,
//             title: latest.snippet.title,
//             publishedAt: latest.snippet.publishedAt,
//         }

//     } catch (error) {
//         console.log("Error in getting Youtube Data",error.message);
//         return null;
//     }
// }