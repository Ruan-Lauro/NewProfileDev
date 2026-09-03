import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { tecnologia } from "../assets/icon";
import { useMediaQuery } from '@custom-react-hooks/use-media-query';


gsap.registerPlugin(ScrollTrigger);

const RADIUS = 300;
const VISIBLE_ARC = 150; 

export default function Tecnologia() {
  const wrapperRef = useRef(null); 
  const stickyRef  = useRef(null); 
  const wheelRef   = useRef(null);
  const cardRefs   = useRef([]);
  const nameRef    = useRef(null);

  const count = tecnologia.length;
  const step  = 360 / count;

  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const sticky  = stickyRef.current;
    const wheel   = wheelRef.current;
    const cards   = cardRefs.current;

    gsap.fromTo(
      '.titleTecnologia',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.20,
        ease: "power1.out",
        scrollTrigger: {
          trigger: '.titleTecnologia',
          start: "top 80%",
          end: "top 40%",
          scrub: false,
          toggleActions: "play none none reverse",
        },
      }
    );

    function updateCards(angle) {
      let closestDist = Infinity;
      let closestName = "";

      cards.forEach((card, i) => {
        if (!card) return;

        const cardPos = ((i * step - angle) % 360 + 360) % 360;
        const norm = cardPos > 180 ? cardPos - 360 : cardPos;
        const distFromBase = Math.abs(Math.abs(norm) - 180);

        const halfArc = VISIBLE_ARC / 2;

        if (distFromBase <= halfArc) {
          const t = 1 - distFromBase / halfArc; 
          gsap.set(card, {
            autoAlpha: Math.pow(t, 0.4),
            scale: 0.5 + 0.6 * t,
            zIndex: Math.round(t * 10),
          });
          if (distFromBase < closestDist) {
            closestDist = distFromBase;
            closestName = tecnologia[i].nome;
          }
        } else {
          gsap.set(card, { autoAlpha: 0, scale: 0.3, zIndex: 0 });
        }
      });

      if (nameRef.current && closestName) {
        nameRef.current.textContent = closestName;
      }
    }

    updateCards(0);

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      onUpdate(self) {
        const angle = self.progress * 360;

        gsap.set(wheel, { rotate: -angle });

        cards.forEach((card) => {
          if (card) gsap.set(card, { rotate: angle });
        });

        updateCards(angle);
      },
    });

    return () => st.kill();
  }, [count, step]);


  const positions = tecnologia.map((_, i) => {
    const angleDeg = i * step - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: RADIUS * Math.cos(angleRad),
      y: RADIUS * Math.sin(angleRad),
    };
  });

  return (
    <div id="skills" ref={wrapperRef} style={{ height: "300vh" }} className=" pb-30">
      <div
        ref={stickyRef}
        className="sticky top-0 flex flex-col items-center justify-center w-full overflow-hidden  h-screen"
      >
        <p className="titleTecnologia absolute top-10 text-neutral-600 text-4xl md:text-6xl mt-30 uppercase font-medium z-20">
          Tecnologias
        </p>

        <div
          className="relative"
          style={{ width: RADIUS * 1, height: RADIUS * 1 }}
        >

          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: -56,
              border: "1px solid rgba(0,0,0, 0.1)",
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: -70,
              border: "1px solid rgba(0,0,0, 0.1)",
            }}
          />

          <div
            ref={wheelRef}
            className="absolute inset-0 max-md:-mt-30"
            style={{ transformOrigin: "center center" }}
          >
            {tecnologia.map((tech, i) => (
              <div
                key={tech.nome}
                ref={(el) => (cardRefs.current[i] = el)}
                className="absolute flex flex-col items-center gap-2 select-none "
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(calc(${positions[i].x}px - 50%), calc(${positions[i].y}px - 50%))`,
                  willChange: "transform, opacity",
                  visibility: "hidden", 
                }}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-lg">
                  {tech.icon}
                </div>
                <span className="text-black text-[11px] font-medium ">
                  {tech.nome}
                </span>
              </div>
            ))}
          </div>
        </div>


  

        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-25 select-none z-20 max-md:hidden">
          <span className="text-black text-[9px] tracking-widest uppercase">scroll</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v10M4 9l4 4 4-4"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}