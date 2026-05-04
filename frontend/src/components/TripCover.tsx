import { type ReactNode } from 'react';

const PALETTES = [
  { from: '#FB923C', via: '#F472B6', to: '#A855F7' }, // sunset
  { from: '#22D3EE', via: '#3B82F6', to: '#6366F1' }, // ocean
  { from: '#34D399', via: '#14B8A6', to: '#0EA5E9' }, // tropic
  { from: '#A78BFA', via: '#EC4899', to: '#F97316' }, // twilight
  { from: '#FCD34D', via: '#F97316', to: '#E11D48' }, // desert
  { from: '#7DD3FC', via: '#6366F1', to: '#8B5CF6' }, // alpine
  { from: '#F472B6', via: '#FB7185', to: '#FB923C' }, // rose
  { from: '#34D399', via: '#22D3EE', to: '#3B82F6' }, // aurora
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

type Props = {
  seed: string;
  imageUrl?: string | null;
  className?: string;
  children?: ReactNode;
};

export function TripCover({ seed, imageUrl, className = '', children }: Props) {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10" />
        {children}
      </div>
    );
  }

  const hash = hashString(seed);
  const palette = PALETTES[hash % PALETTES.length];
  const variant = hash % 3;
  const sunOnLeft = ((hash >> 4) & 1) === 0;
  const sunStyle: React.CSSProperties = sunOnLeft ? { left: '8%' } : { right: '8%' };
  const sunGlowStyle: React.CSSProperties = sunOnLeft ? { left: '2%' } : { right: '2%' };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.via} 55%, ${palette.to} 100%)`,
      }}
    >
      {/* Soft sun glow */}
      <div
        className="pointer-events-none absolute h-48 w-48 rounded-full blur-3xl"
        style={{
          top: '-25%',
          ...sunGlowStyle,
          background: 'radial-gradient(circle, rgba(255,255,255,0.85), rgba(255,255,255,0) 70%)',
        }}
      />
      {/* Sun core */}
      <div
        className="pointer-events-none absolute h-12 w-12 rounded-full bg-white/75 shadow-[0_0_24px_8px_rgba(255,255,255,0.45)]"
        style={{ top: '14%', ...sunStyle }}
      />

      <Stars />

      {variant === 0 && <CitySilhouette />}
      {variant === 1 && <MountainSilhouette />}
      {variant === 2 && <BeachSilhouette palmOnLeft={sunOnLeft ? false : true} />}

      {/* Bottom darken for text contrast */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

      {children}
    </div>
  );
}

function Stars() {
  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMin slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    >
      <g fill="white">
        <circle cx="80" cy="28" r="1" />
        <circle cx="160" cy="18" r="1.4" />
        <circle cx="240" cy="38" r="0.9" />
        <circle cx="320" cy="22" r="1.5" />
        <circle cx="200" cy="60" r="0.9" />
        <circle cx="350" cy="55" r="1.1" />
        <circle cx="60" cy="72" r="1.1" />
        <circle cx="120" cy="50" r="0.7" />
        <circle cx="280" cy="68" r="0.9" />
      </g>
    </svg>
  );
}

function CitySilhouette() {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 h-[68%] w-full"
    >
      {/* Back layer */}
      <g fill="rgba(0,0,0,0.18)">
        <rect x="0" y="80" width="80" height="120" />
        <rect x="80" y="50" width="60" height="150" />
        <rect x="140" y="90" width="100" height="110" />
        <rect x="240" y="35" width="70" height="165" />
        <rect x="310" y="80" width="90" height="120" />
        <rect x="400" y="60" width="60" height="140" />
        <polygon points="460,60 490,28 520,60" />
        <rect x="490" y="60" width="30" height="140" />
        <rect x="520" y="80" width="80" height="120" />
        <rect x="600" y="45" width="70" height="155" />
        <rect x="670" y="90" width="90" height="110" />
        <rect x="760" y="38" width="60" height="162" />
        <rect x="820" y="80" width="100" height="120" />
        <rect x="920" y="60" width="70" height="140" />
        <rect x="990" y="90" width="80" height="110" />
        <rect x="1070" y="50" width="60" height="150" />
        <rect x="1130" y="80" width="70" height="120" />
      </g>
      {/* Window dots */}
      <g fill="rgba(255,255,255,0.5)">
        <rect x="22" y="100" width="3" height="3" />
        <rect x="42" y="100" width="3" height="3" />
        <rect x="22" y="120" width="3" height="3" />
        <rect x="42" y="140" width="3" height="3" />
        <rect x="262" y="80" width="3" height="3" />
        <rect x="282" y="80" width="3" height="3" />
        <rect x="282" y="100" width="3" height="3" />
        <rect x="262" y="120" width="3" height="3" />
        <rect x="622" y="90" width="3" height="3" />
        <rect x="642" y="90" width="3" height="3" />
        <rect x="622" y="110" width="3" height="3" />
        <rect x="780" y="80" width="3" height="3" />
        <rect x="800" y="80" width="3" height="3" />
        <rect x="780" y="100" width="3" height="3" />
      </g>
      {/* Front layer */}
      <g fill="rgba(0,0,0,0.34)">
        <rect x="0" y="130" width="120" height="70" />
        <rect x="120" y="110" width="80" height="90" />
        <rect x="200" y="140" width="100" height="60" />
        <polygon points="300,140 340,100 380,140" />
        <rect x="340" y="140" width="40" height="60" />
        <rect x="380" y="120" width="120" height="80" />
        <rect x="500" y="135" width="90" height="65" />
        <rect x="590" y="115" width="80" height="85" />
        <rect x="670" y="140" width="110" height="60" />
        <rect x="780" y="125" width="90" height="75" />
        <rect x="870" y="140" width="100" height="60" />
        <rect x="970" y="115" width="80" height="85" />
        <rect x="1050" y="140" width="80" height="60" />
        <rect x="1130" y="125" width="70" height="75" />
      </g>
    </svg>
  );
}

function MountainSilhouette() {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 h-3/4 w-full"
    >
      {/* Distant range */}
      <path
        d="M 0 200 L 0 100 L 100 38 L 220 86 L 340 30 L 460 78 L 600 22 L 720 70 L 840 32 L 960 78 L 1080 40 L 1200 70 L 1200 200 Z"
        fill="rgba(0,0,0,0.16)"
      />
      {/* Mid range */}
      <path
        d="M 0 200 L 0 130 L 80 78 L 200 122 L 320 60 L 440 110 L 580 70 L 700 122 L 840 80 L 960 132 L 1100 90 L 1200 122 L 1200 200 Z"
        fill="rgba(0,0,0,0.26)"
      />
      {/* Snow caps on mid range */}
      <g fill="rgba(255,255,255,0.6)">
        <path d="M 78 80 L 90 87 L 84 88 L 88 95 L 80 95 L 76 88 L 70 87 Z" />
        <path d="M 318 62 L 332 70 L 326 70 L 332 78 L 320 78 L 318 70 L 312 70 Z" />
        <path d="M 578 72 L 590 80 L 586 80 L 588 86 L 580 86 L 576 80 L 570 80 Z" />
        <path d="M 838 82 L 852 90 L 846 90 L 850 96 L 840 96 L 836 90 L 830 90 Z" />
        <path d="M 1098 92 L 1110 100 L 1106 100 L 1108 106 L 1100 106 L 1098 100 L 1092 100 Z" />
      </g>
      {/* Front ridge */}
      <path
        d="M 0 200 L 0 160 L 60 130 L 170 170 L 290 140 L 410 175 L 540 150 L 660 175 L 790 158 L 920 175 L 1050 152 L 1200 168 L 1200 200 Z"
        fill="rgba(0,0,0,0.36)"
      />
    </svg>
  );
}

function BeachSilhouette({ palmOnLeft }: { palmOnLeft: boolean }) {
  return (
    <>
      {/* Palm tree (fixed aspect ratio) */}
      <svg
        viewBox="0 0 100 200"
        preserveAspectRatio="xMidYMax meet"
        className={`pointer-events-none absolute bottom-1/3 ${palmOnLeft ? 'left-2' : 'right-2'} h-3/4 w-auto`}
      >
        <g fill="rgba(0,0,0,0.55)">
          {/* Trunk */}
          <path d="M 48 200 Q 50 130 53 110 L 56 110 Q 53 130 51 200 Z" />
          {/* Leaves */}
          <ellipse cx="52" cy="105" rx="40" ry="6" transform="rotate(-15, 52, 105)" />
          <ellipse cx="52" cy="105" rx="38" ry="5" transform="rotate(20, 52, 105)" />
          <ellipse cx="52" cy="105" rx="36" ry="5" transform="rotate(-50, 52, 105)" />
          <ellipse cx="52" cy="105" rx="34" ry="5" transform="rotate(55, 52, 105)" />
          <ellipse cx="52" cy="105" rx="28" ry="4" transform="rotate(-80, 52, 105)" />
          <ellipse cx="52" cy="105" rx="28" ry="4" transform="rotate(85, 52, 105)" />
          {/* Coconuts */}
          <circle cx="44" cy="116" r="2.5" />
          <circle cx="60" cy="116" r="2.5" />
        </g>
      </svg>
      {/* Waves */}
      <svg
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-2/5 w-full"
      >
        <path
          d="M 0 100 L 0 38 Q 100 18 200 38 T 400 38 T 600 38 T 800 38 T 1000 38 T 1200 38 L 1200 100 Z"
          fill="rgba(255,255,255,0.18)"
        />
        <path
          d="M 0 100 L 0 64 Q 100 48 200 64 T 400 64 T 600 64 T 800 64 T 1000 64 T 1200 64 L 1200 100 Z"
          fill="rgba(0,0,0,0.22)"
        />
      </svg>
    </>
  );
}
