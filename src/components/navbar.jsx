import data from "../utils/index";
import { useState, useEffect } from "react";
import gsap from "gsap";
import close from "../assets/close1.png";
import menu from "../assets/menu1.png";

const NavItems = ({ onNavigate }) => {

    const handleMouseEnter = (e) => {
        const letters = Array.from(e.currentTarget.children);

        if (letters.length < 2) return;

        gsap.killTweensOf(letters);

        gsap.set(letters, {
            y: 0,
        });

        const indexes = [];

        while (indexes.length < 2) {
            const randomIndex = Math.floor(
                Math.random() * letters.length
            );

            if (!indexes.includes(randomIndex)) {
                indexes.push(randomIndex);
            }
        }

        const selectedLetters = indexes.map(
            (index) => letters[index]
        );

        gsap.timeline()
            .to(selectedLetters, {
                y: -8,
                duration: 0.2,
                ease: "power2.out",
                stagger: 0.05,
            })
            .to(selectedLetters, {
                y: 0,
                duration: 0.3,
                ease: "bounce.out",
                stagger: 0.05,
            });
    };

    return (
        <ul className="nav-ul">
            {data.navLinks.map(({ href, id, name }) => (
                <li key={id} className="nav-li">

                    <a
                        href={href}
                        className="nav-li_a"
                        onClick={onNavigate}
                    >
                        <span
                            onMouseEnter={handleMouseEnter}
                            style={{
                                cursor: "pointer",
                                display: "inline-flex",
                            }}
                        >
                            {name.split("").map((letter, index) => (
                                <span
                                    key={index}
                                    style={{
                                        display: "inline-block",
                                    }}
                                >
                                    {letter}
                                </span>
                            ))}
                        </span>

                    </a>

                </li>
            ))}
        </ul>
    );
};

function Navbar() {

    const [isOpen, setIsOpen] = useState(false)
    const [hasScrolled, setHasScrolled] = useState(false)

    useEffect(() => {
        const closeMenu = () => setIsOpen(false);
        const handleScroll = () => setHasScrolled(window.scrollY > 0);

        handleScroll();
        window.addEventListener("close-mobile-menu", closeMenu);
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("close-mobile-menu", closeMenu);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return ( 
        <header className={`text-white fixed top-0 left-0 right-0 z-50 bg-white rounded-b-xl transition-shadow duration-300 ${hasScrolled ? "shadow-sm" : ""}`} >
            <div className="max-w-7xl mx-auto max-xl:px-5" >
                <div className="flex justify-between items-center py-5 mx-auto" >
                    <a href="#home" className="text-neutral-600 font-bold text-xl hover:text-black/80 transition-all duration-300 hover:scale-105" >
                        Ruan Lauro
                    </a>
                    <button className="w-6 h-6 cursor-pointer text-neutral-400 hover:text-black/80 focus:outline-none sm:hidden flex" aria-label="Toogle Menu" onClick={()=>setIsOpen((prevIsOpen) => !prevIsOpen)} >
                        <img src={isOpen?close:menu} alt="menu" />
                    </button>
                    <nav className="sm:flex hidden" >
                        <NavItems onNavigate={() => setIsOpen(false)} />
                    </nav>
                </div>
                <div className={`nav-sidebar ${isOpen?" max-h-screen":"max-h-0"} `} >
                    <nav className="p-5" >
                        <NavItems onNavigate={() => setIsOpen(false)} />
                    </nav>
                </div>
            </div>
        </header>
     );
}

export default Navbar;