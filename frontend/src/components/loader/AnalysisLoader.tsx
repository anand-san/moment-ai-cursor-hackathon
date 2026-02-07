import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRandomLoadingContent, type LoadingQuote } from './constants';

interface LoadingContent {
  image: string;
  quote: LoadingQuote;
}

export const AnalysisLoader = () => {
  const [content] = useState<LoadingContent>(() => getRandomLoadingContent());

  return (
    <div className="h-dvh flex flex-col justify-center items-center gap-6 px-6">
      <motion.img
        src={content.image}
        alt="Loading"
        className="w-48 h-48 object-contain"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      >
        <p className="text-lg text-muted-foreground italic">
          "{content.quote.text}"
        </p>
        {content.quote.author && (
          <p className="text-sm text-muted-foreground mt-2">
            — {content.quote.author}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Loader2 className="animate-spin text-muted-foreground" />
      </motion.div>
    </div>
  );
};
