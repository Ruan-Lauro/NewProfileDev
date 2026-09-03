import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import {useGSAP} from "@gsap/react";
import './hero.css'

import animation from "../assets/animation.mp4";

gsap.registerPlugin(SplitText);

function Hero() {

    useGSAP(() => {

        const text = document.querySelector(".text");

        SplitText.create(text, {
        splitBy: "chars,words",
        wordsClass: "word",
        charsClass: "char",
        mask: "words",
        autoSplit: true,
        onSplit: (self) => {
            self.words.forEach((word) => {
            const content = word.innerHTML;
            word.innerHTML = "";
            const chars = document.createElement("div");
            chars.classList.add("before");
            chars.innerHTML = content;
            const dupe = document.createElement("div");
            dupe.classList.add("after");
            dupe.innerHTML = content;
            word.append(chars, dupe);
            });
        }
        });
    })

    return ( 
        <section id="home" className="flex min-h-screen items-center justify-center ">
            <div className="flex items-center w-full justify-between max-w-7xl max-xl:px-5 max-lg:flex-col max-lg:gap-5" >
                <div className="flex flex-col max-lg:items-center gap-3 font-generalsans" >
                    <p className="text-neutral-400" >// System.init</p>
                    <h1 className="text xl:text-8xl sm:text-7xl text-5xl font-semibold text-black/85 max-sm:text-center" >Olá, eu sou <br /> Ruan Lauro</h1>
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-600 max-lg:text-center" >Desenvolvedor Full Stack</h2>
                    <p className="sm:text-lg text-gray-600 max-w-100 xl:max-w-130 max-lg:text-center" >Código, criatividade e tecnologia para transformar ideias em realidade.</p>
                </div>
                <div className="w-90 sm:w-100 sm:h-60 h-50 xl:w-132 xl:h-80 overflow-hidden">
                    <video
                        src={animation}
                        className="w-full h-full object-cover" 
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>
            </div>

        </section>
     );
}

export default Hero;