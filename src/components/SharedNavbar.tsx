'use client';

import { Fragment, useEffect, useState } from 'react';

// ── Constants ──────────────────────────────────────────────────────────────────

const GOLD_BRIGHT = '#E3C174';
const IVORY       = '#F4EBD8';

const NAV_ITEMS = [
  { label: 'INICIO',           href: '#inicio',           id: 'inicio'           },
  { label: 'NUESTRA HISTORIA', href: '#nuestra-historia', id: 'nuestra-historia' },
  { label: 'DETALLES',         href: '#detalles',         id: 'detalles'         },
  { label: 'GALERÍA',          href: '#galeria',          id: 'galeria'          },
  { label: 'RSVP',             href: '#rsvp',             id: 'rsvp'             },
];

const NAV_ITEMS_MOBILE = [
  { label: 'INICIO',   href: '#inicio',           id: 'inicio'           },
  { label: 'HISTORIA', href: '#nuestra-historia', id: 'nuestra-historia' },
  { label: 'DETALLES', href: '#detalles',         id: 'detalles'         },
  { label: 'RSVP',     href: '#rsvp',             id: 'rsvp'             },
];

// ── Shared nav link style factory ──────────────────────────────────────────────

function navLinkStyle(isActive: boolean, fontSize = '11.5px', letterSpacing = '0.18em'): React.CSSProperties {
  return {
    fontFamily:     'var(--font-cinzel)',
    fontSize,
    letterSpacing,
    color:          isActive ? GOLD_BRIGHT : IVORY,
    textDecoration: 'none',
    whiteSpace:     'nowrap',
    textShadow:     '0 1px 6px rgba(0,0,0,0.50)',
    paddingBottom:  isActive ? '2px' : '0',
    borderBottom:   isActive ? '1px solid rgba(227,193,116,0.70)' : '1px solid transparent',
    transition:     'color 0.35s ease, border-color 0.35s ease',
    cursor:         'pointer',
  };
}

function Flourish({ side }: { side: 'left' | 'right' }) {
  return (
    <span
      aria-hidden="true"
      style={{
        color:       'rgba(216,180,106,0.60)',
        fontSize:    '9px',
        letterSpacing: '2.5px',
        userSelect:  'none',
        flexShrink:  0,
        ...(side === 'left' ? { marginRight: '14px' } : { marginLeft: '14px' }),
      }}
    >
      — ✦ —
    </span>
  );
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      style={{ color: 'rgba(216,180,106,0.55)', fontSize: '6.5px', margin: '0 10px', userSelect: 'none', flexShrink: 0 }}
    >
      ✦
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function SharedNavbar() {
  const [activeId, setActiveId]   = useState<string>('inicio');
  const [scrolled, setScrolled]   = useState<boolean>(false);
  // JS-driven breakpoint — avoids dependence on Tailwind CSS scanning in dev
  const [isMobile, setIsMobile]   = useState<boolean>(false);

  // Responsive breakpoint — mobile < 640 px
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Detect scroll depth for background opacity
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Detect active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { threshold: 0.25, rootMargin: '-60px 0px -30% 0px' },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const navBg = scrolled
    ? 'rgba(10, 14, 11, 0.76)'
    : 'rgba(14, 19, 14, 0.14)';

  const sharedContainerStyle: React.CSSProperties = {
    position:            'fixed',
    top:                 '24px',
    left:                '50%',
    transform:           'translateX(-50%)',
    zIndex:              100,
    display:             'flex',
    alignItems:          'center',
    justifyContent:      'center',
    height:              '44px',
    borderRadius:        '2px',
    background:          navBg,
    backdropFilter:      'blur(8px)',
    WebkitBackdropFilter:'blur(8px)',
    transition:          'background 0.4s ease',
    gap:                 0,
  };

  return isMobile ? (
    /* ── Mobile nav (< 640 px) ─────────────────────────────────────────── */
    <nav
      style={{ ...sharedContainerStyle, width: '92%', maxWidth: '340px', padding: '0 14px' }}
      aria-label="Navegación principal"
    >
      {NAV_ITEMS_MOBILE.map(({ label, href, id }, i) => (
        <Fragment key={id}>
          <a href={href} style={navLinkStyle(activeId === id, '9.5px', '0.12em')}>{label}</a>
          {i < NAV_ITEMS_MOBILE.length - 1 && (
            <span aria-hidden="true" style={{ color: 'rgba(216,180,106,0.52)', fontSize: '6px', margin: '0 8px', userSelect: 'none' }}>✦</span>
          )}
        </Fragment>
      ))}
    </nav>
  ) : (
    /* ── Desktop nav (≥ 640 px) ────────────────────────────────────────── */
    <nav
      style={{ ...sharedContainerStyle, width: 'min(62%, 900px)', minWidth: '500px', padding: '0 20px' }}
      aria-label="Navegación principal"
    >
      <Flourish side="left" />
      {NAV_ITEMS.map(({ label, href, id }, i) => (
        <Fragment key={id}>
          <a href={href} style={navLinkStyle(activeId === id)}>{label}</a>
          {i < NAV_ITEMS.length - 1 && <Dot />}
        </Fragment>
      ))}
      <Flourish side="right" />
    </nav>
  );
}
