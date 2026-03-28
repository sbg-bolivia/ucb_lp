import type React from "react";

interface LanguagesIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function LanguagesIcon({ size = 24, ...props }: LanguagesIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <title>Languages Icon</title>
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g id="SVGRepo_iconCarrier">
        <defs>
          <style>
            {
              ".cls-1 { fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; }"
            }
          </style>
        </defs>
        <line className="cls-1" x1="12.62" y1="24.31" x2="17.94" y2="11.42" />
        <line className="cls-1" x1="23.04" y1="24.35" x2="17.94" y2="11.42" />
        <line className="cls-1" x1="21.34" y1="20.02" x2="14.39" y2="20.02" />
        <g>
          <line className="cls-1" x1="32.63" y1="25.38" x2="39.35" y2="25.38" />
          <path
            className="cls-1"
            d="M35.68,25.38c0,4.34-5.29,11.51-10.59,12.61"
          />
          <path
            className="cls-1"
            d="M27.93,32.79c2.13,2.4,5.61,4.74,8.82,5.2"
          />
        </g>
        <rect
          className="cls-1"
          x="5.5"
          y="5.5"
          width="24.67"
          height="24.67"
          rx="3.64"
          ry="3.64"
        />
        <path
          className="cls-1"
          d="M17.83,30.17v8.69c0,2,1.64,3.64,3.64,3.64h17.38c2,0,3.64-1.64,3.64-3.64V21.47c0-2-1.64-3.64-3.64-3.64h-8.69"
        />
      </g>
    </svg>
  );
}
