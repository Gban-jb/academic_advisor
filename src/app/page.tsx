"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Welcome from "@/components/Welcome";
import UniversityDetail from "@/components/UniversityDetail";
import Planner from "@/components/Planner";

type View = "welcome" | "detail" | "planner";

export default function Home() {
  const [view, setView] = useState<View>("welcome");

  const variants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {view === "welcome" && <Welcome onStart={() => setView("detail")} />}
        {view === "detail" && (
          <UniversityDetail onBack={() => setView("welcome")} onEnterPlanner={() => setView("planner")} />
        )}
        {view === "planner" && <Planner onExit={() => setView("detail")} />}
      </motion.div>
    </AnimatePresence>
  );
}
