import {youtube} from "../config/youtube.js"

const SEARCH_QUERY = "Press Conference|Embargoed|Pre-Match -Women -U21 -Training";

export const getLatestPresser = async (channelId)=>{
    try {
        const response = await youtube.search.list({
            part:"snippet",
            channelId : channelId,
            maxResults : 5,
            order:"date",
            type:'video',
            q: SEARCH_QUERY,
        });

        const videos = response.data.items;

        if(!videos || videos.length==0){
            console.log("No videos found");
            return null;
        }

        const latest = videos[0];

        return{
            videoId: latest.id.videoId,
            title: latest.snippet.title,
            publishedAt: latest.snippet.publishedAt,
        }

    } catch (error) {
        console.log("Error in getting Youtube Data",error.message);
        return null;
    }
}