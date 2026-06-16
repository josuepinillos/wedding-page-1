'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WeddingNavbar, { type AppSection } from './WeddingNavbar';
import HeroSection from './HeroSection';
import OurStorySection from './OurStorySection';
import DetailsSection from './DetailsSection';
import GallerySection from './GallerySection';

// ── Placeholder for sections not yet built ─────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

function PlaceholderSection({ label }: { label: string }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6, ease: EASE } }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="absolute inset-0 flex items-center justify-center"
      style={{ height: '100dvh' }}
    >
      <p
        style={{
          fontFamily:    'var(--font-cinzel)',
          fontSize:      '13px',
          letterSpacing: '0.28em',
          color:         'rgba(216,180,106,0.55)',
        }}
      >
        {label.replace('-', ' ').toUpperCase()} — PRÓXIMAMENTE
      </p>
    </motion.section>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function WeddingLanding() {
  const [activeSection, setActiveSection] = useState<AppSection>('inicio');
  const [isMobile, setIsMobile]           = useState(false);

  // Lock body scroll — fullscreen SPA behavior
  useEffect(() => {
    const htmlPrev = document.documentElement.style.overflow;
    const bodyPrev = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = htmlPrev;
      document.body.style.overflow = bodyPrev;
    };
  }, []);

  // JS-driven mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width:    '100vw',
        height:   '100dvh',
        overflow: 'hidden',
        background: '#050806',
      }}
    >
      <WeddingNavbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMobile={isMobile}
      />

      <AnimatePresence mode="wait">
        {activeSection === 'inicio' && (
          <HeroSection
            key="inicio"
            setActiveSection={setActiveSection}
          />
        )}

        {activeSection === 'nuestra-historia' && (
          <OurStorySection
            key="nuestra-historia"
            setActiveSection={setActiveSection}
          />
        )}

        {activeSection === 'detalles' && (
          <DetailsSection
            key="detalles"
            setActiveSection={setActiveSection}
          />
        )}

        {activeSection === 'galeria' && (
          <GallerySection key="galeria" setActiveSection={setActiveSection} />
        )}

        {activeSection === 'rsvp' && (
          <PlaceholderSection key="rsvp" label="rsvp" />
        )}
      </AnimatePresence>
    </div>
  );
}
