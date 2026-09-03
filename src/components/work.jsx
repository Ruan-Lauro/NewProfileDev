import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Html, PerformanceMonitor } from "@react-three/drei";
import { Suspense, useRef, useMemo, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Macbook } from "./models/Macbook";
import { useMediaQuery } from "react-responsive";
import clsx from "clsx";
import data from "../utils/index";

function StudioLight() {
  const rot = useMemo(() => [0, Math.PI / 2, 0], []);
  return (
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={10} position={[-10, 5, -5]} scale={10} rotation={rot} />
      <Lightformer form="rect" intensity={10} position={[10, 0, 1]} scale={10} rotation={rot} />
    </Environment>
  );
}

function ModelScroll() {
  const groupRef = useRef(null);
  const scrollProgress = useRef(0);
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const { invalidate } = useThree(); 

  useGSAP(() => {

    gsap.fromTo(
      '.titleFeatures',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.20,
        ease: "power1.out",
        scrollTrigger: {
          trigger: '.titleFeatures',
          start: "top 80%",
          end: "top 40%",
          scrub: false,
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.timeline({
      scrollTrigger: {
        trigger: "#f-canvas",

        start: "top top",
        end: "bottom+=300 top",
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
          invalidate(); 
        },
      },
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: "#f-canvas",
        start: "top center",
        end: "bottom top",
        scrub: 1,
      },
    })
      .to(".box1", { opacity: 1, y: 0, delay: 1 })
      .to(".box2", { opacity: 1, y: 0 })
      .to(".box3", { opacity: 1, y: 0 })
      .to(".box4", { opacity: 1, y: 0 })
      .to(".box5", { opacity: 1, y: 0 })
      .to(".box6", { opacity: 1, y: 0 })
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = scrollProgress.current * Math.PI * 2;
    }
  });


  return (
    <group ref={groupRef}>
      <Suspense fallback={<Html><h1>Loading...</h1></Html>}>
        <Macbook scale={isMobile ? 0.05 : 0.08} position={[0, -1, 0]} />
      </Suspense>
    </group>
  );
}

function Works() {
  const [dpr, setDpr] = useState(1.5);

  return (
    <section id="experience" >
      <h2 className="titleFeatures" >Experiências profissionais</h2>

      <Canvas
        id="f-canvas"
        frameloop="demand"      
        dpr={dpr}
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
        }}
      >
        <PerformanceMonitor
          bounds={() => [30, 60]}
          onDecline={() => setDpr(d => Math.max(1, d * 0.8))}

        />
        <StudioLight />
        <ambientLight intensity={0.5} />
        <ModelScroll />
      </Canvas>

      <div className="absolute inset-0">
        {data.features.map((feature, index) => (
            <div key={feature.id} className={clsx("box", `box${index + 1}`, feature.styles)}>
            <div className="p-4 max-w-65 flex flex-col gap-2">
                
                <span className="font-medium text-lg text-black/80 ">
                    {feature.highlight}
                </span>

                <span className=" text-sm text-neutral-600 leading-snug">
                    {feature.period}
                </span>

                <p className="text-sm text-neutral-600 m-0 leading-relaxed">
                    {feature.text}
                </p>

                {feature.techs?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                    {feature.techs.map((tech) => (
                    <span
                        key={tech}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-300 text-neutral-800"
                    >
                        {tech}

                    </span>
                    ))}
                </div>
                )}
            </div>
            </div>
        ))}
        </div>
    </section>
  );
}

export default Works;