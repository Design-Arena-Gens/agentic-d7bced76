"use client";

import { useEffect, useMemo, useState } from "react";

type StorySegment = {
  id: string;
  label: string;
  delayMs: number;
  text: string;
};

const storySegments: StorySegment[] = [
  {
    id: "sealed",
    label: "00:00",
    delayMs: 0,
    text: "The elevator doors exhaled a final gasp as they sealed, swallowing the hallway's safe fluorescence behind you.",
  },
  {
    id: "countdown",
    label: "00:05",
    delayMs: 5000,
    text: "Floor numbers tumbled in reverse, skipping entire levels as though something hungry was chewing through the cable.",
  },
  {
    id: "warning",
    label: "00:10",
    delayMs: 10000,
    text: "The intercom crackled alive with a voice that sounded almost like yours: “Twenty seconds is all the warning you'll ever get.”",
  },
  {
    id: "reflection",
    label: "00:15",
    delayMs: 15000,
    text: "Emergency lights bled the car in red haze; the steel walls reflected everyone in the elevator—except you.",
  },
  {
    id: "arrival",
    label: "00:20",
    delayMs: 20000,
    text: "The doors slid open on a hallway cloned from your apartment, but the picture frames showed tonight's photo: you already inside, eyes hollow, waiting.",
  },
];

const totalDuration = storySegments[storySegments.length - 1]?.delayMs ?? 20000;

function formatSeconds(ms: number) {
  const safeMs = Math.max(ms, 0);
  const seconds = Math.ceil(safeMs / 1000);
  return `00:${seconds.toString().padStart(2, "0")}`;
}

export default function Home() {
  const [phase, setPhase] = useState<"idle" | "running" | "finished">("idle");
  const [runKey, setRunKey] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (phase !== "running") {
      return;
    }

    const revealTimeouts = storySegments.slice(1).map((segment, index) =>
      window.setTimeout(() => {
        setActiveIndex(index + 1);
      }, segment.delayMs),
    );

    let animationFrameId = 0;
    const start = performance.now();

    const loop = (time: number) => {
      const nextElapsed = Math.min(time - start, totalDuration);
      setElapsed(nextElapsed);

      if (nextElapsed < totalDuration) {
        animationFrameId = requestAnimationFrame(loop);
      } else {
        setPhase("finished");
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      revealTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      cancelAnimationFrame(animationFrameId);
    };
  }, [phase, runKey]);

  const progress = phase === "idle" ? 0 : Math.min(elapsed / totalDuration, 1);
  const remainingLabel =
    phase === "finished" ? "00:00" : formatSeconds(totalDuration - elapsed);

  const revealedSegments = useMemo(() => {
    if (activeIndex < 0) {
      return [] as StorySegment[];
    }
    return storySegments.slice(0, activeIndex + 1);
  }, [activeIndex]);

  const latestSegment = revealedSegments[revealedSegments.length - 1];

  const handleStart = () => {
    setActiveIndex(0);
    setElapsed(0);
    setPhase("running");
    setRunKey((key) => key + 1);
  };

  const handleReplay = () => {
    setActiveIndex(0);
    setElapsed(0);
    setPhase("running");
    setRunKey((key) => key + 1);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030614] via-[#0c0616] to-black text-zinc-100">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-20 left-10 h-64 w-64 animate-pulse-slow rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] h-72 w-72 animate-orbit rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 animate-scan rounded-full border border-fuchsia-600/10" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center px-6 pb-16 pt-24 sm:px-10">
        <header className="text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-zinc-500">
            Dark Microfiction
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Nightfall Descent
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-zinc-400 sm:text-base">
            A twenty-second plunge into an elevator that misses the ground and
            finds something darker.
          </p>
        </header>

        <div className="mt-12 w-full max-w-3xl">
          {phase === "idle" && (
            <button
              onClick={handleStart}
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-full border border-fuchsia-500/60 bg-fuchsia-600/20 px-8 py-4 text-sm font-semibold uppercase tracking-[0.4em] text-fuchsia-200 transition hover:border-fuchsia-300 hover:text-white"
            >
              <span className="absolute inset-0 translate-y-full bg-gradient-to-t from-fuchsia-500/40 to-transparent transition-transform duration-500 group-hover:translate-y-0" />
              <span className="relative">Begin Descent</span>
            </button>
          )}

          {revealedSegments.length > 0 && (
            <ul className="mt-10 space-y-6">
              {revealedSegments.map((segment, index) => {
                const isActive = index === activeIndex && phase !== "finished";
                const isFinal =
                  segment.id === storySegments[storySegments.length - 1]?.id;

                return (
                  <li
                    key={segment.id}
                    className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 px-6 py-8 shadow-[0_30px_120px_-60px_rgba(232,121,249,0.45)] backdrop-blur-sm transition duration-500 hover:border-fuchsia-400/40 hover:bg-white/10 sm:px-8"
                  >
                    <div className="absolute inset-px rounded-[22px] border border-fuchsia-500/0 transition-colors duration-500 group-hover:border-fuchsia-400/30" />
                    <div className="relative flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-zinc-500">
                      <span>{segment.label}</span>
                      <span className={isActive ? "text-fuchsia-300" : ""}>
                        {isActive
                          ? "Now"
                          : isFinal && phase === "finished"
                            ? "Arrival"
                            : "Echo"}
                      </span>
                    </div>
                    <p className="relative mt-4 text-base leading-7 text-zinc-100 sm:text-lg sm:leading-8">
                      {segment.text}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="mt-auto w-full max-w-3xl pt-16">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full origin-left rounded-full bg-gradient-to-r from-fuchsia-500 via-rose-500 to-sky-400 transition-[width] duration-150 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-[0.6rem] uppercase tracking-[0.35em] text-zinc-500">
            <span>{latestSegment?.label ?? "00:00"}</span>
            <span>{phase === "running" ? "Descending" : phase === "finished" ? "Arrival" : "Idle"}</span>
            <span>{remainingLabel}</span>
          </div>

          {phase === "finished" && (
            <button
              onClick={handleReplay}
              className="mt-8 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-zinc-200 transition hover:border-fuchsia-400/40 hover:text-white"
            >
              Replay Descent
            </button>
          )}
        </footer>
      </div>
    </main>
  );
}
