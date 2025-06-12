import React, { useRef, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ProjectCard from "./ProjectCard";

type Project = {
  title: string;
  role: string;
  frontImage: string;
  backContent: string;
  portfolioLink: string;
  emailContact: string;
};

interface ProjectCarouselProps {
  projects: Project[];
}

const CARD_HEIGHT = 500;

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects }) => {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "free",
    slides: {
      perView: 2,
      spacing: 12,
      origin: "center",
    },
    breakpoints: {
      "(max-width: 900px)": {
        slides: { perView: 1.1, spacing: 8, origin: "center" },
      },
      "(min-width: 901px) and (max-width: 1200px)": {
        slides: { perView: 1.2, spacing: 10, origin: "center" },
      },
    },
  });

  // Autoplay
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!slider.current) return;

    function autoplay() {
      if (slider.current) {
        slider.current.next();
      }
    }

    intervalRef.current = setInterval(autoplay, 4500);

    // Pausa autoplay ao interagir manualmente
    const sliderInstance = slider.current;
    sliderInstance.on("dragStart", () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    });
    sliderInstance.on("dragEnd", () => {
      intervalRef.current = setInterval(autoplay, 4500);
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slider]);

  return (
    <div ref={sliderRef} className="keen-slider w-full py-8 overflow-x-visible">
      {projects.map((project, idx) => (
        <div
          className="keen-slider__slide flex justify-center items-center"
          key={idx + project.title}
          style={{ height: CARD_HEIGHT }}
        >
          <ProjectCard {...project} />
        </div>
      ))}
    </div>
  );
};

export default ProjectCarousel;
