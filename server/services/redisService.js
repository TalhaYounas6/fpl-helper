import Redis from "ioredis";
import "dotenv/config";

const redis = new Redis(process.env.Redis_URL);

redis.on('connecting', () => console.log('Redis: Connecting...'));
redis.on('connect', () => console.log('Redis: Connected!'));
redis.on('error', (err) => console.error('Redis Error:', err.code));

const EXPIRY_TIME = 60*60*24*7; // Data expires after 7 days

export const saveTeamUpdate = async(team,data)=>{
  const key = `team: ${team}: latest`;

  try {
    await redis.set(key,JSON.stringify(data), 'EX',EXPIRY_TIME);
    console.log(`Redis: Saved update for ${team}`);
    return true;
  } catch (error) {
    console.log( `Error in Redis saving update: ${team} `,error);
    return false;
  }
}