import { useRef, useState } from "react";
import { DragPreview, useDrag } from "react-aria";
import { cn } from "./utils";

const MONTHS = [
  {
    name: "Jan",
    angle: 0,
  },
  {
    name: "Feb",
    angle: 30,
  },
  {
    name: "Mar",
    angle: 60,
  },
  {
    name: "Apr",
    angle: 90,
  },
  {
    name: "May",
    angle: 120,
  },
  {
    name: "Jun",
    angle: 150,
  },
  {
    name: "Jul",
    angle: 180,
  },
  {
    name: "Aug",
    angle: 210,
  },
  {
    name: "Sep",
    angle: 240,
  },
  {
    name: "Oct",
    angle: 270,
  },
  {
    name: "Nov",
    angle: 300,
  },
  {
    name: "Dec",
    angle: 330,
  },
] as const;

type Month = (typeof MONTHS)[number]["name"];

export function Slider() {
  const [angle, setAngle] = useState(0);

  const outerCircleRef = useRef<HTMLDivElement>(null);
  const dragPreviewRef = useRef(null);

  const { dragProps } = useDrag({
    preview: dragPreviewRef,
    onDragMove(event) {
      const { x: clientX, y: clientY } = event;
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
    },
    onDragEnd() {
      // snap the knob to the nearest month
      const nearestMonth = MONTHS.reduce((prev, curr) =>
        Math.abs(curr.angle - angle) < Math.abs(prev.angle - angle)
          ? curr
          : prev
      );
      setAngle(nearestMonth.angle);
    },
    getItems() {
      return [];
    },
  });

  const handleMonthClick = (month: Month) => {
    const { angle } = MONTHS.find((m) => m.name === month)!;
    setAngle(angle);
  };

  const degrees = `-${angle}deg`;

  const monthNumber = Math.floor(angle / 30);

  return (
    <div
      className={cn(
        "text-blue-500 w-full h-full flex items-center justify-center",
        "[--outer-radius:10rem] [--inner-radius:6rem] sm:[--outer-radius:15rem] sm:[--inner-radius:10rem]"
      )}
      style={
        {
          "--angle": degrees,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "rounded-full",
          "bg-secondary-core [box-shadow:var(--box-shadow-outer)]",
          "relative w-[calc(var(--outer-radius)*2)] h-[calc(var(--outer-radius)*2)]",
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
          <AllMonthAnchors onMonthClick={handleMonthClick} />
          <div
            className={cn(
              "[--ball-x:calc(var(--ball-origin)-var(--orbit-radius)*cos(var(--angle)))]", // calculate the x position of the ball
              "[--ball-y:calc(var(--ball-origin)-var(--orbit-radius)*sin(var(--angle)))]" // calculate the y position of the ball
            )}
          >
            <div
              className={cn(
                "rounded-full [box-shadow:var(--box-shadow-inner)]",
                "w-[calc(var(--inner-radius)*2)] h-[calc(var(--inner-radius)*2)] bg-primary",
                "absolute inset-0 m-auto",
                "flex justify-center items-center flex-col"
              )}
            >
              <div className="text-[96px] leading-[1] font-bold text-black">
                {monthNumber}
              </div>
              <div className="text-base text-black font-bold">
                {monthNumber === 1 ? "month" : "months"}
              </div>
            </div>
            <button
              {...dragProps}
              className={cn(
                "rounded-full",
                "w-[calc(var(--ball-radius)*2)] h-[calc(var(--ball-radius)*2)]",
                "absolute top-[var(--ball-x)] left-[var(--ball-y)] cursor-grab",
                "flex justify-center items-center p-2 bg-transparent"
              )}
            >
              <span className="w-full h-full rounded-full bg-primary-selected [box-shadow:var(--box-shadow-knob)]" />
            </button>
            <DragPreview ref={dragPreviewRef}>
              {() => {
                // we don't want to show the drag preview
                return <div className="hidden" />;
              }}
            </DragPreview>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MonthAnchorProps extends React.ComponentProps<"button"> {
  angle: number;
}

function MonthAnchor({ angle, className, ...rest }: MonthAnchorProps) {
  return (
    <div
      style={{ "--angle": `-${angle}deg` } as React.CSSProperties}
      className={cn(
        "[--ball-x:calc(var(--ball-origin)-var(--orbit-radius)*cos(var(--angle)))]", // calculate the x position of the ball
        "[--ball-y:calc(var(--ball-origin)-var(--orbit-radius)*sin(var(--angle)))]" // calculate the y position of the ball
      )}
    >
      <button
        {...rest}
        className={cn(
          "rounded-full",
          "w-[calc(var(--ball-radius)*2)] h-[calc(var(--ball-radius)*2)]",
          "absolute top-[var(--ball-x)] left-[var(--ball-y)] cursor-grab",
          className
        )}
      />
    </div>
  );
}

type AllMonthAnchorsProps = {
  onMonthClick: (month: Month) => void;
};
function AllMonthAnchors({ onMonthClick }: AllMonthAnchorsProps) {
  return (
    <>
      {MONTHS.map(({ name, angle }) => (
        <MonthAnchor
          key={name}
          angle={angle}
          className={cn("cursor-pointer", "flex justify-center items-center")}
          onClick={() => onMonthClick(name)}
        >
          <div className="rounded-full w-1 h-1 bg-slate-500 hover:bg-slate-700" />
        </MonthAnchor>
      ))}
    </>
  );
}
