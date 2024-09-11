import { useState, useRef } from "react";
import plus from "../assets/plus.svg";
import noperson from "../assets/user.svg";
import Button from "../ui/Button";
// import up from "../assets/up.svg";

export default function ViewPic({
  img,
  setIsViewPic,
}: {
  img: string;
  setIsViewPic: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imgRef.current && containerRef.current) {
      const { clientX, clientY } = e;
      const { left, top, width, height } =
        imgRef.current.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      const xPercent = (x / width) * 100;
      const yPercent = (y / height) * 100;

      imgRef.current.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    }
  };

  const handleMouseEnter = () => setZoom(true);
  const handleMouseLeave = () => {
    setZoom(false);
    if (imgRef.current) {
      imgRef.current.style.transformOrigin = "center center";
    }
  };

  return (
    <div className="fixed container z-10 sm:w-[36rem] w-[26rem] bg-zinc-900/15 backdrop-blur-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 border-2 rounded-2xl border-zinc-600 mx-auto overflow-clip">
      <div>
        <img
          src={plus}
          alt="close"
          onClick={() => setIsViewPic(false)}
          className="rotate-45 absolute cursor-pointer top-2 w-4 h-4 right-2 ml-auto bg-red-500 rounded-full touch-pinch-zoom hover:scale-125 transition-all"
        />
      </div>
      {img.length > 0 ? (
        <div
          ref={containerRef}
          className="overflow-clip rounded-xl"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`zoom-container ${zoom ? "zoomed" : ""}`}>
            <img
              ref={imgRef}
              src={img}
              alt="img"
              className="transition-transform duration-300"
              style={{ transform: zoom ? "scale(2)" : "scale(1)" }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-x-2">
          <img src={noperson} alt="No Image" />
          <p>No Image Is Available</p>
        </div>
      )}
      {img.length > 0 && (
        <div className="pt-4">
          <a href={img} target="_blank" rel="noopener noreferrer">
            <Button
              text="View Full"
              variant="secondary"
              className="w-full border border-zinc-600"
            />
          </a>
        </div>
      )}
    </div>
  );
}
