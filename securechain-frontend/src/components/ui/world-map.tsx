"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import DottedMap from "dotted-map";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

const COUNTRY_LABELS = [
  { name: "INDIA", lat: 20, lng: 78 },
  { name: "USA", lat: 38, lng: -97 },
  { name: "EUROPE", lat: 48, lng: 15 },
  { name: "BRAZIL", lat: -15, lng: -55 },
  { name: "AUSTRALIA", lat: -25, lng: 133 },
];

export default function WorldMap({
  dots = [],
  lineColor = "#38bdf8",
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const map = new DottedMap({ height: 100, grid: "diagonal" });
  const heroBg = "#fdfaf5";

  const svgMap = map.getSVG({
    radius: 0.28,
    color: "#000000",
    shape: "circle",
    backgroundColor: heroBg,
  });

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 60;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  if (!mounted) return <div style={{ width: '100%', aspectRatio: '2/1' }}></div>;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      style={{
        width: '120%',
        marginLeft: '-10%',
        aspectRatio: '2/1',
        position: 'relative',
        backgroundColor: heroBg,
        borderRadius: '12px',
        overflow: 'visible'
      }}
    >
      {/* 1. LAYER: HEAVY ATMOSPHERIC PARTICLES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`atom-${i}`}
            animate={{
              x: [0, Math.random() * 80 - 40, 0],
              y: [0, Math.random() * 80 - 40, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              backgroundColor: lineColor,
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(3px)',
              zIndex: 1
            }}
          />
        ))}
      </div>

      {/* 2. LAYER: WORLD MAP WITH SHIMMER */}
      <motion.div
        animate={{
          opacity: [0.35, 0.45, 0.35]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          style={{
            height: '100%',
            width: '100%',
            maskImage: 'linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)',
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'block'
          }}
          alt="world map"
        />
      </motion.div>

      {/* 3. LAYER: RADAR SCAN BEAM */}
      <motion.div
        animate={{
          left: ['-20%', '120%']
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '150px',
          background: `linear-gradient(90deg, transparent, ${lineColor}10, transparent)`,
          zIndex: 5,
          pointerEvents: 'none'
        }}
      />

      {/* 4. LAYER: SVG INTERACTIONS */}
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          overflow: 'visible',
          zIndex: 10
        }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Country Labels */}
        {COUNTRY_LABELS.map((label, idx) => {
          const pt = projectPoint(label.lat, label.lng);
          return (
            <motion.g
              key={`label-${idx}`}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: idx * 0.5
              }}
            >
              <text
                x={pt.x}
                y={pt.y}
                fill="#000000"
                style={{
                  fontSize: '10px',
                  fontFamily: 'Outfit',
                  fontWeight: 800,
                  letterSpacing: '1.5px'
                }}
                textAnchor="middle"
              >
                {label.name}
              </text>
            </motion.g>
          );
        })}

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          const path = createCurvedPath(startPoint, endPoint);

          return (
            <g key={`path-group-${i}`}>
              {/* Static faint path */}
              <path
                d={path}
                fill="none"
                stroke={lineColor}
                strokeWidth="1.5"
                opacity="0.1"
              />

              {/* Fast moving shimmer line */}
              <motion.path
                d={path}
                fill="none"
                stroke={lineColor}
                strokeWidth="2"
                strokeDasharray="50, 400"
                initial={{ pathOffset: 0 }}
                animate={{ pathOffset: -1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.2
                }}
                opacity="0.6"
              />

              {/* Glowing Data Bead */}
              <motion.path
                d={path}
                fill="none"
                stroke={lineColor}
                strokeWidth="4"
                strokeDasharray="2, 600"
                initial={{ pathOffset: 0 }}
                animate={{ pathOffset: -1 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ filter: 'url(#glow)' }}
              />
            </g>
          );
        })}

        {dots.map((dot, i) => {
          const startPt = projectPoint(dot.start.lat, dot.start.lng);
          const endPt = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`points-group-${i}`}>
              <circle cx={startPt.x} cy={startPt.y} r="3" fill="#000000" />
              <circle cx={endPt.x} cy={endPt.y} r="3" fill="#000000" />

              {/* Intelligent Node Ping Animation */}
              <motion.circle
                cx={endPt.x} cy={endPt.y} r="3" fill={lineColor}
                animate={{
                  r: [3, 12, 3],
                  opacity: [0.8, 0, 0.8],
                  strokeWidth: [1, 4, 1]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ filter: 'url(#glow)' }}
              />
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
}
