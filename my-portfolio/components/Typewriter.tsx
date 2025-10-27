"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  /** supply either `text` for static single usage or `phrases` to loop through */
  text?: string;
  phrases?: string[];
  className?: string;
  typingSpeed?: number; // ms per char when typing
  deletingSpeed?: number; // ms per char when deleting
  pause?: number; // pause between finished word and deleting (ms)
  showCaret?: boolean;
};

export default function Typewriter({
  text,
  phrases,
  className = "",
  typingSpeed = 80,
  deletingSpeed = 40,
  pause = 1400,
  showCaret = true,
}: Props) {
  const usePhrases = Array.isArray(phrases) && phrases.length > 0;

  const source = useMemo(() => {
    if (usePhrases) return phrases!;
    if (text) return [text];
    return [""];
  }, [phrases, text, usePhrases]);

  const [display, setDisplay] = useState<string>("");
  const [phraseIndex, setPhraseIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const mounted = useRef<boolean>(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mounted.current) return;

    const current = source[phraseIndex % source.length];

    let timeoutId: number | undefined;

    if (!isDeleting) {
      // typing
      if (display.length < current.length) {
        timeoutId = window.setTimeout(() => {
          setDisplay((prev) => prev + current.charAt(prev.length));
        }, typingSpeed);
      } else {
        // finished typing
        if (usePhrases) {
          timeoutId = window.setTimeout(() => {
            setIsDeleting(true);
          }, pause);
        }
      }
    } else {
      // deleting
      if (display.length > 0) {
        timeoutId = window.setTimeout(() => {
          setDisplay((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      } else {
        // move to next phrase
        timeoutId = window.setTimeout(() => {
          setIsDeleting(false);
          setPhraseIndex((i) => (i + 1) % source.length);
        }, typingSpeed);
      }
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
    // intentionally including dependencies that affect typing behavior
  }, [display, isDeleting, phraseIndex, typingSpeed, deletingSpeed, pause, source, usePhrases]);

  const classList = `${className} ${showCaret ? "typewriter-caret" : ""}`.trim();

  return (
    <span className={classList} aria-live="polite">
      {display}
    </span>
  );
}
