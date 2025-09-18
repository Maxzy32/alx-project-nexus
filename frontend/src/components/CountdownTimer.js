import React, { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";

const CountdownTimer = ({ endTime, startTime }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [percentage, setPercentage] = useState(100);

  useEffect(() => {
    if (!endTime) return;

    const end = new Date(endTime).getTime();
    const start = startTime ? new Date(startTime).getTime() : new Date().getTime(); // fallback to now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft("Poll ended");
        setPercentage(0);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      const totalDuration = end - start;
      setPercentage(Math.max(0, Math.round((diff / totalDuration) * 100)));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, startTime]);

  return (
    <div className="mb-3">
      <p className="fw-bold text-warning">Time Left: {timeLeft}</p>
      <ProgressBar
        now={percentage}
        label={timeLeft !== "Poll ended" ? `${percentage}%` : ""}
        variant={percentage > 50 ? "success" : percentage > 20 ? "warning" : "danger"}
      />
    </div>
  );
};

export default CountdownTimer;
