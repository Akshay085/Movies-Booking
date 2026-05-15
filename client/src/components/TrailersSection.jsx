import React, { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import ReactPlayer from "react-player";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  return (
    <div className="px-6 md:px-12 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-serif font-semibold text-2xl max-w-[960px] mx-auto">
        Trailers
      </p>

      <div className="relative mt-10 max-w-[960px] mx-auto aspect-video">
        <BlurCircle top="-100px" right="-100px" />
        <iframe
          src={currentTrailer.videoUrl.replace("watch?v=", "embed/")}
          title="YouTube video player"
          frameBorder="0"
          allowFullScreen
          className="w-full h-full rounded-2xl shadow-2xl"
        ></iframe>{" "}
      </div>

      <div className="group grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer) => (
          <div
            key={trailer.image}
            className="relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition
                h-24 sm:h-32 md:h-40 cursor-pointer"
            onClick={() => setCurrentTrailer(trailer)}
          >
            <img
              src={trailer.image}
              alt="trailer"
              className="rounded-lg w-full h-full object-cover brightness-75 border border-white/10"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircleIcon
                strokeWidth={1.5}
                className="w-6 md:w-10 h-6 md:h-10 text-white/80 group-hover:text-primary transition-colors"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailersSection;
