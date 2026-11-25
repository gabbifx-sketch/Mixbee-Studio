"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, AudioLines, Headphones, Menu, Mic2, Play, Radio, Sparkles, Waves, X } from "lucide-react";

const MIC_MODEL = "https://cdn.3dassets.dev/assets/38856/v1/model.glb";

function RealMicrophone() {
  const rig = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MIC_MODEL);
  useFrame((state, delta) => {
    if (!rig.current) return;
    rig.current.rotation.y += delta * 0.24;
    rig.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.035;
  });
  return <group ref={rig} scale={2.55} position={[0, -0.52, 0]}>
    <primitive object={scene} />
  </group>;
}

function MicCanvas() {
  return <Canvas camera={{ position: [0, 0, 4.6], fov: 34 }} dpr={[1,1.5]} gl={{ alpha:true, antialias:true }}>
    <ambientLight intensity={1.25}/>
    <directionalLight position={[3,5,4]} intensity={3.2} color="#fff0ff"/>
    <pointLight position={[-3,1,2]} intensity={18} color="#bd65ff"/>
    <pointLight position={[2,-2,2]} intensity={13} color="#ff65ba"/>
    <RealMicrophone/>
    <ContactShadows position={[0,-1.1,0]} opacity={0.32} scale={4} blur={2.6} far={3}/>
    <Environment preset="studio"/>
  </Canvas>;
}
useGLTF.preload(MIC_MODEL);

const services = [
  {number:"01", icon:Mic2, title:"Recording", copy:"Capture the voice, performance and feeling behind every idea."},
  {number:"02", icon:Waves, title:"Mixing", copy:"Bring every element together with clarity, space and impact."},
  {number:"03", icon:Headphones, title:"Mastering", copy:"The final polish that helps your sound translate everywhere."},
  {number:"04", icon:Radio, title:"Production", copy:"Shape raw ideas into a sound with its own identity."},
];

export default function Home() {
  const [menuOpen,setMenuOpen]=useState(false);
  useEffect(()=>{
    gsap.registerPlugin(ScrollTrigger);
    const ctx=gsap.context(()=>{
      gsap.fromTo(".hero-copy .reveal",{y:36,opacity:0},{y:0,opacity:1,duration:1,stagger:.13,ease:"power4.out",delay:.15});
      const micPath=gsap.timeline({scrollTrigger:{trigger:".site-content",start:"top top",end:"bottom bottom",scrub:1.15}});
      micPath.to(".scroll-mic",{x:"-5vw",y:"8vh",rotation:115,scale:.9,ease:"none",duration:1})
        .to(".scroll-mic",{x:"-29vw",y:"-9vh",rotation:330,scale:.76,ease:"none",duration:1})
        .to(".scroll-mic",{x:"-3vw",y:"18vh",rotation:590,scale:1.02,ease:"none",duration:1})
        .to(".scroll-mic",{x:"-31vw",y:"-12vh",rotation:820,scale:.82,ease:"none",duration:1})
        .to(".scroll-mic",{x:"-7vw",y:"4vh",rotation:1080,scale:.9,ease:"none",duration:1});
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el)=>{
        gsap.fromTo(el,{y:54,opacity:0},{y:0,opacity:1,duration:.95,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 86%",once:true}});
      });
      gsap.utils.toArray<HTMLElement>(".service-card").forEach((el,i)=>{
        gsap.fromTo(el,{y:55,opacity:0,scale:.97},{y:0,opacity:1,scale:1,duration:.8,delay:i*.1,ease:"power3.out",scrollTrigger:{trigger:".service-grid",start:"top 82%",once:true}});
      });
      gsap.utils.toArray<HTMLElement>(".photo-card").forEach((el,i)=>{
        gsap.fromTo(el,{y:60,opacity:0,scale:.96},{y:0,opacity:1,scale:1,duration:.9,delay:i*.12,ease:"power3.out",scrollTrigger:{trigger:".photo-grid",start:"top 82%",once:true}});
      });
    });
    return ()=>ctx.revert();
  },[]);
  return <main>
    <div className="grain"/>
    <div className="scroll-mic" aria-hidden="true"><div className="mic-halo"/><MicCanvas/><span className="mic-caption">MIXBEE · SOUND IN MOTION</span></div>
    <header className="site-header">
      <a className="brand" href="#home"><span className="brand-mark"><AudioLines size={21}/></span><span>MIXBEE<span className="brand-dot">.</span></span></a>
      <nav className={menuOpen?"nav-links open":"nav-links"}>
        <a href="#studio" onClick={()=>setMenuOpen(false)}>Studio</a><a href="#services" onClick={()=>setMenuOpen(false)}>Services</a><a href="#gallery" onClick={()=>setMenuOpen(false)}>Gallery</a><a href="#contact" onClick={()=>setMenuOpen(false)}>Contact</a>
      </nav>
      <a className="header-cta" href="#contact">Book a session <ArrowUpRight size={16}/></a>
      <button className="menu-toggle" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen?<X/>:<Menu/>}</button>
    </header>
    <div className="site-content">
      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow reveal"><span className="eyebrow-line"/> RECORDING · MIXING · MASTERING</div>
          <h1 className="reveal">YOUR SOUND.<br/><span>YOUR</span> MOMENT.</h1>
          <p className="hero-description reveal">A space to turn raw ideas into something people can feel. Step in, find your sound, and make it count.</p>
          <div className="hero-actions reveal"><a className="button-primary" href="#contact">Book a session <ArrowUpRight size={17}/></a><a className="button-secondary" href="#studio"><span className="play-icon"><Play size={11} fill="currentColor"/></span> Explore the studio</a></div>
          <div className="hero-foot reveal"><span><i/> SOUND STARTS HERE</span><span>GHANA · MIXBEE STUDIO</span></div>
        </div>
        <div className="hero-side"><div className="hero-ring ring-a"/><div className="hero-ring ring-b"/><span className="hero-index">01 — THE EXPERIENCE</span><span className="hero-side-note">SCROLL. WATCH IT MOVE.</span></div>
        <a className="scroll-cue" href="#studio"><span>SCROLL TO EXPLORE</span><ArrowDown size={15}/></a>
      </section>
      <section className="intro-section" id="studio">
        <div className="section-kicker reveal-up"><span>01</span> / THE SPACE</div>
        <div className="intro-content reveal-up"><p className="overline">WHERE IDEAS FIND THEIR SOUND</p><h2>Make room<br/>for <span>something real.</span></h2><div className="intro-bottom"><p>Every great track starts with an idea. This is where the details come together — the takes, the layers, the moments that make a sound yours.</p><a className="round-link" href="#gallery" aria-label="Explore gallery"><ArrowUpRight/></a></div></div>
        <div className="intro-stamp"><AudioLines/><span>CREATE WITHOUT LIMITS</span></div>
      </section>
      <section className="services-section" id="services">
        <div className="section-heading"><div className="reveal-up"><div className="section-kicker"><span>02</span> / WHAT WE DO</div><h2>Every layer<br/>has a <span>purpose.</span></h2></div><p className="reveal-up">From the first take to the final polish, bring every part of your sound into focus.</p></div>
        <div className="service-grid">{services.map(({number,icon:Icon,title,copy})=><article className="service-card" key={number}><div className="service-top"><span>{number}</span><Icon size={23} strokeWidth={1.5}/></div><h3>{title}</h3><p>{copy}</p><a className="service-arrow" href="#contact" aria-label={`Ask about ${title}`}><ArrowUpRight size={18}/></a></article>)}</div>
      </section>
      <section className="gallery-section" id="gallery">
        <div className="gallery-top"><div className="reveal-up"><div className="section-kicker"><span>03</span> / INSIDE MIXBEE</div><h2>Feel the<br/><span>frequency.</span></h2></div><p className="reveal-up">The atmosphere, the equipment and the creative process — all part of the sound.</p></div>
        <div className="photo-grid">
          <figure className="photo-card photo-wide"><img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1500&q=85" alt="Professional recording studio with mixing desk and acoustic treatment"/><figcaption><span>01 / THE CONTROL ROOM</span><span>LISTEN CLOSE</span></figcaption></figure>
          <figure className="photo-card photo-tall"><img src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1100&q=85" alt="Audio mixing console in a music production studio"/><figcaption><span>02 / THE DETAILS</span><span>IN EVERY LAYER</span></figcaption></figure>
          <figure className="photo-card photo-bottom"><img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=85" alt="Singer performing into a microphone in a recording session"/><figcaption><span>03 / THE PERFORMANCE</span><span>MAKE IT YOURS</span></figcaption></figure>
        </div>
        <div className="gallery-note reveal-up"><Sparkles size={18}/><p>GOOD SOUND. GOOD ENERGY. GREAT WORK.</p><span>THE MIXBEE EXPERIENCE</span></div>
      </section>
      <section className="contact-section" id="contact">
        <div className="contact-orb reveal-up"><AudioLines size={36}/></div><div className="section-kicker reveal-up"><span>04</span> / YOUR NEXT MOVE</div>
        <h2 className="reveal-up">LET'S MAKE<br/><span>IT MATTER.</span></h2><p className="reveal-up">Got a project, a voice or an idea ready to take shape? Let's start with a conversation.</p>
        <a className="button-primary reveal-up" href="mailto:hello@mixbee.studio">Start a conversation <ArrowUpRight size={17}/></a><span className="contact-footnote">CONTACT DETAILS TO BE CONFIRMED</span>
      </section>
      <footer className="footer"><a className="brand" href="#home"><span className="brand-mark"><AudioLines size={20}/></span><span>MIXBEE<span className="brand-dot">.</span></span></a><span>MAKE SOUND MATTER.</span><span>© 2026 MIXBEE STUDIO</span></footer>
    </div>
  </main>;
}
