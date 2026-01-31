import { motion } from 'framer-motion';
import { fontFamily } from '@/theme/ios';

export function AnalyzingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Loading Dots */}
      <div className="flex flex-row gap-3 mb-6">
        <LoadingDot delay={0} />
        <LoadingDot delay={0.15} />
        <LoadingDot delay={0.3} />
      </div>

      {/* Status Text */}
      <p
        className="text-[17px] leading-[22px] tracking-[-0.41px] text-muted-foreground"
        style={{ fontFamily: fontFamily.system }}
      >
        Analyzing...
      </p>
    </div>
  );
}

function LoadingDot({ delay }: { delay: number }) {
  return (
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        delay: delay,
        ease: 'easeInOut',
      }}
      className="w-2 h-2 rounded-full bg-primary"
    />
  );
}
