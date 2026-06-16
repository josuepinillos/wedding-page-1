'use client';

import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppSection } from './WeddingNavbar';
import { assetPath } from '@/lib/assetPath';

// ── Palette ──────────────────────────────────────────────────────────────────

const GOLD        = '#D8B46A';
const GOLD_BRIGHT = '#E3C174';
const GOLD_MUTED  = '#B8924E';
const IVORY       = '#F4EBD8';
const IVORY_SOFT  = 'rgba(244,235,216,0.80)';
const IVORY_DIM   = 'rgba(244,235,216,0.62)';

// ── Images ───────────────────────────────────────────────────────────────────

const GALLERY_IMAGES = [
  { src: '/assets/IMG_8140.JPEG', alt: 'Momento especial de Josué y Claudia 1' },
  { src: '/assets/IMG_8145.JPEG', alt: 'Momento especial de Josué y Claudia 2' },
  { src: '/assets/IMG_9602.JPEG', alt: 'Momento especial de Josué y Claudia 3' },
  { src: '/assets/IMG_9821.JPEG', alt: 'Momento especial de Josué y Claudia 4' },
  { src: '/assets/IMG_9861.JPEG', alt: 'Momento especial de Josué y Claudia 5' },
  { src: '/assets/IMG_9865.JPEG', alt: 'Momento especial de Josué y Claudia 6' },
  { src: '/assets/IMG_9970.JPEG', alt: 'Momento especial de Josué y Claudia 7' },
];

// ── Variants ─────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

const screenVariants = {
  initial: { opacity: 0, y: 24, scale: 0.992, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
  exit:    { opacity: 0, y: -18, scale: 0.992, filter: 'blur(4px)', transition: { duration: 0.65, ease: EASE } },
};

const pad = (n: number) => String(n).padStart(2, '0');

// ── Sub-components ────────────────────────────────────────────────────────────

function BotanicalLeaf() {
  return (
    <svg width="18" height="28" viewBox="0 0 18 28" fill="none" aria-hidden="true">
      <line x1="9" y1="27" x2="9" y2="1" stroke={GOLD_MUTED} strokeWidth="0.75" strokeLinecap="round" opacity="0.72"/>
      <path d="M9 20 Q5 16 2 12" stroke={GOLD_MUTED} strokeWidth="0.72" strokeLinecap="round" opacity="0.65"/>
      <path d="M9 20 Q13 16 16 12" stroke={GOLD_MUTED} strokeWidth="0.72" strokeLinecap="round" opacity="0.65"/>
      <path d="M9 14 Q6 11 4 8" stroke={GOLD_MUTED} strokeWidth="0.62" strokeLinecap="round" opacity="0.52"/>
      <path d="M9 14 Q12 11 14 8" stroke={GOLD_MUTED} strokeWidth="0.62" strokeLinecap="round" opacity="0.52"/>
      <path d="M9 8 Q8 5.5 9 3" stroke={GOLD_MUTED} strokeWidth="0.52" strokeLinecap="round" opacity="0.38"/>
    </svg>
  );
}

function FloralSprig({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="58" height="50" viewBox="0 0 72 60" fill="none" aria-hidden="true"
      style={{ transform: flip ? 'scale(-1,-1)' : 'none' }}
    >
      <path d="M6 54C16 40 28 28 42 20C56 12 66 7 70 4"
            stroke={GOLD_MUTED} strokeWidth="0.85" strokeLinecap="round" opacity="0.44"/>
      <path d="M18 40C10 32 4 22 2 12"
            stroke={GOLD_MUTED} strokeWidth="0.70" strokeLinecap="round" opacity="0.34"/>
      <path d="M42 20C48 14 56 8 60 4"
            stroke={GOLD_MUTED} strokeWidth="0.65" strokeLinecap="round" opacity="0.30"/>
      <ellipse cx="2" cy="10" rx="4" ry="7.5" fill="none"
               stroke={GOLD_MUTED} strokeWidth="0.52" opacity="0.25" transform="rotate(-38 2 10)"/>
      <circle cx="70" cy="4" r="1.2" fill={GOLD_MUTED} opacity="0.22"/>
    </svg>
  );
}

function CornerMark({ pos, size = 14 }: { pos: 'tl' | 'tr' | 'bl' | 'br'; size?: number }) {
  const r = pos.endsWith('r');
  const b = pos.startsWith('b');
  const offset = '5px';
  return (
    <span aria-hidden="true" style={{
      position:     'absolute',
      width:        `${size}px`,
      height:       `${size}px`,
      ...(r ? { right: offset } : { left: offset }),
      ...(b ? { bottom: offset } : { top: offset }),
      borderTop:    b ? 'none' : '1px solid rgba(216,180,106,0.65)',
      borderBottom: b ? '1px solid rgba(216,180,106,0.65)' : 'none',
      borderLeft:   r ? 'none' : '1px solid rgba(216,180,106,0.65)',
      borderRight:  r ? '1px solid rgba(216,180,106,0.65)' : 'none',
      pointerEvents: 'none',
      zIndex: 2,
    }} />
  );
}

function FrameCornerLg({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const r = pos.endsWith('r');
  const b = pos.startsWith('b');
  return (
    <span aria-hidden="true" style={{
      position:     'absolute',
      width:        '18px',
      height:       '18px',
      ...(r ? { right: '8px' } : { left: '8px' }),
      ...(b ? { bottom: '8px' } : { top: '8px' }),
      borderTop:    b ? 'none' : '1px solid rgba(216,180,106,0.78)',
      borderBottom: b ? '1px solid rgba(216,180,106,0.78)' : 'none',
      borderLeft:   r ? 'none' : '1px solid rgba(216,180,106,0.78)',
      borderRight:  r ? '1px solid rgba(216,180,106,0.78)' : 'none',
      pointerEvents: 'none',
      zIndex: 2,
    }} />
  );
}

function InstrIcon({ type }: { type: string }) {
  const shared = {
    width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none',
    stroke: GOLD, strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
    style: { flexShrink: 0 } as CSSProperties,
  };
  switch (type) {
    case 'arrows': return (
      <svg {...shared}><polyline points="8 7 3 12 8 17"/><polyline points="16 7 21 12 16 17"/></svg>
    );
    case 'zoom': return (
      <svg {...shared}>
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    );
    case 'heart': return (
      <svg {...shared}>
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    );
    case 'expand': return (
      <svg {...shared}>
        <polyline points="15 3 21 3 21 9"/>
        <polyline points="9 21 3 21 3 15"/>
        <line x1="21" y1="3" x2="14" y2="10"/>
        <line x1="3" y1="21" x2="10" y2="14"/>
      </svg>
    );
    default: return null;
  }
}

function NavCircle({ onClick, side, label }: {
  onClick: () => void;
  side:    'left' | 'right';
  label:   string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        position:       'absolute',
        ...(side === 'left' ? { left: '13px' } : { right: '13px' }),
        top:            '50%',
        transform:      'translateY(-50%)',
        zIndex:         5,
        width:          '38px',
        height:         '38px',
        borderRadius:   '50%',
        border:         '1px solid rgba(216,180,106,0.52)',
        background:     'rgba(5,10,7,0.62)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        cursor:         'pointer',
        backdropFilter: 'blur(6px)',
        transition:     'border-color 0.2s, background 0.2s',
      }}
      onMouseEnter={e => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.style.borderColor = 'rgba(227,193,116,0.88)';
        btn.style.background  = 'rgba(5,10,7,0.84)';
      }}
      onMouseLeave={e => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.style.borderColor = 'rgba(216,180,106,0.52)';
        btn.style.background  = 'rgba(5,10,7,0.62)';
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke={GOLD_BRIGHT} strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <polyline points={side === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'}/>
      </svg>
    </button>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  setActiveSection: (s: AppSection) => void;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GallerySection({ setActiveSection: _setActiveSection }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites,    setFavorites]    = useState<number[]>([]);
  const [isZoomed,     setIsZoomed]     = useState(false);
  const [isDesktop,    setIsDesktop]    = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1100px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      { setIsZoomed(false); return; }
      if (e.key === 'ArrowLeft')   setCurrentIndex(i => i === 0 ? GALLERY_IMAGES.length - 1 : i - 1);
      if (e.key === 'ArrowRight')  setCurrentIndex(i => i === GALLERY_IMAGES.length - 1 ? 0 : i + 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const prev = () => setCurrentIndex(i => i === 0 ? GALLERY_IMAGES.length - 1 : i - 1);
  const next = () => setCurrentIndex(i => i === GALLERY_IMAGES.length - 1 ? 0 : i + 1);

  const toggleFav = (idx: number) =>
    setFavorites(f => f.includes(idx) ? f.filter(x => x !== idx) : [...f, idx]);

  const isFav = (idx: number) => favorites.includes(idx);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 44) diff > 0 ? prev() : next();
    touchStartX.current = null;
  };

  return (
    <motion.section
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      id="galeria"
      aria-label="Galería de Josué y Claudia"
      style={{
        position:           'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        width:              '100%',
        height:             '100dvh',
        overflow:           'hidden',
        backgroundImage:    `url('${assetPath('/assets/fondo-nuestra-historia-premium.png')}')`,
        backgroundSize:     'cover',
        backgroundPosition: 'center',
        backgroundRepeat:   'no-repeat',
      }}
    >
      {/* Dark gradient overlay */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to right, rgba(3,8,6,0.76) 0%, rgba(3,8,6,0.44) 42%, rgba(3,8,6,0.60) 100%)',
      }}/>
      {/* Vignette */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.22) 68%, rgba(0,0,0,0.54) 100%)',
      }}/>

      {/* ── Content wrapper ──────────────────────────────────────── */}
      <div style={{
        position:      'relative',
        zIndex:        10,
        display:       'flex',
        flexDirection: isDesktop ? 'row' : 'column',
        width:         '100%',
        height:        '100dvh',
        paddingTop:    isDesktop ? '60px' : '74px',
        paddingBottom: isDesktop ? '14px' : '16px',
        paddingLeft:   isDesktop ? '48px' : '18px',
        paddingRight:  isDesktop ? '22px' : '18px',
        gap:           isDesktop ? '22px' : '0',
        overflow:      'hidden',
      }}>

        {/* ════════ LEFT PANEL — desktop only ════════ */}
        {isDesktop && (
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.82, ease: EASE, delay: 0.22 } }}
            style={{
              width:          '23%',
              flexShrink:     0,
              display:        'flex',
              flexDirection:  'column',
              justifyContent: 'center',
              paddingRight:   '10px',
              overflow:       'hidden',
            }}
          >
            {/* Botanical ornament */}
            <div aria-hidden="true" style={{ marginBottom: '8px', opacity: 0.70 }}>
              <BotanicalLeaf/>
            </div>

            {/* Section title */}
            <h2 style={{
              fontFamily:    'var(--font-cormorant)',
              fontWeight:    400,
              fontSize:      'clamp(46px, 4.1vw, 66px)',
              letterSpacing: '-0.035em',
              lineHeight:    0.92,
              color:         IVORY,
              margin:        0,
              marginBottom:  '10px',
              textShadow:    '0 2px 22px rgba(0,0,0,0.55)',
            }}>
              Galería
            </h2>

            {/* Ornamental divider */}
            <div aria-hidden="true" style={{
              display: 'flex', alignItems: 'center', maxWidth: '170px', marginBottom: '10px',
            }}>
              <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to right, rgba(216,180,106,0.58), transparent)' }}/>
              <span style={{ color: GOLD_MUTED, fontSize: '10px', margin: '0 8px', lineHeight: 1, fontFamily: 'serif' }}>❦</span>
              <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to left, rgba(216,180,106,0.58), transparent)' }}/>
            </div>

            {/* Subtitle */}
            <p style={{
              fontFamily:   'var(--font-cormorant)',
              fontSize:     'clamp(12.5px, 0.98vw, 15px)',
              lineHeight:   1.58,
              color:        IVORY_SOFT,
              margin:       0,
              marginBottom: '18px',
              textShadow:   '0 1px 8px rgba(0,0,0,0.35)',
            }}>
              Revive nuestros momentos favoritos
            </p>

            {/* Instructions box */}
            <div style={{
              position:   'relative',
              border:     '1px solid rgba(216,180,106,0.26)',
              background: 'rgba(5,10,7,0.50)',
              padding:    '11px 14px 5px',
            }}>
              <CornerMark pos="tl"/><CornerMark pos="tr"/>
              <CornerMark pos="bl"/><CornerMark pos="br"/>
              {[
                { icon: 'arrows', text: 'Arrastra para explorar'     },
                { icon: 'zoom',   text: 'Haz zoom para ver detalles' },
                { icon: 'heart',  text: 'Marca tus favoritas'         },
                { icon: 'expand', text: 'Ver en grande'              },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                  <InstrIcon type={icon}/>
                  <span style={{
                    fontFamily:    'var(--font-cinzel)',
                    fontSize:      '8px',
                    fontWeight:    400,
                    letterSpacing: '0.13em',
                    color:         IVORY_DIM,
                    lineHeight:    1.3,
                  }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ════════ RIGHT — photo + thumbnails + quote ════════ */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.82, ease: EASE, delay: 0.30 } }}
          style={{
            flex:          1,
            display:       'flex',
            flexDirection: 'column',
            gap:           '8px',
            minWidth:      0,
            overflow:      'hidden',
          }}
        >
          {/* Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to right, transparent, rgba(216,180,106,0.28))' }}/>
            <span style={{
              fontFamily:    'var(--font-cinzel)',
              fontSize:      '10px',
              fontWeight:    500,
              letterSpacing: '0.24em',
              color:         GOLD_BRIGHT,
            }}>
              {pad(currentIndex + 1)} / {pad(GALLERY_IMAGES.length)}
            </span>
            <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to left, transparent, rgba(216,180,106,0.28))' }}/>
          </div>

          {/* ── Main photo frame ── */}
          <div
            style={{ flex: 1, position: 'relative', minHeight: 0, overflow: 'hidden' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Gold frame border + inner corner marks */}
            <div aria-hidden="true" style={{
              position:      'absolute',
              inset:         0,
              zIndex:        3,
              pointerEvents: 'none',
              border:        '1px solid rgba(216,180,106,0.48)',
              boxShadow:     '0 18px 58px rgba(0,0,0,0.52), inset 0 0 0 1px rgba(216,180,106,0.07)',
            }}>
              <FrameCornerLg pos="tl"/><FrameCornerLg pos="tr"/>
              <FrameCornerLg pos="bl"/><FrameCornerLg pos="br"/>
            </div>

            {/* Botanical sprigs on photo corners */}
            <div aria-hidden="true" style={{ position: 'absolute', top: '-2px', left: '-2px', zIndex: 4, opacity: 0.52 }}>
              <FloralSprig/>
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', bottom: '-2px', right: '-2px', zIndex: 4, opacity: 0.45 }}>
              <FloralSprig flip/>
            </div>

            {/* Photo with cross-fade transition */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={assetPath(GALLERY_IMAGES[currentIndex].src)}
                alt={GALLERY_IMAGES[currentIndex].alt}
                initial={{ opacity: 0, scale: 1.014 }}
                animate={{ opacity: 1, scale: 1,     transition: { duration: 0.55, ease: EASE } }}
                exit={{    opacity: 0, scale: 0.986,  transition: { duration: 0.32, ease: EASE } }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              />
            </AnimatePresence>

            {/* Prev / Next navigation */}
            <NavCircle onClick={prev} side="left"  label="Foto anterior"/>
            <NavCircle onClick={next} side="right" label="Foto siguiente"/>

            {/* Zoom + Favorite buttons (top-right of photo) */}
            <div style={{
              position: 'absolute', top: '10px', right: '10px', zIndex: 5, display: 'flex', gap: '6px',
            }}>
              {/* Zoom */}
              <button
                onClick={() => setIsZoomed(true)}
                aria-label="Ver foto en grande"
                style={{
                  width:          '34px',
                  height:         '34px',
                  borderRadius:   '50%',
                  border:         '1px solid rgba(216,180,106,0.50)',
                  background:     'rgba(5,10,7,0.64)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  cursor:         'pointer',
                  backdropFilter: 'blur(6px)',
                  transition:     'border-color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(227,193,116,0.80)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(216,180,106,0.50)'; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke={GOLD_BRIGHT} strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/>
                  <line x1="8"  y1="11" x2="14" y2="11"/>
                </svg>
              </button>

              {/* Favorite */}
              <button
                onClick={() => toggleFav(currentIndex)}
                aria-label={isFav(currentIndex) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                style={{
                  width:          '34px',
                  height:         '34px',
                  borderRadius:   '50%',
                  border:         `1px solid ${isFav(currentIndex) ? 'rgba(227,193,116,0.82)' : 'rgba(216,180,106,0.50)'}`,
                  background:     'rgba(5,10,7,0.64)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  cursor:         'pointer',
                  backdropFilter: 'blur(6px)',
                  transition:     'border-color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(227,193,116,0.88)'; }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = isFav(currentIndex)
                    ? 'rgba(227,193,116,0.82)' : 'rgba(216,180,106,0.50)';
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24"
                  fill={isFav(currentIndex) ? GOLD_BRIGHT : 'none'}
                  stroke={GOLD_BRIGHT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* ── Thumbnails row ── */}
          <div style={{
            display:    'flex',
            gap:        '7px',
            flexShrink: 0,
            overflowX:  isDesktop ? 'hidden' : 'auto',
            overflowY:  'hidden',
          }}>
            {GALLERY_IMAGES.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ver foto ${idx + 1}`}
                aria-pressed={idx === currentIndex}
                style={{
                  flexGrow:   isDesktop ? 1 : 0,
                  flexShrink: 0,
                  flexBasis:  isDesktop ? 'auto' : '80px',
                  height:     isDesktop ? '74px' : '64px',
                  position:   'relative',
                  overflow:   'hidden',
                  border:     idx === currentIndex
                    ? '1.5px solid rgba(227,193,116,0.90)'
                    : '1px solid rgba(216,180,106,0.28)',
                  cursor:     'pointer',
                  padding:    0,
                  background: 'transparent',
                  transition: 'all 0.2s',
                  boxShadow:  idx === currentIndex ? '0 0 11px rgba(227,193,116,0.22)' : 'none',
                }}
                onMouseEnter={e => {
                  if (idx !== currentIndex) {
                    const btn = e.currentTarget as HTMLButtonElement;
                    btn.style.transform   = 'scale(1.04)';
                    btn.style.borderColor = 'rgba(216,180,106,0.62)';
                  }
                }}
                onMouseLeave={e => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.transform   = 'scale(1)';
                  if (idx !== currentIndex) btn.style.borderColor = 'rgba(216,180,106,0.28)';
                }}
              >
                <img
                  src={assetPath(img.src)}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
                {/* Active tint overlay */}
                {idx === currentIndex && (
                  <div aria-hidden="true" style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(216,180,106,0.09)',
                    pointerEvents: 'none',
                  }}/>
                )}
                {/* Favorite indicator */}
                {isFav(idx) && (
                  <div aria-hidden="true" style={{
                    position: 'absolute', top: '3px', right: '3px',
                    width: '13px', height: '13px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill={GOLD_BRIGHT} stroke="none">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* ── Bottom quote ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to right, transparent, rgba(216,180,106,0.24))' }}/>
            <p style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle:  'italic',
              fontSize:   isDesktop ? 'clamp(11px, 0.92vw, 13.5px)' : '11.5px',
              color:      'rgba(216,180,106,0.70)',
              margin:     0,
              textAlign:  'center',
              textShadow: '0 1px 8px rgba(0,0,0,0.38)',
              flexShrink: 0,
              whiteSpace: isDesktop ? 'nowrap' : 'normal',
            }}>
              Cada imagen guarda un instante que queremos recordar para siempre.
            </p>
            <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to left, transparent, rgba(216,180,106,0.24))' }}/>
          </div>
        </motion.div>
      </div>

      {/* ── Zoom modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25 } }}
            exit={{    opacity: 0, transition: { duration: 0.20 } }}
            style={{
              position:       'fixed',
              inset:          0,
              zIndex:         80,
              background:     'rgba(3,8,6,0.93)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              cursor:         'zoom-out',
            }}
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.90, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1, transition: { duration: 0.34, ease: EASE } }}
              exit={{    scale: 0.92,  opacity: 0, transition: { duration: 0.20 } }}
              style={{
                position:  'relative',
                border:    '1px solid rgba(216,180,106,0.40)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.65)',
                maxWidth:  '90vw',
                maxHeight: '88vh',
              }}
              onClick={e => e.stopPropagation()}
            >
              <FrameCornerLg pos="tl"/><FrameCornerLg pos="tr"/>
              <FrameCornerLg pos="bl"/><FrameCornerLg pos="br"/>

              <img
                src={assetPath(GALLERY_IMAGES[currentIndex].src)}
                alt={GALLERY_IMAGES[currentIndex].alt}
                style={{ display: 'block', maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain' }}
              />

              {/* Prev in modal */}
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                aria-label="Foto anterior"
                style={{
                  position:       'absolute',
                  left:           '-52px',
                  top:            '50%',
                  transform:      'translateY(-50%)',
                  width:          '38px',
                  height:         '38px',
                  borderRadius:   '50%',
                  border:         '1px solid rgba(216,180,106,0.50)',
                  background:     'rgba(5,10,7,0.72)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  cursor:         'pointer',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke={GOLD_BRIGHT} strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>

              {/* Next in modal */}
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                aria-label="Foto siguiente"
                style={{
                  position:       'absolute',
                  right:          '-52px',
                  top:            '50%',
                  transform:      'translateY(-50%)',
                  width:          '38px',
                  height:         '38px',
                  borderRadius:   '50%',
                  border:         '1px solid rgba(216,180,106,0.50)',
                  background:     'rgba(5,10,7,0.72)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  cursor:         'pointer',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke={GOLD_BRIGHT} strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>

              {/* Close button */}
              <button
                onClick={() => setIsZoomed(false)}
                aria-label="Cerrar galería ampliada"
                style={{
                  position:       'absolute',
                  top:            '9px',
                  right:          '9px',
                  zIndex:         2,
                  width:          '28px',
                  height:         '28px',
                  borderRadius:   '50%',
                  border:         '1px solid rgba(216,180,106,0.48)',
                  background:     'rgba(5,10,7,0.76)',
                  color:          GOLD_BRIGHT,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  cursor:         'pointer',
                  fontSize:       '16px',
                  lineHeight:     '1',
                  fontFamily:     'serif',
                }}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
