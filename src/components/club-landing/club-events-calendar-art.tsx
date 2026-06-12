/** Ilustración de calendario 3D estilizada — sin dependencias externas */
export function ClubEventsCalendarArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <title>Ilustración de calendario</title>
      <ellipse cx="160" cy="248" rx="100" ry="14" fill="rgba(21,38,61,0.08)" />
      <rect
        x="52"
        y="48"
        width="216"
        height="188"
        rx="28"
        fill="url(#calBody)"
        stroke="#1B4F8A"
        strokeWidth="3"
      />
      <rect x="52" y="48" width="216" height="52" rx="28" fill="#1B4F8A" />
      <rect x="52" y="76" width="216" height="24" fill="#1B4F8A" />
      <circle cx="92" cy="62" r="8" fill="#FF9900" />
      <circle cx="228" cy="62" r="8" fill="#FF9900" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect
            x={72 + (i % 3) * 56}
            y={108 + Math.floor(i / 3) * 44}
            width="40"
            height="32"
            rx="8"
            fill={i === 2 ? "#FF9900" : "rgba(255,248,240,0.95)"}
            stroke={i === 2 ? "#F9AD6B" : "#CED7E3"}
            strokeWidth="1.5"
          />
          {i === 2 ? (
            <text
              x={92 + (i % 3) * 56}
              y={128 + Math.floor(i / 3) * 44}
              textAnchor="middle"
              fill="#15263D"
              fontSize="14"
              fontWeight="700"
            >
              5
            </text>
          ) : null}
        </g>
      ))}
      <circle cx="248" cy="210" r="36" fill="url(#awsDisc)" stroke="#CED7E3" strokeWidth="2" />
      <text
        x="248"
        y="218"
        textAnchor="middle"
        fill="#FF9900"
        fontSize="18"
        fontWeight="800"
        fontFamily="system-ui,sans-serif"
      >
        aws
      </text>
      <defs>
        <linearGradient id="calBody" x1="52" y1="48" x2="268" y2="236">
          <stop stopColor="#FFF8F0" />
          <stop offset="1" stopColor="#DDEAF6" />
        </linearGradient>
        <linearGradient id="awsDisc" x1="212" y1="174" x2="284" y2="246">
          <stop stopColor="#FFF8F0" />
          <stop offset="1" stopColor="#EAF3FB" />
        </linearGradient>
      </defs>
    </svg>
  );
}
