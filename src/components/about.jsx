import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "../utils/index";

gsap.registerPlugin(ScrollTrigger);


export default function About() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const rightColRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const rightCol = rightColRef.current;

    if (!section || !sticky || !rightCol) return;

    gsap.fromTo(
      ".titleAbout",
      { opacity: 0, y: 10 },
      {
          opacity: 1,
          y: 0,
          ease: "power1.out",
          scrollTrigger: {
              trigger: ".titleAbout",
              start: "top bottom",
              end: "top center",
              scrub: true,
              invalidateOnRefresh: true,
          },
      }
  );

    const blocks = rightCol.querySelectorAll(".service-block");

    blocks.forEach((block, i) => {
      gsap.fromTo(
        block,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: block,
            start: "top 80%",
            end: "top 40%",
            scrub: false,
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        '.cite',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.20,
          ease: "power1.out",
          scrollTrigger: {
            trigger: '.cite',
            start: "top 80%",
            end: "top 40%",
            scrub: false,
            toggleActions: "play none none reverse",
          },
        }
      );

    });

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      pin: sticky,
      pinSpacing: false,
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-[#F5F4F0] min-h-screen"
      style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-16 flex flex-col lg:flex-row">

        <div
          ref={stickyRef}
          className="titleAbout w-full lg:w-5/12 pb-10 lg:pb-16 lg:pr-16 flex flex-col max-lg:pt-27 lg:mt-30 max-lg:bg-[#F5F4F0] z-30 max-md:-mt-10"
          
        >
          <p className="text-xs tracking-widest text-neutral-400 uppercase mb-6 font-medium">
            Desenvolvedor Full Stack 
          </p>
          <h2
            className="text-4xl lg:text-5xl font-semibold text-neutral-900 leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Quem é o Ruan Lauro? <br />
          </h2>
        </div>

   
        <div
          ref={rightColRef}
          className="lg:w-7/12 pt-24 lg:pt-40 pb-32 lg:pl-16"
        >
          <>
            {data.services.map((service, index) => (
              <div
                key={index}
                className="service-block lg:mb-24 last:mb-0"
              >
              <div className="w-full h-px bg-neutral-300 mb-8" />

                <h3
                  className="text-xl font-semibold text-neutral-900 mb-4"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {service.title}
                </h3>

                <p className="text-neutral-500 text-base leading-relaxed mb-8 max-w-prose">
                  {service.description}
                </p>

                <ul className="space-y-3">
                  {service.items && service.items.length > 0 && service.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-neutral-700">
                      <span
                        className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "#C0503A" }}
                      />
                      <span>
                        <span className="font-semibold text-neutral-900">{item.label}:</span>{" "}
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="cite lg:text-lg mx-auto text-justify md:text-center max-lg:mt-10 max-w-xl">
                <blockquote>
                “Nem tudo está perdido como parece… sabe, coisas extraordinárias só
                acontecem a pessoas extraordinárias. Vai ver é um sinal de que você tem
                um destino extraordinário, algum destino maior do que você pode ter
                imaginado.”
              </blockquote>

              <cite>
                — Ripchip, As Crônicas de Nárnia: A Viagem do Peregrino da Alvorada
              </cite>
            </div>

            <p className="text-[#F5F4F0] mt-10 max-md:hidden" >
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero, accusamus recusandae! Repudiandae temporibus dicta fugiat obcaecati, doloremque natus eum unde nam incidunt odio corporis, quibusdam quae in excepturi dolorem ducimus! lore
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam eaque voluptates, eum provident sunt rem ipsa assumenda eveniet ratione itaque accusamus optio nulla, deleniti blanditiis dolores vero libero est suscipit. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. lora 
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero, accusamus recusandae! Repudiandae temporibus dicta fugiat obcaecati, doloremque natus eum unde nam incidunt odio corporis, quibusdam quae in excepturi dolorem ducimus! lore
            </p>

          </>
        </div>

       
      </div>
      
    </section>
  );
}