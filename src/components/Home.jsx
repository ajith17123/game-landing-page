import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, Sparkles, Monitor, Cpu, Terminal, Smartphone, Tablet } from 'lucide-react';
import '../assets/style/Home.css';

// Inline Twitch Icon Component
const Twitch = ({ size = 16 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9H9V6h2v5zm4 0h-2V6h2v5z"/>
  </svg>
);

// Image Assets Imports
import heroBgMountains from '../assets/images/hero_bg_mountains.jpg';
import heroPagodaMidground from '../assets/images/hero_pagoda_midground.png';
import heroForegroundBridge from '../assets/images/hero_foreground_bridge.png';
import strategistRoomEmpty from '../assets/images/strategist_room_empty.jpg';
import cardBackStandalone from '../assets/images/card_back_standalone.png';
import cardFrontSamurai from '../assets/images/card_front_samurai.jpg';
import cardFrontShinobi from '../assets/images/card_front_shinobi.jpg';
import cardFrontOni from '../assets/images/card_front_oni.png';
import yokaiMaskOn from '../assets/images/yokai_mask_on.jpg';
import yokaiMaskOff from '../assets/images/yokai_mask_off.jpg';
import yokaiRockFrame from '../assets/images/yokai_rock_frame.png';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroContainerRef = useRef(null);
  const heroBgRef = useRef(null);
  const heroMidRef = useRef(null);
  const heroForeRef = useRef(null);
  const heroSakuraCanvasRef = useRef(null);

  const pinMasterRef = useRef(null);
  const strategistPanelRef = useRef(null);
  const carouselPanelRef = useRef(null);

  const strategistTableAreaRef = useRef(null);
  const carouselDeckWrapperRef = useRef(null);
  const carouselControlsRef = useRef(null);

  // Transition Cards Refs
  const tCard1Ref = useRef(null);
  const tCard2Ref = useRef(null);
  const tCard3Ref = useRef(null);

  // Interactive Carousel State
  const [activeIndex, setActiveIndex] = useState(1); // 1 = Center active
  const [flippedCards, setFlippedCards] = useState([false, false, false]); // Card 0, 1, 2
  const [transitionCompleted, setTransitionCompleted] = useState(false);

  // Yokai Showcase Refs
  const yokaiFrameRef = useRef(null);
  const yokaiCardContainerRef = useRef(null);
  const yokaiEmbersCanvasRef = useRef(null);

  // Waitlist email states
  const [email, setEmail] = useState('');
  const [yokaiEmail, setYokaiEmail] = useState('');

  // Handle Waitlist submission
  const triggerConfetti = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#a78bfa', '#f59e0b', '#f4f3ec'],
    });
    alert("Thank you for joining the Waitlist! Welcome to SWORDS.");
    setEmail('');
    setYokaiEmail('');
  };

  // --- 1. Sakura Petals Canvas Animation ---
  useEffect(() => {
    const canvas = heroSakuraCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let frameId;
    let petals = [];
    const maxPetals = 45; // Premium visual density

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    class SakuraPetal {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; // Distribute vertically initially
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20 - Math.random() * 20;
        this.rX = Math.random() * 4 + 4; // Width radius
        this.rY = Math.random() * 6 + 6; // Height radius
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
        this.speedY = Math.random() * 1.2 + 0.8; // Fall speed
        this.speedX = Math.random() * 0.8 - 1.2; // Drift to the left (wind effect)
        this.sway = Math.random() * 100;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        // Soft pink and light white-pink sakura color palette
        const opacity = Math.random() * 0.5 + 0.35;
        this.color = Math.random() > 0.4 
          ? `rgba(255, 183, 197, ${opacity})` 
          : `rgba(255, 218, 224, ${opacity})`;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.sway) * 0.3;
        this.rotation += this.rotationSpeed;
        this.sway += this.swaySpeed;

        if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.beginPath();
        // Curated curved leaf shape for the cherry blossom petal
        ctx.moveTo(0, -this.rY);
        ctx.quadraticCurveTo(this.rX, -this.rY, this.rX / 2, 0);
        ctx.quadraticCurveTo(this.rX / 4, this.rY, 0, this.rY);
        ctx.quadraticCurveTo(-this.rX / 4, this.rY, -this.rX / 2, 0);
        ctx.quadraticCurveTo(-this.rX, -this.rY, 0, -this.rY);
        ctx.closePath();
        
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < maxPetals; i++) {
      petals.push(new SakuraPetal());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((petal) => {
        petal.update();
        petal.draw();
      });
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // --- 2. Parallax Hero Scroll Animation ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroContainerRef.current) {
        gsap.to(heroMidRef.current, {
          yPercent: 15, // Midground moves down moderately
          ease: 'none',
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });

        gsap.to(heroForeRef.current, {
          yPercent: -10, // Foreground bridge scrolls up slightly faster than normal
          ease: 'none',
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }

      // Global background parallax across the entire page scroll
      if (heroBgRef.current) {
        gsap.to(heroBgRef.current, {
          yPercent: -15, // Smooth slow scrolling
          ease: 'none',
          scrollTrigger: {
            trigger: '.home-wrapper',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true
          }
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // --- 3. Scroll Pinned Strategist to Carousel Transition ---
  useEffect(() => {
    if (!pinMasterRef.current) return;

    const ctx = gsap.context(() => {
      // Timeline for the scroll-driven cards elevation & morph
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinMasterRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1.5,
          onUpdate: (self) => {
            // Switch to interactive carousel mode when transition finishes (progress > 0.95)
            if (self.progress > 0.95) {
              setTransitionCompleted(true);
            } else {
              setTransitionCompleted(false);
            }
          }
        }
      });

      // Sequence the panels to prevent overlapping text:
      // 1. Fade out strategist panel completely first (from 0 to 0.4 progress)
      tl.to(strategistPanelRef.current, {
        autoAlpha: 0,
        scale: 0.95,
        duration: 0.4,
        ease: 'power1.inOut'
      }, 0);

      // 2. Fade in carousel panel afterward (from 0.8 to 1.2 progress)
      tl.to(carouselPanelRef.current, {
        opacity: 1,
        autoAlpha: 1,
        duration: 0.4,
        ease: 'power1.inOut'
      }, 0.8);

      // Cards animations: Lift from flat table state to vertical front-facing slots
      // Card 1 -> Slot Left
      tl.to(tCard1Ref.current, {
        left: 'calc(50% - 140px - 320px)', // Centered offset left
        bottom: 'calc(50% - 190px)',
        x: 0,
        y: 0,
        scale: 0.85,
        transform: 'rotateX(0deg) rotateY(25deg) rotateZ(0deg)',
        duration: 1.2,
        ease: 'power2.inOut'
      }, 0);

      // Card 2 -> Slot Center (Active)
      tl.to(tCard2Ref.current, {
        left: 'calc(50% - 140px)', // Perfectly Centered
        bottom: 'calc(50% - 190px)',
        x: 0,
        y: 0,
        scale: 1.05,
        transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
        duration: 1.2,
        ease: 'power2.inOut'
      }, 0);

      // Card 3 -> Slot Right
      tl.to(tCard3Ref.current, {
        left: 'calc(50% - 140px + 320px)', // Centered offset right
        bottom: 'calc(50% - 190px)',
        x: 0,
        y: 0,
        scale: 0.85,
        transform: 'rotateX(0deg) rotateY(-25deg) rotateZ(0deg)',
        duration: 1.2,
        ease: 'power2.inOut'
      }, 0);

      // Smooth cross-fade between transition cards and interactive carousel:
      // Fade out transition cards (from 1.0 to 1.2 progress)
      tl.to(strategistTableAreaRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'none'
      }, 1.0);

      // Fade in interactive deck & controls (from 1.0 to 1.2 progress)
      tl.to([carouselDeckWrapperRef.current, carouselControlsRef.current], {
        opacity: 1,
        duration: 0.2,
        ease: 'none'
      }, 1.0);
    });

    return () => ctx.revert();
  }, []);

  // --- 4. Yokai Section Spirit Embers Canvas ---
  useEffect(() => {
    const canvas = yokaiEmbersCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let frameId;
    let embers = [];
    const maxEmbers = 30;

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();

    class Ember {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20;
        this.size = Math.random() * 4 + 2;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.sway = Math.random() * 100;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.maxLife = Math.random() * 150 + 100;
        this.life = this.maxLife;
        this.color = Math.random() > 0.4 ? 'rgba(239, 68, 68,' : 'rgba(236, 72, 153,'; // red or pink embers
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.sway) * 0.2;
        this.sway += this.swaySpeed;
        this.life--;

        if (this.y < -10 || this.life <= 0) {
          this.reset();
        }
      }

      draw() {
        const opacity = this.life / this.maxLife;
        
        // Draw outer soft glow circle (no expensive shadowBlur calculations)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color} ${opacity * 0.25})`;
        ctx.fill();
        
        // Draw inner bright core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color} ${opacity * 0.8})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < maxEmbers; i++) {
      embers.push(new Ember());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      embers.forEach((ember) => {
        ember.update();
        ember.draw();
      });
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(frameId);
  }, []);

  // --- 5. Yokai Frame 3D Mouse Parallax Effect ---
  const handleMouseMove = (e) => {
    const frame = yokaiFrameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element
    
    // Normalize coordinates from -0.5 to 0.5
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    // Apply 3D rotation based on mouse offset
    gsap.to(frame, {
      rotateY: normX * 20, // Rotate max 20 degrees on Y-axis
      rotateX: -normY * 20, // Rotate max 20 degrees on X-axis
      ease: 'power2Out',
      duration: 0.3
    });
  };

  const handleMouseLeave = () => {
    const frame = yokaiFrameRef.current;
    if (!frame) return;

    // Reset rotation smoothly
    gsap.to(frame, {
      rotateY: 0,
      rotateX: 0,
      ease: 'power2Out',
      duration: 0.6
    });
  };

  // --- 6. Carousel Deck Mechanics ---
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const toggleFlip = (index) => {
    setFlippedCards((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  // Get Card layout position names based on active carousel index
  const getSlotClass = (cardIdx) => {
    if (activeIndex === 1) {
      if (cardIdx === 0) return 'slot-left';
      if (cardIdx === 1) return 'slot-center';
      if (cardIdx === 2) return 'slot-right';
    } else if (activeIndex === 2) {
      if (cardIdx === 0) return 'slot-right';
      if (cardIdx === 1) return 'slot-left';
      if (cardIdx === 2) return 'slot-center';
    } else if (activeIndex === 0) {
      if (cardIdx === 0) return 'slot-center';
      if (cardIdx === 1) return 'slot-right';
      if (cardIdx === 2) return 'slot-left';
    }
    return '';
  };

  return (
    <div className="home-wrapper">
      {/* Global Parallax Background */}
      <div 
        className="global-parallax-bg"
        style={{ backgroundImage: `url(${heroBgMountains}?v=4)` }}
        ref={heroBgRef}
      />

      {/* Navigation Bar */}
      <nav className="navbar">
        <a href="#" className="navbar-logo">SWORDS</a>
        <ul className="navbar-links">
          <li className="navbar-link"><a href="#game">Game</a></li>
          <li className="navbar-link"><a href="#cards">Cards</a></li>
          <li className="navbar-link"><a href="#community">Community</a></li>
          <li className="navbar-link"><a href="#esports">Esports</a></li>
        </ul>
        <div className="navbar-cta">
          <a href="https://twitch.tv" target="_blank" rel="noopener noreferrer" className="twitch-btn">
            <Twitch size={16} /> LIVE TWITCH
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-container" ref={heroContainerRef}>
        <canvas className="hero-sakura-canvas" ref={heroSakuraCanvasRef} />
        <div className="hero-parallax-wrapper">
          <div 
            className="hero-layer hero-layer-mid"
            style={{ backgroundImage: `url(${heroPagodaMidground}?v=4)` }}
            ref={heroMidRef}
          />
          <div 
            className="hero-layer hero-layer-fore"
            style={{ backgroundImage: `url(${heroForegroundBridge}?v=4)` }}
            ref={heroForeRef}
          />

        </div>

        <div className="hero-content-wrapper">
          <div className="hero-content" data-aos="fade-up">
            <h1 className="hero-title">SWORDS</h1>
            <p className="hero-subtitle">A Blockchain Card Game</p>
            <a href="#waitlist" className="glowing-btn glowing-btn-primary">
              JOIN THE WAITLIST
            </a>
          </div>
        </div>
      </section>

      {/* Pinned Scroll-Driven Transition Section */}
      <section className="pin-master-wrapper" ref={pinMasterRef} id="game">
        <div className="pinned-section-container">
          
          {/* Section 2 Panel: The Strategist Room */}
          <div 
            className="strategist-panel" 
            ref={strategistPanelRef}
            style={{ 
              backgroundImage: `url(${strategistRoomEmpty})`,
              pointerEvents: transitionCompleted ? 'none' : 'auto'
            }}
          >
            <div className="strategist-content">
              <span className="glowing-badge">POWERED BY ETHEREUM</span>
              <h2 className="strategist-title">A STRATEGIC CARD GAME</h2>
              <p className="strategist-desc">
                Engage in highly competitive strategy within a tactical deck builder inspired by the history and folklore of feudal Japan. Summon Yokai, command Samurai legions, and wage tactical warfare online.
              </p>
              <div className="platform-badges">
                <span className="platform-badge"><Monitor size={12} style={{verticalAlign:'middle', marginRight:'6px'}}/> macOS</span>
                <span className="platform-badge"><Cpu size={12} style={{verticalAlign:'middle', marginRight:'6px'}}/> Windows</span>
                <span className="platform-badge"><Terminal size={12} style={{verticalAlign:'middle', marginRight:'6px'}}/> Linux</span>
                <span className="platform-badge"><Smartphone size={12} style={{verticalAlign:'middle', marginRight:'6px'}}/> iPhone</span>
                <span className="platform-badge"><Cpu size={12} style={{verticalAlign:'middle', marginRight:'6px'}}/> Android</span>
                <span className="platform-badge"><Tablet size={12} style={{verticalAlign:'middle', marginRight:'6px'}}/> iPad Pro</span>
              </div>
            </div>
          </div>

          {/* Section 3 Panel: 3D Interactive Carousel */}
          <div className="carousel-panel" ref={carouselPanelRef} id="cards">
            <div className="carousel-title-area">
              <span className="glowing-badge">COLLECT & BATTLE</span>
              <h2 className="carousel-header">3D INTERACTIVE DECK</h2>
            </div>

            <div 
              className="carousel-deck-wrapper"
              ref={carouselDeckWrapperRef}
              style={{
                pointerEvents: transitionCompleted ? 'auto' : 'none'
              }}
            >
              {/* Actual Interactive Cards (visible when transition is completed) */}
              {/* Card 0: Samurai */}
              <div className={`carousel-slot ${getSlotClass(0)}`}>
                {getSlotClass(0) === 'slot-center' && (
                  <div className="carousel-active-badge">01 / 03</div>
                )}
                <div 
                  className={`card-3d-container ${flippedCards[0] ? 'is-flipped' : ''}`}
                  onClick={() => toggleFlip(0)}
                >
                  <div className="card-3d-inner">
                    <div className="card-face card-face-back">
                      <img src={cardBackStandalone} alt="Card Back" />
                    </div>
                    <div className="card-face card-face-front">
                      <img src={cardFrontSamurai} alt="Samurai Card Front" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 1: Shinobi */}
              <div className={`carousel-slot ${getSlotClass(1)}`}>
                {getSlotClass(1) === 'slot-center' && (
                  <div className="carousel-active-badge">02 / 03</div>
                )}
                <div 
                  className={`card-3d-container ${flippedCards[1] ? 'is-flipped' : ''}`}
                  onClick={() => toggleFlip(1)}
                >
                  <div className="card-3d-inner">
                    <div className="card-face card-face-back">
                      <img src={cardBackStandalone} alt="Card Back" />
                    </div>
                    <div className="card-face card-face-front">
                      <img src={cardFrontShinobi} alt="Shinobi Card Front" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Oni Warlord */}
              <div className={`carousel-slot ${getSlotClass(2)}`}>
                {getSlotClass(2) === 'slot-center' && (
                  <div className="carousel-active-badge">03 / 03</div>
                )}
                <div 
                  className={`card-3d-container ${flippedCards[2] ? 'is-flipped' : ''}`}
                  onClick={() => toggleFlip(2)}
                >
                  <div className="card-3d-inner">
                    <div className="card-face card-face-back">
                      <img src={cardBackStandalone} alt="Card Back" />
                    </div>
                    <div className="card-face card-face-front">
                      <img src={cardFrontOni} alt="Oni Card Front" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Navigation UI (visible when transition is completed) */}
            <div 
              className="carousel-controls"
              ref={carouselControlsRef}
              style={{
                pointerEvents: transitionCompleted ? 'auto' : 'none'
              }}
            >
              <button className="carousel-control-btn" onClick={handlePrev}>
                <span className="control-btn-icon"><ArrowLeft size={14} /></span>
                <span className="control-btn-text">PREVIOUS</span>
              </button>
              <div className="carousel-indicators">
                <div className={`carousel-indicator-dash ${activeIndex === 0 ? 'is-active' : ''}`} onClick={() => setActiveIndex(0)} />
                <div className={`carousel-indicator-dash ${activeIndex === 1 ? 'is-active' : ''}`} onClick={() => setActiveIndex(1)} />
                <div className={`carousel-indicator-dash ${activeIndex === 2 ? 'is-active' : ''}`} onClick={() => setActiveIndex(2)} />
              </div>
              <button className="carousel-control-btn" onClick={handleNext}>
                <span className="control-btn-text">NEXT</span>
                <span className="control-btn-icon"><ArrowRight size={14} /></span>
              </button>
            </div>
          </div>

          {/* Transition Cards Layer (Always in DOM) */}
          <div 
            className="strategist-table-area"
            ref={strategistTableAreaRef}
            style={{
              pointerEvents: transitionCompleted ? 'none' : 'auto'
            }}
          >
            <div className="transition-card t-card-1" ref={tCard1Ref}>
              <img src={cardBackStandalone} alt="Card Back 1" />
            </div>
            <div className="transition-card t-card-2" ref={tCard2Ref}>
              <img src={cardBackStandalone} alt="Card Back 2" />
            </div>
            <div className="transition-card t-card-3" ref={tCard3Ref}>
              <img src={cardBackStandalone} alt="Card Back 3" />
            </div>
          </div>

        </div>
      </section>

      {/* Yokai Creature Showcase (Hover Mask Reveal) */}
      <section className="yokai-section" id="community">
        <div className="yokai-content" data-aos="fade-right">
          <span className="glowing-badge">OWN YOUR CARDS</span>
          <h2 className="strategist-title">SUMMON YOKAI CREATURES</h2>
          <p className="strategist-desc" style={{marginBottom: '40px'}}>
            Unlock over 200+ unique, handcrafted ERC-721 token cards representing ancient Japanese spirits and Yokai creatures. Play to own your deck, trade with other collectors, and command ancient spirits on the battlefield.
          </p>
          
          <form className="waitlist-form" onSubmit={triggerConfetti} id="waitlist" style={{display: 'flex', gap: '12px', maxWidth: '450px'}}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1, 
                padding: '14px 20px', 
                borderRadius: '30px', 
                border: '1px solid var(--color-border-glow)',
                backgroundColor: 'rgba(19, 13, 36, 0.6)',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                outline: 'none'
              }}
            />
            <button type="submit" className="glowing-btn glowing-btn-primary">
              JOIN WAITLIST
            </button>
          </form>
        </div>

        {/* Featured 3D Yokai Card with Kitsune Maiden */}
        <div className="yokai-card-frame-wrapper" data-aos="fade-left">
          <div 
            className="yokai-frame-container"
            ref={yokaiFrameRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          >
            {/* Rock frame overlay */}
            <img src={yokaiRockFrame} className="yokai-rock-frame-img" alt="Stone Rock Frame" />
            
            {/* Double image mask container */}
            <div className="yokai-card-container">
              {/* Mask On (fox mask) */}
              <img src={yokaiMaskOn} className="yokai-card-img yokai-mask-on-img" alt="Spirit Maiden Mask On" />
              {/* Mask Off (human face) */}
              <img src={yokaiMaskOff} className="yokai-card-img yokai-mask-off-img" alt="Spirit Maiden Mask Off" />
            </div>

            {/* Glowing spirit embers */}
            <canvas className="spirit-embers-container" ref={yokaiEmbersCanvasRef} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="esports">
        <div className="footer-logo">SWORDS</div>
        <p className="footer-tagline">The ultimate feudal blockchain card game</p>
        
        <div className="footer-socials">
          <a href="#" className="footer-social-link"><Twitch size={20} /></a>
          <a href="#" className="footer-social-link"><Sparkles size={20} /></a>
        </div>
        
        <p className="footer-copyright">
          © 2026 SWORDS. All rights reserved. Powered by Ethereum Blockchain.
        </p>
      </footer>
    </div>
  );
}
