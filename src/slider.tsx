import { useRef, useState } from "react";
import { cn } from "./utils";

const DRAG_IMAGE_ID = "__drag-image";

export function Slider() {
  const [angle, setAngle] = useState(0);

  const outerCircleRef = useRef<HTMLDivElement>(null);

  const degrees = `-${angle}deg`;

  const handleDrag = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const { clientX, clientY } = event;

    // update the drag image
    const dragImage = document.getElementById(DRAG_IMAGE_ID);
    if (dragImage) {
      // BUg: this is not working as expected
      // TODO: fix this
      event.dataTransfer?.setDragImage(dragImage, clientX, clientY);
    }

    // for some weird reason, the clientX and clientY for the drag event
    // when the drag is release (i.e. dropped) is always 0
    // which messes up with the final position of the knob
    if (!clientX || !clientY) return;

    if (outerCircleRef.current) {
      const { top, left, width, height } =
        outerCircleRef.current.getBoundingClientRect();

      const originX = left + width / 2;
      const originY = top + height / 2;

      const x = clientX - originX;
      const y = clientY - originY;

      let angle = (Math.atan2(y, x) * 180) / Math.PI;

      // this angle is offset by 90 degrees because the 0 degree is at the top
      angle = angle + 90;

      // make sure the angle is between 0 and 360 and strip any floating point
      angle = Math.round((angle + 360) % 360);

      setAngle(angle);
    }
  };

  const handleDragStart = () => {
    // create a drag image
    const dragImage = document.createElement("div");
    dragImage.style.transform = "translate(-10000px, -10000px)";
    dragImage.style.position = "absolute";
    dragImage.id = DRAG_IMAGE_ID;
    document.body.appendChild(dragImage);
  };

  const handleDragEnd = () => {
    // remove the drag image
    const dragImage = document.getElementById(DRAG_IMAGE_ID);
    if (dragImage) {
      document.body.removeChild(dragImage);
    }
  };

  return (
    <div
      className="text-blue-500 w-full h-full flex items-center justify-center"
      style={
        {
          "--outer-radius": "15rem",
          "--inner-radius": "10rem",
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
        ref={outerCircleRef}
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
            <button
              className={cn(
                "rounded-full",
                "w-[calc(var(--ball-radius)*2)] h-[calc(var(--ball-radius)*2)] bg-red-400",
                "absolute top-[var(--ball-x)] left-[var(--ball-y)] cursor-grab"
              )}
              draggable={true}
              onDrag={handleDrag}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}
