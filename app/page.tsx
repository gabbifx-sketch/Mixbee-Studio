"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDownRight, ArrowUpRight, AudioLines, Menu } from "lucide-react";

const MIC_MODEL = "https://cdn.3dassets.dev/assets/38856/v1/model.glb";

function Microphone() {
  const rig = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MIC_MODEL);
  useFrame((state) => {
    if (!rig.current) return;
    rig.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.24;
    rig.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.32) * 0.035;
  });
  return <group ref={rig} scale={8.8} position={[0, -0.55, 0]}>
    <primitive object={scene} />
  </group>;
}

function MicScene() {
  return <Canvas camera={{ position: [0, 0, 4.5], fov: 34 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
    <ambientLight intensity={1.35} />
    <directionalLight position={[3, 5, 4]} intensity={3.5} color="#fff0ff" />
    <pointLight position={[-3, 1, 2]} intensity={18} color="#a855f7" />
    <pointLight position={[2, -2, 2]} intensity={14} color="#ec4899" />
    <Microphone />
    <Environment preset="studio" />
  </Canvas>;
}
useGLTF.preload(MIC_MODEL);

const studioImage = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2200&q=90";
const performanceImage = "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1800&q=90";
const consoleImage = "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1800&q=90";

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".hero-copy > *", { y: 34, opacity: 0, duration: 1, stagger: 0.13, ease: "power4.out" });
      gsap.to(".scroll-mic", {
        x: "-38vw", y: "46vh", rotation: 560, scale: 0.68, ease: "none",
        scrollTrigger: { trigger: ".page-flow", start: "top top", end: "bottom bottom", scrub: 1.1 }
      });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, { y: 48, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 84%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".scene-image").forEach((el) => {
        gsap.fromTo(el, { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } });
      });
    });
    return () => ctx.revert();
  }, []);

  return <main>
    <div className="scroll-mic" aria-hidden="true"><MicScene /></div>
    <header className="header">
      <a className="wordmark" href="#home"><AudioLines size={21} /> MIXBEE<span>.</span></a>
      <nav><a href="#studio">Studio</a><a href="#sound">What we do</a><a href="#contact">Contact</a></nav>
      <a className="header-book" href="#contact">Book a session <ArrowUpRight size={16} /></a>
      <button className="mobile-menu" aria-label="Open menu"><Menu /></button>
    </header>

    <div className="page-flow">
      <section className="hero" id="home" style={{ backgroundImage: `linear-gradient(90deg,rgba(8,5,15,.94) 0%,rgba(8,5,15,.72) 43%,rgba(8,5,15,.2) 100%),linear-gradient(0deg,rgba(8,5,15,.35),transparent 55%),url(${studioImage})` }}>
        <div className="hero-copy">
          <span className="eyebrow">MIXBEE RECORDING STUDIO</span>
          <h1>MAKE<br />SOUND<br /><span>MATTER.</span></h1>
          <p>Bring your ideas to life. Find your sound. Make something that stays with people.</p>
          <a className="pill-button" href="#contact">Step into the studio <ArrowUpRight size={17} /></a>
        </div>
        <a className="scroll-hint" href="#studio">SCROLL TO EXPLORE <ArrowDownRight size={17} /></a>
        <span className="hero-location">GHANA · RECORDING / MIXING / MASTERING</span>
      </section>

      <section className="statement" id="studio">
        <div className="statement-copy reveal">
          <span className="eyebrow">THE MIXBEE EXPERIENCE</span>
          <h2>Every sound<br />starts <span>somewhere.</span></h2>
          <p>A space to create, experiment and bring the sound in your head into the real world.</p>
        </div>
        <div className="statement-image scene-image" style={{ backgroundImage: `url(${performanceImage})` }} aria-label="Artist performing in a recording studio" />
      </section>

      <section className="sound-section" id="sound">
        <div className="sound-heading reveal">
          <span className="eyebrow">FROM FIRST TAKE TO FINAL PLAY</span>
          <h2>THE SOUND<br /><span>IS YOURS.</span></h2>
        </div>
        <div className="sound-list">
          <div className="sound-item reveal"><span>01</span><h3>Recording</h3><p>Capture the moment.</p><ArrowUpRight /></div>
          <div className="sound-item reveal"><span>02</span><h3>Mixing</h3><p>Bring every layer together.</p><ArrowUpRight /></div>
          <div className="sound-item reveal"><span>03</span><h3>Mastering</h3><p>Give your sound its final polish.</p><ArrowUpRight /></div>
          <div className="sound-item reveal"><span>04</span><h3>Production</h3><p>Build an idea into a record.</p><ArrowUpRight /></div>
        </div>
      </section>

      <section className="full-image scene-image" style={{ backgroundImage: `linear-gradient(90deg,rgba(8,5,15,.62),rgba(8,5,15,.05)),url(${consoleImage})` }}>
        <div className="image-caption reveal"><span className="eyebrow">DETAIL MAKES THE DIFFERENCE</span><h2>HEAR<br />EVERYTHING.</h2></div>
      </section>

      <section className="contact" id="contact">
        <span className="eyebrow reveal">YOUR NEXT TRACK STARTS HERE</span>
        <h2 className="reveal">LET'S MAKE<br /><span>IT REAL.</span></h2>
        <p className="reveal">Have a sound in mind? Let's talk about bringing it to life.</p>
        <a className="pill-button reveal" href="mailto:hello@mixbee.studio">Get in touch <ArrowUpRight size={17} /></a>
        <span className="contact-note">CONTACT DETAILS TO BE CONFIRMED</span>
      </section>
      <footer className="footer"><a className="wordmark" href="#home"><AudioLines size={20} /> MIXBEE<span>.</span></a><span>MAKE SOUND MATTER.</span><span>© 2026 MIXBEE STUDIO</span></footer>
    </div>
  </main>;
}
