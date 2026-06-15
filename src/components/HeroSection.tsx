'use client';

import { Fragment, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { AppSection } from './WeddingNavbar';

// ── Types ──────────────────────────────────────────────────────────────────────

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const GOLD        = '#D8B46A';
const GOLD_BRIGHT = '#E3C174';
const IVORY       = '#F4EBD8';

const WEDDING_DATE = new Date('2026-11-20T00:00:00-05:00');

const COUNTDOWN_UNITS: { key: keyof TimeLeft; label: string; padded: boolean }[] = [
  { key: 'days',    label: 'DÍAS',  padded: false },
  { key: 'hours',   label: 'HORAS', padded: true  },
  { key: 'minutes', label: 'MIN',   padded: true  },
  { key: 'seconds', label: 'SEG',   padded: true  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function getTimeLeft(): TimeLeft {
  const diff = WEDDING_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000)  / 60_000),
    seconds: Math.floor((diff % 60_000)     / 1_000),
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

// ── Screen transition variants ─────────────────────────────────────────────────

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

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
  setActiveSection: (s: AppSection) => void;
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function HeroSection({ setActiveSection: _setActiveSection }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.section
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      id="inicio"
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        width:    '100%',
        height:   '100dvh',
        overflow: 'hidden',
      }}
      aria-label="Bienvenida a la boda de Josué y Claudia"
    >
      {/* ── Background photograph ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/fondo-novios.jpg')" }}
        role="img"
        aria-label="Jardín con los novios Josué y Claudia"
      />

      {/* ── Cinematic overlay ─────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: [
            'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.38) 100%)',
            'linear-gradient(to bottom, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.10) 28%, rgba(0,0,0,0.06) 55%, rgba(0,0,0,0.26) 76%, rgba(0,0,0,0.48) 100%)',
            'radial-gradient(ellipse 78% 48% at 50% 33%, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.14) 52%, transparent 74%)',
          ].join(', '),
        }}
      />

      {/* ── Main text block ────────────────────────────────────────────────── */}
      <div
        className="absolute z-40 w-full text-center wedding-text-reveal"
        style={{ top: '128px', left: '50%' }}
      >
        <h1
          style={{
            fontFamily:    'var(--font-cormorant)',
            fontWeight:    400,
            color:         IVORY,
            fontSize:      'clamp(44px, 5.6vw, 88px)',
            letterSpacing: '-0.04em',
            lineHeight:    0.92,
            textShadow:    '0 2px 20px rgba(0,0,0,0.60), 0 0 14px rgba(216,180,106,0.10)',
            margin:        0,
            padding:       0,
          }}
        >
          Josué{' '}
          <span
            style={{
              fontFamily:    'var(--font-pinyon)',
              color:         GOLD,
              fontSize:      '1.06em',
              letterSpacing: '0.01em',
              display:       'inline-block',
              verticalAlign: '-0.05em',
            }}
          >
            {'&'}
          </span>
          {' '}Claudia
        </h1>

        {/* Ornamental divider */}
        <div
          className="flex items-center justify-center mx-auto"
          aria-hidden="true"
          style={{ width: '195px', marginTop: '12px' }}
        >
          <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to right, transparent, rgba(216,180,106,0.62))' }} />
          <span style={{ color: 'rgba(216,180,106,0.80)', fontSize: '14px', margin: '0 10px', lineHeight: 1, fontFamily: 'serif' }}>❦</span>
          <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to left, transparent, rgba(216,180,106,0.62))' }} />
        </div>

        {/* NOS CASAMOS */}
        <div
          className="flex items-center justify-center mx-auto"
          style={{ marginTop: '19px', gap: '16px', maxWidth: '520px', padding: '0 20px' }}
        >
          <div aria-hidden="true" style={{ flex: 1, maxWidth: '88px', height: '1px', background: 'linear-gradient(to left, rgba(227,193,116,0.68), transparent)' }} />
          <p
            style={{
              fontFamily:    'var(--font-cinzel)',
              fontSize:      'clamp(14px, 1.55vw, 22px)',
              fontWeight:    500,
              letterSpacing: '0.32em',
              color:         GOLD_BRIGHT,
              textShadow:    '0 2px 10px rgba(0,0,0,0.75), 0 0 12px rgba(216,180,106,0.25)',
              margin:        0,
              padding:       0,
              whiteSpace:    'nowrap',
            }}
          >
            NOS CASAMOS
          </p>
          <div aria-hidden="true" style={{ flex: 1, maxWidth: '88px', height: '1px', background: 'linear-gradient(to right, rgba(227,193,116,0.68), transparent)' }} />
        </div>

        {/* Date */}
        <p
          style={{
            fontFamily:    'var(--font-cinzel)',
            fontSize:      'clamp(12px, 1.28vw, 19px)',
            fontWeight:    500,
            letterSpacing: '0.24em',
            color:         IVORY,
            textShadow:    '0 2px 12px rgba(0,0,0,0.80), 0 0 10px rgba(216,180,106,0.18)',
            marginTop:     '14px',
            marginBottom:  0,
          }}
        >
          20 DE NOVIEMBRE DE 2026
        </p>
      </div>

      {/* ── Countdown ──────────────────────────────────────────────────────── */}
      <div
        className="absolute z-40 text-center wedding-countdown-reveal"
        style={{ bottom: 'clamp(52px, 8vh, 88px)', left: '50%' }}
        aria-label="Cuenta regresiva para el 20 de noviembre de 2026"
      >
        <div className="flex items-start" role="timer">
          {COUNTDOWN_UNITS.map(({ key, label, padded }, i) => (
            <Fragment key={key}>
              <div
                className="flex flex-col items-center"
                style={{ padding: '0 clamp(12px, 2.2vw, 28px)' }}
              >
                <span
                  style={{
                    fontFamily:    'var(--font-cormorant)',
                    fontSize:      'clamp(34px, 3.4vw, 48px)',
                    fontWeight:    500,
                    color:         IVORY,
                    letterSpacing: '0.08em',
                    lineHeight:    1,
                    textShadow:    '0 3px 14px rgba(0,0,0,0.75), 0 0 8px rgba(244,235,216,0.12)',
                    minWidth:      '1.5ch',
                    display:       'block',
                    textAlign:     'center',
                  }}
                >
                  {timeLeft === null
                    ? '—'
                    : padded
                    ? pad(timeLeft[key])
                    : String(timeLeft[key])}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily:    'var(--font-cinzel)',
                    fontSize:      'clamp(10px, 0.90vw, 13.5px)',
                    fontWeight:    500,
                    letterSpacing: '0.18em',
                    color:         GOLD_BRIGHT,
                    marginTop:     '6px',
                    textShadow:    '0 2px 8px rgba(0,0,0,0.78), 0 0 8px rgba(216,180,106,0.22)',
                    userSelect:    'none',
                  }}
                >
                  {label}
                </span>
              </div>

              {i < COUNTDOWN_UNITS.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    width:      '1px',
                    height:     'clamp(32px, 3.0vw, 42px)',
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(227,193,116,0.62) 25%, rgba(227,193,116,0.62) 75%, transparent 100%)',
                    marginTop:  'clamp(7px, 0.75vw, 11px)',
                    flexShrink: 0,
                  }}
                />
              )}
            </Fragment>
          ))}
        </div>

        <div
          aria-hidden="true"
          style={{
            width:      '72px',
            height:     '0.5px',
            background: 'linear-gradient(to right, transparent, rgba(216,180,106,0.38), transparent)',
            margin:     '13px auto 0',
          }}
        />
      </div>
    </motion.section>
  );
}
