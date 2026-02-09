import { saveTeamUpdate } from './services/redisService.js';

const test = async () => {
  const success = await saveTeamUpdate("test_team", { 
    fraud_score: 10, 
    injuries: [] 
  });
  
  if (success) console.log("Data saved to redis");
};

test();