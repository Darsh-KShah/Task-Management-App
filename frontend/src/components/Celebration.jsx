import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Collection of motivational messages
const motivationalMessages = [
  "Great job! 🎉",
  "Task crushed! 💪",
  "Well done! ⭐",
  "You're on fire! 🔥",
  "Awesome progress! 👏",
  "Keep up the momentum! 🚀",
  "One step closer to your goals! 🏆",
  "You're crushing it! 💯",
  "Productive day! 🌟",
  "Progress feels good! 😊"
];

function Celebration({ show, onComplete }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (show) {
      // Pick a random motivational message
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setMessage(randomMessage);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Auto-hide after 2.5 seconds
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="celebration-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="celebration-message"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 15 
            }}
          >
            {message}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Celebration;
