import { motion } from "framer-motion";
import { SwapProfile } from "@/types/skillswap";

interface SwipeCardProps {
  profile: SwapProfile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export default function SwipeCard({ profile, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
  return (
    <motion.div
      className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-sm mx-auto relative"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(event, info) => {
        if (info.offset.x > 100) onSwipeRight();
        else if (info.offset.x < -100) onSwipeLeft();
      }}
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col items-center space-y-4">
        <img
          src={profile.avatar || "/default-avatar.png"}
          alt={profile.name}
          className="w-28 h-28 rounded-full object-cover border-4 border-yellow-300 shadow-md"
        />
        <h3 className="text-2xl font-extrabold text-yellow-700 text-center">{profile.name}</h3>
        <p className="text-center text-gray-600 italic px-4">{profile.description}</p>

        <div className="w-full text-center bg-yellow-100 rounded-lg p-3 mt-3">
          <p className="font-semibold text-yellow-700">🎯 Offering:</p>
          <p className="text-sm">{profile.offeredSkill}</p>
          <p className="font-semibold text-yellow-700 mt-2">🤝 Looking for:</p>
          <p className="text-sm">{profile.requiredSkill}</p>
        </div>
      </div>
    </motion.div>
  );
}
