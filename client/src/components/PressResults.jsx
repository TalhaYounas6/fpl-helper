import { motion } from 'framer-motion';

const PlayerTicket = ({ player, index }) => {
  const statusColor = 
    player.status === "Out" ? "bg-red-600 text-white" : 
    player.status === "Doubtful" ? "bg-amber-300 text-black border-3 border-black border-dashed" : 
    "bg-green-500 text-black";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3, type: "spring" }}
      className="flex-1 min-w-[300px] border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="flex justify-between items-start mb-4 border-b-2 border-black pb-2">
        <h3 className="font-black text-lg uppercase">{player.player}</h3>
        <span className={`font-mono text-xs px-2 py-1 font-bold ${statusColor}   `}>
          {player.status}
        </span>
      </div>
      <p className="font-mono text-sm leading-snug"><span className="font-bold">DIRECT QUOTE: </span> {player.quote}</p>
    </motion.div>
  );
};

export const PressResults = ({ data, isloading,error,currentManager}) => {
  if (error) return <div className="font-mono text-center mt-20 text-red-500">// ERROR: FAILED TO GET THE DATA!</div>;
  if (isloading) return <div className="font-mono text-center opacity-50 mt-20">// GETTING THE DATA...</div>;
  if (!data || (Array.isArray(data) && data.length === 0)) return <div className="font-mono text-center opacity-50 mt-20">// WAITING FOR INPUT...</div>;
  return (
    <div className="w-full flex flex-col gap-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border-4 border-black p-6 bg-white"
      >
        <div className="flex justify-between items-center mb-4 border-b-4 border-black pb-2">
          <h2 className="font-black text-2xl uppercase">MANAGER'S BRIEF</h2>
          <span className="font-mono text-xs bg-black text-white px-2 py-1">
            FRAUD SCORE: 
            {data.fraud_score}
          </span>
        </div>
        <p className="font-mono text-sm md:text-base leading-relaxed text-justify">
          <span className="font-bold mr-2">{currentManager.toUpperCase()}:</span>
          {data.summary}
        </p>
      </motion.div>

      
      <div className="flex flex-wrap gap-6">
        {data.injuries.map((player, idx) => (
          <PlayerTicket key={idx} player={player} index={idx} />
        ))}
      </div>
    </div>
  );
};