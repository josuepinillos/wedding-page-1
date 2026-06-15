'use client';

import { Fragment } from 'react';

export type AppSection = 'inicio' | 'nuestra-historia' | 'detalles' | 'galeria' | 'rsvp';

interface Props {
  activeSection: AppSection;
  setActiveSection: (s: AppSection) => void;
  isMobile?: boolean;
  scrolled?: boolean;
}

const GOLD_BRIGHT = '#E3C174';
const IVORY       = '#F4EBD8';

const DESKTOP_ITEMS: { label: string; id: AppSection }[] = [
  { label: 'INICIO',           id: 'inicio'           },
  { label: 'NUESTRA HISTORIA', id: 'nuestra-historia' },
  { label: 'DETALLES',         id: 'detalles'         },
  { label: 'GALERÍA',          id: 'galeria'           },
  { label: 'RSVP',             id: 'rsvp'             },
];

const MOBILE_ITEMS: { label: string; id: AppSection }[] = [
  { label: 'INICIO',   id: 'inicio'           },
  { label: 'HISTORIA', id: 'nuestra-historia' },
  { label: 'DETALLES', id: 'detalles'         },
  { label: 'RSVP',     id: 'rsvp'             },
];

export default function WeddingNavbar({
  activeSection,
  setActiveSection,
  isMobile  = false,
  scrolled  = false,
}: Props) {
  const navBg = scrolled ? 'rgba(10,14,11,0.76)' : 'rgba(14,19,14,0.14)';
  const items = isMobile ? MOBILE_ITEMS : DESKTOP_ITEMS;

  return (
    <nav
      aria-label="Navegación principal"
      style={{
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
        ...(isMobile
          ? { width: '92%', maxWidth: '340px', padding: '0 14px' }
          : { width: 'min(62%, 900px)', minWidth: '500px', padding: '0 20px' }),
      }}
    >
      {!isMobile && (
        <span
          aria-hidden="true"
          style={{ color:'rgba(216,180,106,0.60)', fontSize:'9px', letterSpacing:'2.5px', userSelect:'none', flexShrink:0, marginRight:'14px' }}
        >
          — ✦ —
        </span>
      )}

      {items.map((item, i) => (
        <Fragment key={item.id}>
          <button
            onClick={() => setActiveSection(item.id)}
            aria-current={activeSection === item.id ? 'page' : undefined}
            style={{
              fontFamily:    'var(--font-cinzel)',
              fontSize:      isMobile ? '9.5px' : '11.5px',
              letterSpacing: isMobile ? '0.12em' : '0.18em',
              color:         activeSection === item.id ? GOLD_BRIGHT : IVORY,
              background:    'none',
              border:        'none',
              borderBottom:  activeSection === item.id
                               ? '1px solid rgba(227,193,116,0.70)'
                               : '1px solid transparent',
              padding:       '0 0 2px 0',
              whiteSpace:    'nowrap',
              textShadow:    '0 1px 6px rgba(0,0,0,0.50)',
              transition:    'color 0.35s ease, border-color 0.35s ease',
              cursor:        'pointer',
            }}
          >
            {item.label}
          </button>

          {i < items.length - 1 && (
            <span
              aria-hidden="true"
              style={{
                color:      'rgba(216,180,106,0.55)',
                fontSize:   isMobile ? '6px' : '6.5px',
                margin:     isMobile ? '0 8px' : '0 10px',
                userSelect: 'none',
                flexShrink: 0,
              }}
            >
              ✦
            </span>
          )}
        </Fragment>
      ))}

      {!isMobile && (
        <span
          aria-hidden="true"
          style={{ color:'rgba(216,180,106,0.60)', fontSize:'9px', letterSpacing:'2.5px', userSelect:'none', flexShrink:0, marginLeft:'14px' }}
        >
          — ✦ —
        </span>
      )}
    </nav>
  );
}
