import axios from 'axios';

const FPL_API_URL = "https://fantasy.premierleague.com/api/bootstrap-static/";

export const getTeamPlayers = async (targetName) => {
  try {
    
    const response = await axios.get(FPL_API_URL);
    
    const data = response.data;
    
    const teamObj = data.teams.find(t => t.name === targetName || t.short_name === targetName || t.name.toLowerCase().includes(targetName.toLowerCase()));
    
    if (!teamObj) {
      console.error(` Could not find ID for team: ${targetName}`);
      return [];
    }

    const squad = data.elements
      .filter(p => p.team === teamObj.id)
      .map(p => `${p.first_name} ${p.second_name}`);

    return squad;

  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
};