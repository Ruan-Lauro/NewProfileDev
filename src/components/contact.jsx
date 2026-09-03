import emailjs from '@emailjs/browser';
import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import useAlert from '../hooks/useAlert.js';
import Alert from './alert.jsx';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const sectionRef = useRef(null);
  const fieldRefs = useRef([]);

  const { alert, showAlert, hideAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
      },
    });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 40, letterSpacing: '0.3em' },
      { opacity: 1, y: 0, letterSpacing: '0em', duration: 0.9 },
    )

    .fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4',
    )

    .fromTo(
      fieldRefs.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.15 },
      '-=0.2',
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

   const handleFocus = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1.015,
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  const handleBlur = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.25,
      ease: 'power2.in',
    });
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: 'Ruan Lauro',
          from_email: form.email,
          to_email: 'ruanlauromonteiro@gmail.com',
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY,
      )
      .then(
        () => {
          setLoading(false);
          showAlert({
            show: true,
            text: 'Obrigado por sua mensagem!',
            type: 'success',
          });

          setTimeout(() => {
            hideAlert(false);
            setForm({ name: '', email: '', message: '' });
          }, [3000]);
        },
        (error) => {
          setLoading(false);
          console.error(error);

          showAlert({
            show: true,
            text: 'Eu não recebi sua mensagem.',
            type: 'danger',
          });
        },
      );
  };

  return (
    <section ref={sectionRef} className="c-space my-20 bg-[#F5F4F0] pb-20" id="contact">
      {alert.show && <Alert {...alert} />}

      <div className="relative min-h-screen flex items-center justify-center flex-col">
        <div className="contact-container">

          <h3 ref={titleRef} className="head-text" style={{ opacity: 0 }}>
            Fale Comigo
          </h3>
          <p
            ref={subtitleRef}
            className="text-lg text-neutral-600 mt-3"
            style={{ opacity: 0 }}
          >
            Seja para criar um novo site, aprimorar sua plataforma atual ou
            tirar um projeto único do papel, estou aqui para ajudar.
          </p>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col space-y-7"
          >
            <label
              className="space-y-3"
              ref={(el) => (fieldRefs.current[0] = el)}
              style={{ opacity: 0 }}
            >
              <span className="field-label">Nome Completo</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                className="field-input"
                placeholder="ex., Ruan Lauro"
              />
            </label>

            <label
              className="space-y-3"
              ref={(el) => (fieldRefs.current[1] = el)}
              style={{ opacity: 0 }}
            >
              <span className="field-label">E-mail</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                className="field-input"
                placeholder="ex., ruanlauro@gmail.com"
              />
            </label>

            <label
              className="space-y-3"
              ref={(el) => (fieldRefs.current[2] = el)}
              style={{ opacity: 0 }}
            >
              <span className="field-label">Sua mensagem</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                rows={5}
                className="field-input"
                placeholder="Compartilhe seus pensamentos ou dúvidas..."
              />
            </label>

            <div
              ref={(el) => (fieldRefs.current[3] = el)}
              style={{ opacity: 0 }}
            >
              <button className="field-btn" type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;