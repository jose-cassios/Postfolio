import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type Engine, MoveDirection, OutMode } from "@tsparticles/engine";
import { loadFull } from "tsparticles";

const ParticleComponent = () => {
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Função opcional para ser chamada quando as partículas terminam de carregar no canvas
  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log("Particles container loaded", container);
  };

  const options = useMemo(() => ({
    fullScreen: {
      enable: true,
      zIndex: 0,
    },
    particles: {
      number: {
        value: 40,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: "#ADD8E6",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
      },
      size: {
        value: { min: 1, max: 3 },
      },
      move: {
        enable: true,
        speed: 1,
        direction: MoveDirection.none,
        outModes: {
          default: OutMode.out,
        },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
        },
      },
      modes: {
        repulse: {
          distance: 150,
          duration: 0.4,
        },
      },
    },
  }), []);

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={options}
        particlesLoaded={particlesLoaded}
      />
    );
  }

  return <></>;
};

export default ParticleComponent;
