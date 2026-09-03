import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import data from "../utils/index";

const Footer = () => {
    const footerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".footer-top", {
                opacity: 0,
                y: 16,
                duration: 0.6,
                ease: "power2.out",
            });
            gsap.from(".footer-bottom", {
                opacity: 0,
                y: 10,
                duration: 0.5,
                ease: "power2.out",
                delay: 0.15,
            });
        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef}>
            <div className="footer-top">
                <p className="footer-label">Encontre-me em</p>
                <div className="social-icons">
                    <a href="https://github.com/Ruan-Lauro" aria-label="Github">
                        <img src="src/assets/github.svg" alt="Github" />
                    </a>
                    <a href="https://www.linkedin.com/in/ruan-lauro-983577216/" aria-label="LinkedIn">
                        <img src="src/assets/linkedin.svg" alt="LinkedIn" />
                    </a>
                    <a href="mailto:ruanlauromonteiro@gmail.com" aria-label="Email">
                        <img src="src/assets/email.svg" alt="Email" />
                    </a>
                </div>
            </div>

            <hr />

            <div className="footer-bottom">
                <p className="copyright">© 2026 Ruan Lauro. All rights reserved.</p>
                <nav>
                    <ul>
                        {data.navLinks.map(({ name, href }) => (
                            <li key={name}>
                                <a href={href}>{name}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;