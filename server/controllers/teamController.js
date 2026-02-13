import { getRedisTeamData } from "../services/redisService.js";
import {CHANNELS} from "../config/channel.js"
import {processTeam} from "../services/pipelineService.js"

export const getTeamStatus = async(req,res)=>{
    try {
        const {fplName} = req.params;
        const data = await getRedisTeamData(fplName);
        
        if(!data){
            return res.status(404).json({
                statusCode : 404,
                message : "No data available.",
                data : []
            })
        }

        res.status(200).json({
            statusCode : 200,
            message: "Data retrieved",
            data : data
        })
    } catch (error) {
        res.status(500).json({
            statusCode : 500,
            message : error.message
        })
    }
}

// Manual refresh
export const refreshTeam = async (req, res) => {
  try {
    const { fplName } = req.params;
    const config = CHANNELS[fplName];

    if (!config) {
      return res.status(400).json({ error: "Invalid team name" });
    }

    console.log(`Manual refresh triggered for ${fplName}`);
    const newData = await processTeam(fplName, config,true);

    res.status(200).json({ message: "Update successful", data: newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to refresh data" });
  }
};