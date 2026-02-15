import {CHANNELS} from "../config/channel.js"
import { processTeam } from "../services/pipelineService.js";

export const runUpdate = async()=>{
    console.log("Starting update job");

    const teams = Object.entries(CHANNELS);
    
    for(const [fplName, config] of teams){
        try {
            
            await processTeam(fplName,config);
    
            await new Promise((resolve)=> setTimeout(resolve,5000));     
        } catch (error) {
            console.log("Error, Skipping team: ",error.message);
        }
    }

    console.log("Data is updated");

    
}

