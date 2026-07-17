import React, { useState } from "react";
import { cn } from "../../lib/cn";
import { motion, AnimatePresence } from "motion/react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
  id?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  id,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
  };

  const animationVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  // Clone child to attach hover/focus event listeners
  const trigger = React.cloneElement(children, {
    onMouseEnter: () => setIsVisible(true),
    onMouseLeave: () => setIsVisible(false),
    onFocus: () => setIsVisible(true),
    onBlur: () => setIsVisible(false),
  });

  return (
    <div id={id} className="relative inline-block w-fit">
      {trigger}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={animationVariants}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-50 px-2 py-1 text-xs font-sans font-medium text-white bg-text-primary rounded shadow-subtle border border-text-primary/10 whitespace-nowrap pointer-events-none select-none",
              positionStyles[position]
            )}
            role="tooltip"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
