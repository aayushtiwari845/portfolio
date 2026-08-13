"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function MumbaiClock() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const update = () => setTime(formatter.format(new Date()));
    let interval = 0;
    const start = () => {
      update();
      window.clearInterval(interval);
      interval = window.setInterval(update, 60_000);
    };
    const handleVisibility = () => {
      if (document.hidden) {
        window.clearInterval(interval);
      } else {
        start();
      }
    };

    start();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return <time aria-label={`Current time in Mumbai: ${time}`}>{time}</time>;
}
