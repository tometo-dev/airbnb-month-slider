import { useEffect, useState } from "react";
import { cn } from "./utils";

export function Slider() {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((angle) => (angle + 1) % 360);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  const degrees = `-${angle}deg`;

  return (
    <div
      className="text-blue-500 w-full h-full flex items-center justify-center"
      style={
        {
          "--outer-radius": "20rem",
          "--inner-radius": "12.5rem",
          "--angle": degrees,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "rounded-full",
          "relative w-[calc(var(--outer-radius)*2)] h-[calc(var(--outer-radius)*2)] bg-blue-300",
          "[--ball-radius:calc(var(--outer-radius)*0.5-var(--inner-radius)*0.5)]", // calculate the ball radius
          "[--orbit-radius:calc(var(--outer-radius)-var(--ball-radius))]" // calculate the orbit radius
        )}
      >
        <div
          className={cn(
            "[--ball-origin:calc(var(--inner-radius)+var(--ball-radius))]" // calculate the ball origin
          )}
        >
          <div
            className={cn(
              "[--ball-x:calc(var(--ball-origin)-var(--orbit-radius)*cos(var(--angle)))]", // calculate the x position of the ball
              "[--ball-y:calc(var(--ball-origin)-var(--orbit-radius)*sin(var(--angle)))]" // calculate the y position of the ball
            )}
          >
            <div
              className={cn(
                "rounded-full",
                "w-[calc(var(--inner-radius)*2)] h-[calc(var(--inner-radius)*2)] bg-blue-500",
                "absolute inset-0 m-auto"
              )}
            ></div>
            <div
              className={cn(
                "rounded-full",
                "w-[calc(var(--ball-radius)*2)] h-[calc(var(--ball-radius)*2)] bg-red-400",
                "absolute top-[var(--ball-x)] left-[var(--ball-y)]"
              )}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
