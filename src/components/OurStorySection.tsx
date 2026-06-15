'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { AppSection } from './WeddingNavbar';

// ── Palette ────────────────────────────────────────────────────────────────────

const GOLD        = '#D8B46A';
const GOLD_BRIGHT = '#E3C174';
const GOLD_MUTED  = '#B8924E';
const IVORY       = '#F4EBD8';
const IVORY_SOFT  = 'rgba(244,235,216,0.82)';
const IVORY_DIM   = 'rgba(244,235,216,0.70)';

// ── Content ────────────────────────────────────────────────────────────────────

const INTRO =
  'Hay historias que no se planean, se sienten. La nuestra comenzó sin prisa y, sin darnos cuenta, se volvió el hogar que siempre soñamos. Así ha sido nuestro camino: de miradas que se encontraron a un amor que hoy elegimos para toda la vida.';

const STORY_BLOCKS = [
  {
    number: '01',
    title:  'El comienzo',
    text:   'Dos almas que se cruzaron en el momento perfecto, sin buscarlo. Desde esa primera conversación, supimos que algo especial acababa de empezar.',
  },
  {
    number: '02',
    title:  'Nuestro camino',
    text:   'Aprendimos, crecimos y elegimos caminar juntos. Entre risas, apoyo y sueños compartidos, construimos nuestro lugar seguro, nuestro hogar, nuestro nosotros.',
  },
  {
    number: '03',
    title:  'El para siempre',
    text:   'Hoy, con el corazón lleno de gratitud y esperanza, damos el siguiente paso: unir nuestras vidas delante de Dios y de quienes más amamos.',
  },
] as const;

const QUOTE = '"Y así, lo que empezó como un encuentro, se convirtió en nuestro mayor regalo: el uno al otro."';

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

const staggerContainer = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.10, delayChildren: 0.30 } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.80, ease: EASE } },
};

const photoFade = {
  hidden:  { opacity: 0, scale: 0.976 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.0, ease: EASE } },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function BotanicalLeaf() {
  return (
    <svg width="18" height="26" viewBox="0 0 18 26" fill="none" aria-hidden="true">
      <line x1="9" y1="25" x2="9" y2="1"    stroke={GOLD_MUTED} strokeWidth="0.75" strokeLinecap="round" opacity="0.72" />
      <path d="M9 19 Q5 15 2 11"             stroke={GOLD_MUTED} strokeWidth="0.72" strokeLinecap="round" opacity="0.65" />
      <path d="M9 19 Q13 15 16 11"           stroke={GOLD_MUTED} strokeWidth="0.72" strokeLinecap="round" opacity="0.65" />
      <path d="M9 13.5 Q6 11 4 8"            stroke={GOLD_MUTED} strokeWidth="0.62" strokeLinecap="round" opacity="0.52" />
      <path d="M9 13.5 Q12 11 14 8"          stroke={GOLD_MUTED} strokeWidth="0.62" strokeLinecap="round" opacity="0.52" />
    </svg>
  );
}

function BotanicalBranch({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="100" height="110" viewBox="0 0 100 110"
      fill="none" aria-hidden="true"
      style={{ transform: flip ? 'scale(-1,-1)' : 'none' }}
    >
      <path d="M8 102 C20 80 26 62 40 46 C52 31 68 20 92 8"
            stroke={GOLD_MUTED} strokeWidth="0.85" strokeLinecap="round" opacity="0.55"/>
      <path d="M26 72 C16 64 8 54 4 42"
            stroke={GOLD_MUTED} strokeWidth="0.72" strokeLinecap="round" opacity="0.44"/>
      <path d="M40 46 C50 38 62 30 68 20"
            stroke={GOLD_MUTED} strokeWidth="0.72" strokeLinecap="round" opacity="0.44"/>
      <ellipse cx="4" cy="40" rx="5" ry="9" fill="none"
               stroke={GOLD_MUTED} strokeWidth="0.60" opacity="0.38"
               transform="rotate(-35 4 40)"/>
      <ellipse cx="68" cy="20" rx="4" ry="8" fill="none"
               stroke={GOLD_MUTED} strokeWidth="0.60" opacity="0.36"
               transform="rotate(-55 68 20)"/>
      <ellipse cx="50" cy="32" rx="3" ry="6" fill="none"
               stroke={GOLD_MUTED} strokeWidth="0.52" opacity="0.30"
               transform="rotate(-48 50 32)"/>
      <circle cx="92" cy="8"  r="1.6" fill={GOLD_MUTED} opacity="0.32"/>
      <circle cx="26" cy="72" r="1.4" fill={GOLD_MUTED} opacity="0.28"/>
    </svg>
  );
}

function FrameCorner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const right  = pos.endsWith('r');
  const bottom = pos.startsWith('b');
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: '18px', height: '18px',
        ...(right  ? { right: '6px'  } : { left:   '6px' }),
        ...(bottom ? { bottom: '6px' } : { top:    '6px' }),
        borderTop:    bottom ? 'none' : `1px solid rgba(216,180,106,0.78)`,
        borderBottom: bottom ? `1px solid rgba(216,180,106,0.78)` : 'none',
        borderLeft:   right  ? 'none' : `1px solid rgba(216,180,106,0.78)`,
        borderRight:  right  ? `1px solid rgba(216,180,106,0.78)` : 'none',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  );
}

interface PhotoFrameProps {
  src: string;
  alt: string;
  objectPosition?: string;
  style?: React.CSSProperties;
}

function PhotoFrame({ src, alt, objectPosition = 'center', style }: PhotoFrameProps) {
  return (
    <motion.div
      variants={photoFade}
      style={{
        position:   'relative',
        overflow:   'hidden',
        border:     '1px solid rgba(216,180,106,0.52)',
        boxShadow:  '0 16px 48px rgba(0,0,0,0.42)',
        flexShrink: 0,
        ...style,
      }}
    >
      <FrameCorner pos="tl" />
      <FrameCorner pos="tr" />
      <FrameCorner pos="bl" />
      <FrameCorner pos="br" />
      <img
        src={src}
        alt={alt}
        style={{
          width:          '100%',
          height:         '100%',
          objectFit:      'cover',
          objectPosition,
          display:        'block',
        }}
      />
      {/* Subtle depth overlay */}
      <div
        aria-hidden="true"
        style={{
          position:       'absolute',
          inset:          0,
          background:     'linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, transparent 20%, transparent 78%, rgba(0,0,0,0.14) 100%)',
          pointerEvents:  'none',
        }}
      />
    </motion.div>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
  setActiveSection: (s: AppSection) => void;
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function OurStorySection({ setActiveSection: _setActiveSection }: Props) {
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
      id="nuestra-historia"
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
      aria-label="Nuestra Historia — Josué y Claudia"
    >
      {/* ── Gradient overlay — lighter so background remains visible ─────── */}
      <div
        style={{
          position: 'absolute',
          inset:    0,
          background: 'linear-gradient(90deg, rgba(3,8,6,0.68) 0%, rgba(3,8,6,0.48) 45%, rgba(3,8,6,0.30) 72%, rgba(3,8,6,0.18) 100%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* ── Edge vignette ─────────────────────────────────────────────────── */}
      <div
        style={{
          position:      'absolute',
          inset:         0,
          background:    'radial-gradient(ellipse at center, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.50) 100%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div
        style={{
          position:       'relative',
          zIndex:         10,
          display:        'flex',
          flexDirection:  isDesktop ? 'row' : 'column',
          justifyContent: isDesktop ? 'flex-start' : 'center',
          width:          '100%',
          height:         '100dvh',
          paddingTop:     isDesktop ? '82px' : '80px',
          paddingBottom:  isDesktop ? '22px' : '80px',
          paddingLeft:    isDesktop ? '56px' : '32px',
          paddingRight:   isDesktop ? '28px' : '32px',
          gap:            0,
          overflow:       'hidden',
        }}
      >
        {/* ════════════════════════════════════════════════════════════════
            LEFT — narrative text
        ════════════════════════════════════════════════════════════════ */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{
            width:          isDesktop ? '40%' : '100%',
            flexShrink:     0,
            display:        'flex',
            flexDirection:  'column',
            justifyContent: 'center',
            paddingRight:   isDesktop ? '40px' : '0',
            overflow:       'hidden',
          }}
        >
          {/* Botanical ornament */}
          <motion.div variants={fadeUp} style={{ marginBottom: '10px' }}>
            <BotanicalLeaf />
          </motion.div>

          {/* Section title */}
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily:    'var(--font-cormorant)',
              fontWeight:    400,
              fontSize:      'clamp(40px, 3.9vw, 66px)',
              letterSpacing: '-0.03em',
              lineHeight:    1.0,
              color:         IVORY,
              margin:        0,
              marginBottom:  '10px',
              textShadow:    '0 2px 18px rgba(0,0,0,0.55)',
            }}
          >
            Nuestra Historia
          </motion.h2>

          {/* Ornamental divider */}
          <motion.div
            variants={fadeUp}
            aria-hidden="true"
            style={{ display: 'flex', alignItems: 'center', maxWidth: '260px', marginBottom: '16px' }}
          >
            <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to right, rgba(216,180,106,0.58), transparent)' }} />
            <span style={{ color: GOLD_MUTED, fontSize: '12px', margin: '0 10px', lineHeight: 1, fontFamily: 'serif' }}>❦</span>
            <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to left, rgba(216,180,106,0.58), transparent)' }} />
          </motion.div>

          {/* Intro paragraph */}
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily:   'var(--font-cormorant)',
              fontSize:     'clamp(14px, 1.12vw, 17px)',
              lineHeight:   1.72,
              color:        IVORY_SOFT,
              margin:       0,
              marginBottom: '18px',
              textShadow:   '0 1px 8px rgba(0,0,0,0.38)',
            }}
          >
            {INTRO}
          </motion.p>

          {/* Story blocks */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {STORY_BLOCKS.map(({ number, title, text }, i) => (
              <div key={number}>
                <motion.div
                  variants={fadeUp}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}
                >
                  {/* Number column */}
                  <div
                    style={{
                      display:       'flex',
                      flexDirection: 'column',
                      alignItems:    'center',
                      flexShrink:    0,
                      minWidth:      '28px',
                      paddingTop:    '1px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily:    'var(--font-cinzel)',
                        fontSize:      '10px',
                        fontWeight:    500,
                        letterSpacing: '0.08em',
                        color:         GOLD_MUTED,
                        lineHeight:    1,
                      }}
                    >
                      {number}
                    </span>
                    <div
                      aria-hidden="true"
                      style={{
                        width:      '0.5px',
                        height:     '18px',
                        background: 'linear-gradient(to bottom, rgba(184,146,78,0.50), transparent)',
                        marginTop:  '5px',
                      }}
                    />
                  </div>

                  {/* Text */}
                  <div
                    style={{
                      display:       'flex',
                      flexDirection: 'column',
                      paddingBottom: i < STORY_BLOCKS.length - 1 ? '12px' : '0',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily:    'var(--font-cinzel)',
                        fontSize:      'clamp(10.5px, 0.88vw, 13px)',
                        fontWeight:    500,
                        letterSpacing: '0.22em',
                        color:         GOLD_BRIGHT,
                        margin:        0,
                        marginBottom:  '6px',
                        textShadow:    '0 1px 6px rgba(0,0,0,0.50)',
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-cormorant)',
                        fontSize:   'clamp(13px, 1.05vw, 15.5px)',
                        lineHeight: 1.72,
                        color:      IVORY_DIM,
                        margin:     0,
                        textShadow: '0 1px 6px rgba(0,0,0,0.32)',
                      }}
                    >
                      {text}
                    </p>
                  </div>
                </motion.div>

                {i < STORY_BLOCKS.length - 1 && (
                  <motion.div
                    variants={fadeUp}
                    aria-hidden="true"
                    style={{
                      height:       '0.5px',
                      marginLeft:   '44px',
                      marginBottom: '2px',
                      background:   'linear-gradient(to right, rgba(216,180,106,0.18), transparent)',
                      maxWidth:     '85%',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Quote */}
          <motion.div variants={fadeUp} style={{ marginTop: '14px' }}>
            <div
              aria-hidden="true"
              style={{
                height:       '0.5px',
                maxWidth:     '280px',
                background:   'linear-gradient(to right, rgba(216,180,106,0.34), transparent)',
                marginBottom: '14px',
              }}
            />
            <blockquote
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontStyle:  'italic',
                fontWeight: 400,
                fontSize:   'clamp(14px, 1.14vw, 17px)',
                lineHeight: 1.65,
                color:      'rgba(216,180,106,0.92)',
                margin:     0,
                padding:    0,
                textShadow: '0 1px 8px rgba(0,0,0,0.42)',
              }}
            >
              {QUOTE}
            </blockquote>
          </motion.div>
        </motion.div>

        {/* Photos — desktop only */}
        {isDesktop && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            style={{
              flex:    1,
              display: 'flex',
              gap:     '12px',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            {/* ── Center: stacked smaller photos ───────────────────────── */}
            <div
              style={{
                flex:          '0 0 44%',
                display:       'flex',
                flexDirection: 'column',
                gap:           '10px',
                overflow:      'hidden',
              }}
            >
              {/* Medium photo (top, 54% height) */}
              <PhotoFrame
                src="/assets/fondo-novios-2.jpg"
                alt="Josué y Claudia"
                objectPosition="center 35%"
                style={{ flex: '0 0 54%', width: '100%' }}
              />

              {/* Two small photos (bottom, share remaining height) */}
              <div style={{ flex: 1, display: 'flex', gap: '10px', overflow: 'hidden' }}>
                <PhotoFrame
                  src="/assets/fondo-novios-2.jpg"
                  alt="Josué y Claudia"
                  objectPosition="25% center"
                  style={{ flex: 1 }}
                />
                <PhotoFrame
                  src="/assets/fondo-novios-2.jpg"
                  alt="Josué y Claudia"
                  objectPosition="75% center"
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            {/* ── Large vertical photo (right) ──────────────────────── */}
            <div
              style={{
                flex:     '0 0 56%',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <PhotoFrame
                src="/assets/fondo-novios-2.jpg"
                alt="Retrato de Josué y Claudia"
                objectPosition="center top"
                style={{ width: '100%', height: '100%' }}
              />

              {/* Botanical ornament — top-left of large frame */}
              <div
                aria-hidden="true"
                style={{
                  position:      'absolute',
                  top:           '-4px',
                  left:          '-4px',
                  pointerEvents: 'none',
                  zIndex:        3,
                  opacity:       0.72,
                }}
              >
                <BotanicalBranch />
              </div>

              {/* Botanical ornament — bottom-right of large frame */}
              <div
                aria-hidden="true"
                style={{
                  position:      'absolute',
                  bottom:        '-4px',
                  right:         '-4px',
                  pointerEvents: 'none',
                  zIndex:        3,
                  opacity:       0.60,
                }}
              >
                <BotanicalBranch flip />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
