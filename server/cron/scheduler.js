import cron from 'node-cron';
import { runUpdate } from '../jobs/updatePressData.js';

console.log('Scheduler initialized...');

// Schedule: Run every 4 hours (0 */4 * * *)
cron.schedule('0 */4 * * *', async () => {
  console.log('Cron Job Triggered: Starting Team Updates...');
  try {
    await runUpdate();
    console.log('Cron Job Finished Successfully.', new Date());
  } catch (error) {
    console.error('Cron Job Failed:', error);
  }
});