import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import gsap from 'gsap';

const FEATURES = [
  {
    id: 'precision',
    title: 'Laser-cut Precision',
    text: 'Crisp, ultra-fine CNC cutting for flawless detail.',
    size: 'large',
    icon: 'laser',
  },
  {
    id: 'matte',
    title: 'Matte Powder Finish',
    text: 'Smooth, fingerprint‑resistant matte coating.',
    size: 'small',
    icon: 'shine',
  },
  {
    id: 'steel',
    title: 'Rust‑Proof Steel',
    text: 'Premium stainless steel crafted to last decades.',
    size: 'tall',
    icon: 'shield',
  },
  {
    id: 'secure',
    title: 'Secure Checkout',
    text: 'Protected, encrypted and seamless payments.',
    size: 'wide',
    icon: 'lock',
  },
  {
    id: 'returns',
    title: 'Easy Returns',
    text: 'Hassle‑free 5‑day return window.',
    size: 'small',
    icon: 'return',
  },
  {
    id: 'satisfaction',
    title: 'Satisfaction Guaranteed',
    text: 'We stand by every piece we create.',
    size: 'small',
    icon: 'star',
  },
];

// Simple inline icons (SVG) — animated via framer-motion while hovered
function Icon({ name }) {
  const common = { width: 40, height: 40, viewBox: '0 0 24 24', fill: 'none' };
  switch (name) {
    case 'laser':
      return (
        <motion.svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.15, rotate: 8 }}
        >
          <path d="M3 12h18M3 6h2M19 6h2M3 18h2M19 18h2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2" />
        </motion.svg>
      );
    case 'shine':
      return (
        <motion.svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.15, rotate: 8 }}
        >
          <path d="M12 2v4M12 18v4M4.2 4.2l2.8 2.8M16.9 16.9l2.8 2.8M2 12h4M18 12h4M4.2 19.8l2.8-2.8M16.9 7.1l2.8-2.8" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      );
    case 'shield':
      return (
        <motion.svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.15, rotate: 8 }}
        >
          <path d="M12 2l7 4v5c0 5-3 9-7 11-4-2-7-6-7-11V6l7-4z" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      );
    case 'lock':
      return (
        <motion.svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.15, rotate: 8 }}
        >
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M7 11V8a5 5 0 0 1 10 0v3" />
        </motion.svg>
      );
    case 'return':
      return (
        <motion.svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.15, rotate: 8 }}
        >
          <path d="M3 12v6h6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      );
    case 'star':
      return (
        <motion.svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.15, rotate: 8 }}
        >
          <path d="M12 2l2.6 5.3L20 9l-4 3.9L17.2 20 12 16.9 6.8 20 8 12.9 4 9l5.4-1.7L12 2z" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      );
    default:
      return null;
  }
}

// Single tile component
function Tile({ item, index }) {
  const controls = useAnimation();
  const ref = useRef(null);

  // Magnetic hover (gsap) — move tile toward cursor when pointer within
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const onPointerMove = (e) => {
      const rect = node.getBoundingClientRect();
      const cx = (e.clientX - (rect.left + rect.width / 2)) / rect.width; // -0.5..0.5
      const cy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      gsap.to(node, { x: cx * 10, y: cy * 8, rotation: cx * 2, duration: 0.35, ease: 'power3.out' });
    };
    const onPointerLeave = () => {
      gsap.to(node, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'power3.out' });
    };

    node.addEventListener('pointermove', onPointerMove);
    node.addEventListener('pointerleave', onPointerLeave);

    return () => {
      node.removeEventListener('pointermove', onPointerMove);
      node.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`bento-tile group 
  ${item.id === 'precision' ? 'col-start-1 col-end-7 row-start-1' : ''}
  ${item.id === 'matte' ? 'col-start-7 col-end-13 row-start-1' : ''}
  ${item.id === 'secure' ? 'col-start-1 col-end-10 row-start-2' : ''}
  ${item.id === 'steel' ? 'col-start-10 col-end-13 row-start-2 row-end-4' : ''}
  ${item.id === 'returns' ? 'col-start-1 col-end-7 row-start-3' : ''}
  ${item.id === 'satisfaction' ? 'col-start-7 col-end-10 row-start-3' : ''}
`}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.35 }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: "easeOut" }}
      onHoverStart={() => controls.start({ scale: 1.02 })}
      onHoverEnd={() => controls.start({ scale: 1 })}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 22,
        background: 'white',
        borderRadius: 14,
        border: '1px solid var(--brownline)',
        boxShadow: '0 8px 26px rgba(0,0,0,0.06)',
      }}
    >
      <motion.div
        className="icon-wrap"
        animate={controls}
        style={{ color: 'var(--midchar)' }}
      >
        <motion.div
          whileHover={{ rotate: 8 }}
          transition={{ duration: 0.9 }}
          style={{ width: 44, height: 44 }}
        >
          <Icon name={item.icon} />
        </motion.div>
      </motion.div>

      <div>
        <h3 className="text-lg font-semibold text-[var(--midchar)]">{item.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{item.text}</p>
      </div>
    </motion.div>
  );
}

export default function BentoFeatures() {
  const wrapperRef = useRef(null);

  // Soft parallax for whole grid — gentle move
  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    let mouseX = 0;
    let mouseY = 0;

    const onMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      gsap.to(node, { x: mouseX * 6, y: mouseY * 4, duration: 0.6, ease: 'power3.out' });
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', () => gsap.to(node, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' }));

    return () => {
      node.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <section className="bento-section py-20 bg-[var(--cream)]">
      <div className="container mx-auto px-6" ref={wrapperRef}>
        <h2 className="text-2xl font-semibold mb-8">Our Features & Guarantees</h2>

        <div className="bento-grid grid gap-6 grid-cols-1 md:grid-cols-12 grid-rows-[repeat(4,auto)] auto-rows-[160px]">
          {/* Using CSS grid areas via classes to create bento-like layout */}
          {FEATURES.map((f, i) => (
            <Tile key={f.id} item={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
