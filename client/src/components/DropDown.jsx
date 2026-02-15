import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const DropDown = ({ clubs, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [team,setTeam]=useState("");
  return (
    <div className="relative w-full mb-12 z-50">
      {/* The Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-4 border-black p-4 flex justify-between items-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        <span className="font-black text-xl uppercase truncate">
          {team || "SELECT CLUB_"}
        </span>
        <ChevronDown className={`w-8 h-8 transition-transform ${isOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
      </button>

      {/* The Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-white border-x-4 border-b-4 border-black max-h-64 overflow-y-auto"
          >
            {clubs.map((club) => (
              <button
                key={club.id}
                onClick={() => {
                  onSelect(club.id);
                  setTeam(club.value);
                  setIsOpen(false);
                }}
                className="w-full text-left p-4 font-mono font-bold hover:bg-black hover:text-white transition-colors border-b-2 border-black last:border-b-0 uppercase"
              >
                {club.value}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};