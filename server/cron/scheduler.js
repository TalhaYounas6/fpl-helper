import cron from 'node-cron';
import { runUpdate } from '../jobs/updatePressData.js';

console.log('Scheduler initialized...');

let jobIsRunning = false;
// Schedule: Run every 4 hours (0 */4 * * *)
cron.schedule('0 */4 * * *', async () => {
  console.log('Cron Job Triggered: Starting Team Updates...');
  if(jobIsRunning){
      return;
    }
    jobIsRunning = true;
  try {
    await runUpdate();
    console.log('Cron Job Finished Successfully.', new Date());
  } catch (error) {
    console.error('Cron Job Failed:', error);
  }finally{
    jobIsRunning = false;
  }
});