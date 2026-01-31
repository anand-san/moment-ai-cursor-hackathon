import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface EmpathyResponseProps {
  message: string;
}

export function EmpathyResponse({ message }: EmpathyResponseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-primary/20">
          <Heart className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-lg leading-relaxed text-foreground">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
