'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { AppSection } from './WeddingNavbar';

// ── Palette ────────────────────────────────────────────────────────────────────

const GOLD        = '#D8B46A';
const GOLD_BRIGHT = '#E3C174';
const GOLD_MUTED  = '#B8924E';
const IVORY       = '#F4EBD8';
const IVORY_SOFT  = 'rgba(244,235,216,0.80)';
const IVORY_DIM   = 'rgba(244,235,216,0.62)';

// ── Content ────────────────────────────────────────────────────────────────────

const INTRO = 'Todo lo que necesitas saber para acompañarnos en este día tan especial.';

const FINAL_QUOTE =
  'Hemos preparado cada detalle con amor para compartir este día tan especial con ustedes.';

const DETAILS_DATA = [
  { id: 'fecha',    icon: 'calendar',  label: 'Fecha',        value: '20 de noviembre de 2026'          },
  { id: 'ubic',     icon: 'location',  label: 'Ubicación',    value: 'Chiclayo, Perú'                   },
  { id: 'cerem',    icon: 'clock',     label: 'Ceremonia',    value: '4:30 p. m. · Capilla principal'   },
  { id: 'dress',    icon: 'attire',    label: 'Dress Code',   value: 'Formal elegante'                  },
  { id: 'recep',    icon: 'reception', label: 'Recepción',    value: '7:00 p. m. · Jardines del evento' },
  { id: 'confirm',  icon: 'envelope',  label: 'Confirmación', value: 'RSVP antes del 20 de octubre'     },
  { id: 'regalos',  icon: 'gift',      label: 'Regalos',      value: 'Su presencia es nuestro mejor regalo' },
] as const;

// ── Animation variants ─────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

const screenVariants = {
  initial: { opacity: 0, y: 24, scale: 0.992, filter: 'blur(4px)' },
  animate: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE },
  },
  exit: {
    opacity: 0, y: -18, scale: 0.992, filter: 'blur(4px)',
    transition: { duration: 0.65, ease: EASE },
  },
};

const staggerLeft  = { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.28 } } };
const staggerRight = { hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.50 } } };

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE } },
};

const photoFade = {
  hidden:  { opacity: 0, scale: 0.978 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.95, ease: EASE } },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function DetailIcon({ type }: { type: string }) {
  const p = {
    width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none',
    stroke: GOLD, strokeWidth: 1.5,
    strokeLinecap:  'round'  as const,
    strokeLinejoin: 'round'  as const,
    'aria-hidden':  true,
    style: { flexShrink: 0 } as CSSProperties,
  };
  switch (type) {
    case 'calendar':
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8"  y1="2" x2="8"  y2="6"/>
          <line x1="3"  y1="10" x2="21" y2="10"/>
        </svg>
      );
    case 'location':
      return (
        <svg {...p}>
          <path d="M12 2C8.69 2 6 4.69 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.31-2.69-6-6-6z"/>
          <circle cx="12" cy="8" r="2.2"/>
        </svg>
      );
    case 'clock':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9"/>
          <polyline points="12 7 12 12 15.5 14.5"/>
        </svg>
      );
    case 'attire':
      return (
        <svg {...p}>
          <path d="M9 3L6 8l3 1v12h6V9l3-1-3-5"/>
          <path d="M9 3c0 1.66 1.34 3 3 3s3-1.34 3-3"/>
        </svg>
      );
    case 'reception':
      return (
        <svg {...p}>
          <line x1="8" y1="6" x2="8" y2="2"/>
          <line x1="16" y1="6" x2="16" y2="2"/>
          <path d="M5 6h14l-1 14H6z"/>
          <line x1="5" y1="10" x2="19" y2="10"/>
        </svg>
      );
    case 'envelope':
      return (
        <svg {...p}>
          <rect x="2" y="5" width="20" height="15" rx="2"/>
          <polyline points="2 5 12 13 22 5"/>
        </svg>
      );
    case 'gift':
      return (
        <svg {...p}>
          <polyline points="20 12 20 22 4 22 4 12"/>
          <rect x="2" y="7" width="20" height="5"/>
          <line x1="12" y1="22" x2="12" y2="7"/>
          <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
          <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
        </svg>
      );
    default: return null;
  }
}

function FrameCorner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const r = pos.endsWith('r');
  const b = pos.startsWith('b');
  return (
    <span aria-hidden="true" style={{
      position: 'absolute',
      width: '14px', height: '14px',
      ...(r ? { right: '5px' } : { left: '5px' }),
      ...(b ? { bottom: '5px' } : { top: '5px' }),
      borderTop:    b ? 'none' : '1px solid rgba(216,180,106,0.68)',
      borderBottom: b ? '1px solid rgba(216,180,106,0.68)' : 'none',
      borderLeft:   r ? 'none' : '1px solid rgba(216,180,106,0.68)',
      borderRight:  r ? '1px solid rgba(216,180,106,0.68)' : 'none',
      pointerEvents: 'none',
      zIndex: 2,
    }} />
  );
}

function FloralSprig({ flip = false, sz = 58 }: { flip?: boolean; sz?: number }) {
  return (
    <svg
      width={sz} height={Math.round(sz * 0.84)}
      viewBox="0 0 72 60" fill="none" aria-hidden="true"
      style={{ transform: flip ? 'scale(-1,-1)' : 'none' }}
    >
      <path d="M6 54C16 40 28 28 42 20C56 12 66 7 70 4"
            stroke={GOLD_MUTED} strokeWidth="0.85" strokeLinecap="round" opacity="0.52"/>
      <path d="M18 40C10 32 4 22 2 12"
            stroke={GOLD_MUTED} strokeWidth="0.70" strokeLinecap="round" opacity="0.40"/>
      <path d="M42 20C48 14 56 8 60 4"
            stroke={GOLD_MUTED} strokeWidth="0.65" strokeLinecap="round" opacity="0.36"/>
      <ellipse cx="2"  cy="10" rx="4"   ry="7.5" fill="none"
               stroke={GOLD_MUTED} strokeWidth="0.55" opacity="0.32" transform="rotate(-38 2 10)"/>
      <ellipse cx="60" cy="4"  rx="3.5" ry="6"   fill="none"
               stroke={GOLD_MUTED} strokeWidth="0.52" opacity="0.28" transform="rotate(-55 60 4)"/>
      <circle cx="70" cy="4"  r="1.2" fill={GOLD_MUTED} opacity="0.26"/>
      <circle cx="18" cy="40" r="1.0" fill={GOLD_MUTED} opacity="0.22"/>
    </svg>
  );
}

function PhotoFrame({ src, alt, objectPosition = 'center', style, sprig }: {
  src: string;
  alt: string;
  objectPosition?: string;
  style?: CSSProperties;
  sprig?: 'tl' | 'br';
}) {
  return (
    <motion.div
      variants={photoFade}
      style={{
        position:   'relative',
        overflow:   'hidden',
        border:     '1px solid rgba(216,180,106,0.46)',
        boxShadow:  '0 14px 44px rgba(0,0,0,0.48)',
        flexShrink: 0,
        ...style,
      }}
    >
      <FrameCorner pos="tl"/><FrameCorner pos="tr"/>
      <FrameCorner pos="bl"/><FrameCorner pos="br"/>
      <img
        src={src} alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, display: 'block' }}
      />
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, transparent 22%, transparent 74%, rgba(0,0,0,0.20) 100%)',
      }}/>
      {sprig === 'tl' && (
        <div aria-hidden="true" style={{ position:'absolute', top:'-3px', left:'-3px', zIndex:3, opacity:0.66 }}>
          <FloralSprig sz={54}/>
        </div>
      )}
      {sprig === 'br' && (
        <div aria-hidden="true" style={{ position:'absolute', bottom:'-3px', right:'-3px', zIndex:3, opacity:0.56 }}>
          <FloralSprig flip sz={54}/>
        </div>
      )}
    </motion.div>
  );
}

function MapBlock() {
  return (
    <motion.div
      variants={fadeUp}
      style={{
        position:   'relative',
        flex:       '0 0 128px',
        border:     '1px solid rgba(216,180,106,0.36)',
        background: 'rgba(5,10,7,0.55)',
        overflow:   'hidden',
      }}
    >
      <FrameCorner pos="tl"/><FrameCorner pos="tr"/>
      <FrameCorner pos="bl"/><FrameCorner pos="br"/>

      {/* Decorative map SVG */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <svg
          viewBox="0 0 320 128" fill="none" preserveAspectRatio="xMidYMid slice"
          style={{ width: '100%', height: '100%' }}
        >
          {[16, 32, 48, 64, 80, 96, 112].map(y =>
            <line key={`h${y}`} x1="0" y1={y} x2="320" y2={y} stroke={GOLD} strokeWidth="0.4" opacity="0.12"/>
          )}
          {[32, 64, 96, 128, 160, 192, 224, 256, 288].map(x =>
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="128" stroke={GOLD} strokeWidth="0.4" opacity="0.12"/>
          )}
          <path d="M0 64Q80 58 160 64Q240 70 320 64"   stroke={GOLD} strokeWidth="1.1" opacity="0.26"/>
          <path d="M160 0Q156 64 160 128"               stroke={GOLD} strokeWidth="1.0" opacity="0.26"/>
          <path d="M0 32Q80 36 160 33Q240 30 320 35"   stroke={GOLD} strokeWidth="0.55" opacity="0.16"/>
          <path d="M0 96Q80 92 160 96Q240 100 320 96"  stroke={GOLD} strokeWidth="0.55" opacity="0.16"/>
          <path d="M60 0Q68 40 76 64Q84 88 92 128"     stroke={GOLD} strokeWidth="0.45" opacity="0.12"/>
          <path d="M244 0Q236 40 228 64Q220 88 212 128" stroke={GOLD} strokeWidth="0.45" opacity="0.12"/>
          <circle cx="160" cy="64" r="10" stroke={GOLD_BRIGHT} strokeWidth="0.9" opacity="0.50"/>
          <circle cx="160" cy="64" r="3"  fill={GOLD_BRIGHT} opacity="0.60"/>
          <line x1="160" y1="54" x2="160" y2="38"     stroke={GOLD_BRIGHT} strokeWidth="0.85" opacity="0.50"/>
          <circle cx="160" cy="36" r="4.5" fill="none" stroke={GOLD_BRIGHT} strokeWidth="0.85" opacity="0.50"/>
          <circle cx="160" cy="36" r="2"  fill={GOLD_BRIGHT} opacity="0.50"/>
        </svg>
      </div>

      {/* Text content */}
      <div style={{
        position:       'relative',
        zIndex:         2,
        display:        'flex',
        flexDirection:  'column',
        padding:        '12px 18px',
        height:         '100%',
        justifyContent: 'center',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke={GOLD_BRIGHT} strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M12 2C8.69 2 6 4.69 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.31-2.69-6-6-6z"/>
            <circle cx="12" cy="8" r="2"/>
          </svg>
          <span style={{
            fontFamily: 'var(--font-cinzel)', fontSize: '8px',
            fontWeight: 500, letterSpacing: '0.22em', color: GOLD_BRIGHT,
          }}>
            NUESTRO LUGAR
          </span>
        </div>
        <p style={{ fontFamily:'var(--font-cormorant)', fontSize:'clamp(13px,1.0vw,15px)',
          color:IVORY, margin:0, lineHeight:1.4 }}>
          Chiclayo, Perú
        </p>
        <p style={{ fontFamily:'var(--font-cormorant)', fontSize:'clamp(11px,0.86vw,13px)',
          color:IVORY_SOFT, margin:'2px 0 0', lineHeight:1.4 }}>
          Jardines del evento
        </p>
        <p style={{ fontFamily:'var(--font-cormorant)', fontStyle:'italic',
          fontSize:'clamp(10px,0.74vw,11.5px)', color:'rgba(244,235,216,0.46)',
          margin:'3px 0 0', lineHeight:1.4 }}>
          Los esperamos para celebrar juntos este día inolvidable.
        </p>
      </div>
    </motion.div>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
  setActiveSection: (s: AppSection) => void;
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function DetailsSection({ setActiveSection: _setActiveSection }: Props) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1100px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <motion.section
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      id="detalles"
      style={{
        position:           'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        width:              '100%',
        height:             '100dvh',
        overflow:           'hidden',
        backgroundImage:    "url('/assets/fondo-nuestra-historia-premium.png')",
        backgroundSize:     'cover',
        backgroundPosition: 'center',
        backgroundRepeat:   'no-repeat',
      }}
      aria-label="Detalles de la boda de Josué y Claudia"
    >
      {/* Gradient overlay — heavier on text side */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(135deg, rgba(3,8,6,0.74) 0%, rgba(3,8,6,0.56) 48%, rgba(3,8,6,0.38) 100%)',
      }}/>

      {/* Edge vignette */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.22) 68%, rgba(0,0,0,0.52) 100%)',
      }}/>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div style={{
        position:       'relative',
        zIndex:         10,
        display:        'flex',
        flexDirection:  isDesktop ? 'row' : 'column',
        justifyContent: isDesktop ? 'flex-start' : 'center',
        width:          '100%',
        height:         '100dvh',
        paddingTop:     isDesktop ? '70px' : '80px',
        paddingBottom:  isDesktop ? '18px' : '80px',
        paddingLeft:    isDesktop ? '52px' : '28px',
        paddingRight:   isDesktop ? '28px' : '28px',
        overflow:       'hidden',
      }}>

        {/* ════════════════ LEFT — Text & Cards ════════════════ */}
        <motion.div
          variants={staggerLeft}
          initial="hidden"
          animate="visible"
          style={{
            width:          isDesktop ? '44%' : '100%',
            flexShrink:     0,
            display:        'flex',
            flexDirection:  'column',
            justifyContent: 'center',
            paddingRight:   isDesktop ? '38px' : '0',
            overflow:       'hidden',
          }}
        >
          {/* Title */}
          <motion.h2 variants={fadeUp} style={{
            fontFamily:    'var(--font-cormorant)',
            fontWeight:    400,
            fontSize:      'clamp(36px, 3.8vw, 58px)',
            letterSpacing: '-0.03em',
            lineHeight:    1.0,
            color:         IVORY,
            margin:        0,
            marginBottom:  '8px',
            textShadow:    '0 2px 18px rgba(0,0,0,0.55)',
          }}>
            Detalles
          </motion.h2>

          {/* Ornamental divider */}
          <motion.div variants={fadeUp} aria-hidden="true"
            style={{ display:'flex', alignItems:'center', maxWidth:'200px', marginBottom:'11px' }}>
            <div style={{ flex:1, height:'0.5px', background:'linear-gradient(to right,rgba(216,180,106,0.60),transparent)' }}/>
            <span style={{ color:GOLD_MUTED, fontSize:'11px', margin:'0 9px', lineHeight:1, fontFamily:'serif' }}>❦</span>
            <div style={{ flex:1, height:'0.5px', background:'linear-gradient(to left,rgba(216,180,106,0.60),transparent)' }}/>
          </motion.div>

          {/* Intro text */}
          <motion.p variants={fadeUp} style={{
            fontFamily:   'var(--font-cormorant)',
            fontSize:     'clamp(13px, 1.02vw, 15px)',
            lineHeight:   1.60,
            color:        IVORY_SOFT,
            margin:       0,
            marginBottom: '15px',
            textShadow:   '0 1px 8px rgba(0,0,0,0.35)',
          }}>
            {INTRO}
          </motion.p>

          {/* ── Info cards — 2-column grid ── */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            gap:                 '7px',
            marginBottom:        '14px',
          }}>
            {DETAILS_DATA.map((item, i) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                style={{
                  display:    'flex',
                  alignItems: 'flex-start',
                  gap:        '9px',
                  border:     '1px solid rgba(216,180,106,0.24)',
                  background: 'rgba(5,10,7,0.42)',
                  padding:    '9px 11px',
                  // 7th card spans full width
                  ...(i === DETAILS_DATA.length - 1 && DETAILS_DATA.length % 2 !== 0
                    ? { gridColumn: '1 / -1' }
                    : {}),
                }}
              >
                <div style={{ marginTop: '3px', flexShrink: 0 }}>
                  <DetailIcon type={item.icon}/>
                </div>
                <div style={{ display:'flex', flexDirection:'column', minWidth:0 }}>
                  <span style={{
                    fontFamily:    'var(--font-cinzel)',
                    fontSize:      '8px',
                    fontWeight:    500,
                    letterSpacing: '0.18em',
                    color:         GOLD_BRIGHT,
                    lineHeight:    1,
                    marginBottom:  '3px',
                  }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize:   'clamp(11.5px, 0.94vw, 13.5px)',
                    color:      IVORY_DIM,
                    lineHeight: 1.45,
                  }}>
                    {item.value}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Final quote */}
          <motion.div variants={fadeUp}>
            <div aria-hidden="true" style={{
              height:       '0.5px',
              maxWidth:     '230px',
              background:   'linear-gradient(to right, rgba(216,180,106,0.32), transparent)',
              marginBottom: '9px',
            }}/>
            <p style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle:  'italic',
              fontSize:   'clamp(11.5px, 0.95vw, 14px)',
              lineHeight: 1.58,
              color:      'rgba(216,180,106,0.78)',
              margin:     0,
              textShadow: '0 1px 8px rgba(0,0,0,0.38)',
            }}>
              {FINAL_QUOTE}
            </p>
          </motion.div>
        </motion.div>

        {/* ════════════════ RIGHT — Photos + Map ════════════════ */}
        {isDesktop && (
          <motion.div
            variants={staggerRight}
            initial="hidden"
            animate="visible"
            style={{
              flex:          1,
              display:       'flex',
              flexDirection: 'column',
              gap:           '10px',
              minWidth:      0,
              overflow:      'hidden',
            }}
          >
            {/* Photo composition */}
            <div style={{ flex:1, display:'flex', gap:'10px', minHeight:0, overflow:'hidden' }}>

              {/* Left stack: 2 photos */}
              <div style={{
                flex:          '0 0 42%',
                display:       'flex',
                flexDirection: 'column',
                gap:           '10px',
                overflow:      'hidden',
              }}>
                <PhotoFrame
                  src="/assets/fondo-novios-2.jpg"
                  alt="Josué y Claudia — momento especial"
                  objectPosition="center 22%"
                  sprig="tl"
                  style={{ flex: '0 0 49%' }}
                />
                <PhotoFrame
                  src="/assets/fondo-novios-2.jpg"
                  alt="Josué y Claudia — detalle"
                  objectPosition="center 68%"
                  style={{ flex: 1 }}
                />
              </div>

              {/* Right: large vertical photo */}
              <div style={{ flex:1, overflow:'hidden' }}>
                <PhotoFrame
                  src="/assets/fondo-novios-2.jpg"
                  alt="Retrato de Josué y Claudia"
                  objectPosition="center top"
                  sprig="br"
                  style={{ width:'100%', height:'100%' }}
                />
              </div>
            </div>

            {/* Nuestro Lugar */}
            <MapBlock/>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
