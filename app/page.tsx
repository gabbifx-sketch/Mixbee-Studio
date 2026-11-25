"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { ArrowDown, ArrowUpRight, AudioLines, Headphones, Menu, Mic2, Play, Radio, Sparkles, Waves, X } from "lucide-react";
import { useState } from "react";

function StudioMic() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.22;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.055;
    }
  });
  return (
    <Float speed={1.25} rotationIntensity={0.12} floatIntensity={0.45}>
      <group ref={group} position={[0, -0.12, 0]} scale={1.12}>
        <mesh position={[0, 0.68, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.9, 48, 1, true]} />
          <meshStandardMaterial color="#252b35" metalness={0.88} roughness={0.25} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 1.13, 0]} castShadow>
          <sphereGeometry args={[0.385, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color="#aeb7c3" metalness={0.82} roughness={0.22} />
        </mesh>
        {Array.from({length: 9}).map((_, i) => (
          <mesh key={i} position={[0, 0.72, 0]} rotation={[0, 0, (i - 4) * 0.13]}>
            <torusGeometry args={[0.397, 0.009, 8, 48]} />
            <meshStandardMaterial color="#d5a66b" metalness={0.75} roughness={0.28} />
          </mesh>
        ))}
        <mesh position={[0, -0.02, 0]} castShadow>
          <cylinderGeometry args={[0.19, 0.25, 0.34, 32]} />
          <meshStandardMaterial color="#111820" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.52, 20]} />
          <meshStandardMaterial color="#b98950" metalness={0.85} roughness={0.22} />
        </mesh>
        <mesh position={[0, -0.72, 0]}>
          <torusGeometry args={[0.28, 0.035, 12, 48]} />
          <meshStandardMaterial color="#b98950" metalness={0.85} roughness={0.22} />
        </mesh>
      </group>
    </Float>
  );
}

function HeroScene() {
  return <Canvas camera={{position:[0,0,5.4], fov:36}} dpr={[1,1.7]} gl={{alpha:true, antialias:true}}>
    <ambientLight intensity={1.15}/>
    <spotLight position={[4,5,5]} intensity={75} angle={0.42} penumbra={1} color="#f4c58e"/>
    <pointLight position={[-4,1,2]} intensity={22} color="#6a9ab0"/>
    <StudioMic/>
    <ContactShadows position={[0,-1.45,0]} opacity={0.42} scale={5} blur={2.8} far={3}/>
    <Environment preset="studio"/>
  </Canvas>;
}

const services = [
  {number:"01", icon:Mic2, title:"Recording", copy:"Capture the voice, performance and feeling behind every idea."},
  {number:"02", icon:Waves, title:"Mixing", copy:"Bring every element together with clarity, space and impact."},
  {number:"03", icon:Headphones, title:"Mastering", copy:"The final polish that helps your sound translate everywhere."},
  {number:"04", icon:Radio, title:"Production", copy:"Shape raw ideas into a sound with its own identity."},
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main>
      <div className="grain"/>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Mixbee home"><span className="brand-mark"><AudioLines size={22}/></span><span>MIXBEE<span className="brand-dot">.</span></span></a>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#studio" onClick={()=>setMenuOpen(false)}>The studio</a>
          <a href="#services" onClick={()=>setMenuOpen(false)}>What we do</a>
          <a href="#gallery" onClick={()=>setMenuOpen(false)}>Inside Mixbee</a>
          <a href="#contact" onClick={()=>setMenuOpen(false)}>Contact</a>
        </nav>
        <a className="header-cta" href="#contact">Let’s create <ArrowUpRight size={16}/></a>
        <button className="menu-toggle" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen?<X/>:<Menu/>}</button>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> SOUND IS YOURS. MAKE IT MATTER.</div>
          <h1>MAKE<br/>SOME <span>NOISE.</span></h1>
          <p className="hero-description">Ideas start somewhere. Give yours a voice, a feeling, and a sound that stays with people.</p>
          <div className="hero-actions"><a className="button-primary" href="#contact">Start a session <ArrowUpRight size={17}/></a><a className="text-link" href="#studio"><span className="play-icon"><Play size={12} fill="currentColor"/></span> Explore the studio</a></div>
          <div className="hero-foot"><span>RECORD · CREATE · REPEAT</span><span>GHANA <span className="tiny-dot">●</span></span></div>
        </div>
        <div className="hero-visual">
          <div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/>
          <div className="visual-glow"/>
          <div className="visual-label label-top"><span>01 / THE SOUND</span><span>PURE SIGNAL</span></div>
          <div className="mic-stage"><HeroScene/></div>
          <div className="visual-label label-bottom"><span>FIG. 001</span><span>CAPTURE THE MOMENT <ArrowUpRight size={13}/></span></div>
          <div className="vertical-note">ENGINEERED FOR EXPRESSION — MMXXVI</div>
        </div>
        <a className="scroll-cue" href="#studio"><span>SCROLL TO EXPLORE</span><ArrowDown size={15}/></a>
      </section>

      <section className="intro-section" id="studio">
        <div className="section-kicker"><span>01</span> / THE SPACE</div>
        <div className="intro-content">
          <p className="overline">A PLACE FOR SOUND TO BECOME SOMETHING.</p>
          <h2>More than a room.<br/><span>A space to create.</span></h2>
          <div className="intro-bottom"><p>Every great track begins with an idea. Mixbee is a space built around the process of bringing that idea to life — one take, one layer, one moment at a time.</p><a className="circle-link" href="#gallery" aria-label="Explore the studio"><ArrowUpRight/></a></div>
        </div>
        <div className="intro-decoration"><AudioLines/><span>LET THE SOUND SPEAK</span></div>
      </section>

      <section className="services-section" id="services">
        <div className="section-heading"><div><div className="section-kicker"><span>02</span> / WHAT WE DO</div><h2>Built around<br/><span>your sound.</span></h2></div><p>From the first recording to the final master, every detail has a part to play.</p></div>
        <div className="service-grid">{services.map(({number,icon:Icon,title,copy})=><article className="service-card" key={number}><div className="service-top"><span>{number}</span><Icon size={23} strokeWidth={1.4}/></div><h3>{title}</h3><p>{copy}</p><a href="#contact" aria-label={`Ask about ${title}`}><ArrowUpRight size={18}/></a></article>)}</div>
      </section>

      <section className="gallery-section" id="gallery">
        <div className="gallery-top"><div><div className="section-kicker"><span>03</span> / INSIDE MIXBEE</div><h2>Feel the<br/><span>frequency.</span></h2></div><p>A closer look at the space, the process and the details behind the sound.</p></div>
        <div className="gallery-grid">
          <div className="gallery-card gallery-main"><div className="gallery-image image-console"><div className="console-lines"/><div className="image-caption">THE CONTROL ROOM <span>01</span></div></div></div>
          <div className="gallery-card gallery-small"><div className="gallery-image image-mic"><div className="mic-silhouette"/><div className="image-caption">IN THE BOOTH <span>02</span></div></div></div>
          <div className="gallery-note"><Sparkles size={18}/><p>THE BEST TAKES HAPPEN WHEN YOU FEEL AT HOME.</p><span>MORE OF MIXBEE — COMING INTO FOCUS.</span></div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-orb"><AudioLines size={42}/></div>
        <div className="section-kicker"><span>04</span> / YOUR NEXT MOVE</div>
        <h2>LET’S MAKE<br/><span>IT SOUND.</span></h2>
        <p>Got an idea, a project or a sound you want to bring to life? Start the conversation.</p>
        <a className="button-primary" href="mailto:hello@mixbee.studio">Get in touch <ArrowUpRight size={17}/></a>
        <span className="contact-footnote">CONTACT DETAILS CAN BE ADDED HERE</span>
      </section>

      <footer className="footer"><a className="brand" href="#home"><span className="brand-mark"><AudioLines size={20}/></span><span>MIXBEE<span className="brand-dot">.</span></span></a><span>MAKE SOUND MATTER.</span><span>© 2026 MIXBEE STUDIO</span></footer>
    </main>
  );
}
