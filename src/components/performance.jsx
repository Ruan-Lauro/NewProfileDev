import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import data from "../utils/index";
import {useMediaQuery} from "react-responsive";

const Performance = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
    const sectionRef = useRef(null);

    useGSAP(
        () => {
            const sectionEl = sectionRef.current;
            if (!sectionEl) return;

            gsap.fromTo(
                ".titlePerformance",
                { opacity: 0, y: 10 },
                {
                    opacity: 1,
                    y: 0,
                    ease: "power1.out",
                    scrollTrigger: {
                        trigger: ".titlePerformance",
                        start: "top bottom",
                        end: "top center",
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                }
            );

             gsap.fromTo(
                ".content p",
                { opacity: 0, y: 10 },
                {
                    opacity: 1,
                    y: 0,
                    ease: "power1.out",
                    scrollTrigger: {
                        trigger: ".content p",
                        start: "top bottom",
                        end: "top center",
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                }
            );

            if (isMobile) return;

            const tl = gsap.timeline({
                defaults: { duration: 1, ease: "power1.inOut", overwrite: "auto" },
                scrollTrigger: {
                    trigger: sectionEl,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 4,
                    invalidateOnRefresh: true,
                },
            });

            data.performanceImgPositions.forEach((item) => {
                if (item.id === "p5") return;

                const selector = `.${item.id}`;
                const vars = {};

                if (typeof item.left === "number") vars.left = `${item.left}%`;
                if (typeof item.right === "number") vars.right = `${item.right}%`;
                if (typeof item.bottom === "number") vars.bottom = `${item.bottom}%`;

                if (item.transform) vars.transform = item.transform;

                tl.to(selector, vars, 0);
            });
        },
        { scope: sectionRef, dependencies: [isMobile] }
    );

    return (
        <section id="projects" ref={sectionRef} className="w-full pb-10">
            <h2 className="titlePerformance" >Projetos que desenvolvi</h2>

             <div className="wrapper">
                {data.performanceImages.map((item, index) => (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" key={item.id}>
                        <img
                            key={index}
                            src={item.src}
                            className={item.id}
                            alt={item.alt || `Performance Image #${index + 1}`}
                        />
                    </a>
                ))}
             </div>

            <div className="content">
                <p className="text-neutral-600">
                    Foram projetos que desenvolvi recentemente ou faz um tempinho, mas são alguns que fiz com muito carinho e dedicação, e que me ajudaram a evoluir como desenvolvedor. Tenho orgulho deles e espero que você também goste. Se quiser ver mais, é só clicar nos links das imagens para acessar os repositórios no GitHub.
                </p>
            </div>
        </section>
    )
}
export default Performance