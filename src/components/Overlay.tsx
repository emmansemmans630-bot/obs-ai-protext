import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOverlayState } from '@/hooks/useOverlayState';

export default function Overlay() {
  const { state } = useOverlayState();

  const transitionVariants = useMemo(() => {
    switch (state.settings.transition) {
      case 'slide':
        return {
          initial: { y: 100, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 100, opacity: 0 },
        };
      case 'zoom':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
        };
      case 'none':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  }, [state.settings.transition]);

  const isLowerThird = state.settings.layout === 'lower-third';

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-end overflow-hidden">
      <AnimatePresence mode="wait">
        {state.isVisible && state.content && (
          <motion.div
            key={state.content.text + state.settings.layout}
            initial={transitionVariants.initial}
            animate={transitionVariants.animate}
            exit={transitionVariants.exit}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`w-full ${isLowerThird ? 'px-12 pb-12' : 'h-full flex items-center justify-center p-24'}`}
          >
            <div 
              className={`
                relative overflow-hidden shadow-2xl
                ${isLowerThird ? 'w-full max-w-6xl mx-auto rounded-2xl border-l-[12px]' : 'w-full h-full rounded-3xl flex flex-col justify-center items-center text-center p-12'}
              `}
              style={{
                backgroundColor: `${state.settings.primaryColor}${Math.round(state.settings.opacity * 255).toString(16).padStart(2, '0')}`,
                borderColor: state.settings.secondaryColor,
                color: state.settings.textColor,
                fontFamily: state.settings.fontFamily,
              }}
            >
              {/* Background Glow Effect */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${state.settings.secondaryColor} 0%, transparent 100%)`
                }}
              />

              <div className={`relative z-10 ${isLowerThird ? 'p-8 flex gap-8 items-center' : 'max-w-4xl'}`}>
                {state.content.type === 'scripture' && (
                  <div className={`flex flex-col ${isLowerThird ? 'flex-1' : 'items-center'}`}>
                    <h3 
                      className="font-bold uppercase tracking-widest mb-4 opacity-80"
                      style={{ fontSize: `${state.settings.fontSize * 0.6}px` }}
                    >
                      {state.content.title}
                    </h3>
                    <p 
                      className="font-serif italic leading-snug"
                      style={{ fontSize: `${state.settings.fontSize}px` }}
                    >
                      "{state.content.text}"
                    </p>
                  </div>
                )}

                {state.content.type === 'song' && (
                  <div className={`flex flex-col ${isLowerThird ? 'flex-1' : 'items-center'}`}>
                    {state.content.title && (
                      <h3 
                        className="font-bold uppercase tracking-widest mb-4 opacity-80"
                        style={{ fontSize: `${state.settings.fontSize * 0.6}px` }}
                      >
                        {state.content.title}
                      </h3>
                    )}
                    <p 
                      className="whitespace-pre-line leading-relaxed"
                      style={{ fontSize: `${state.settings.fontSize}px` }}
                    >
                      {state.content.text}
                    </p>
                  </div>
                )}

                {state.content.type === 'caption' && (
                  <div className="flex-1 text-center">
                    <p 
                      className="font-medium"
                      style={{ fontSize: `${state.settings.fontSize * 1.2}px` }}
                    >
                      {state.content.text}
                    </p>
                  </div>
                )}
              </div>

              {/* Decorative Accent */}
              <div 
                className="absolute bottom-0 right-0 w-32 h-32 opacity-10"
                style={{
                  background: `radial-gradient(circle at bottom right, ${state.settings.secondaryColor}, transparent)`
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
