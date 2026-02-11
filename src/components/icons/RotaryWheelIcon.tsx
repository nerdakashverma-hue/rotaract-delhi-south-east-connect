import { type SVGProps } from "react";

export function RotaryWheelIcon(props: SVGProps<SVGSVGElement> & { size?: number }) {
  const { size = 24, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {/* Outer circle */}
      <circle cx="12" cy="12" r="10" />
      {/* Inner circle */}
      <circle cx="12" cy="12" r="4" />
      {/* Gear teeth / spokes */}
      <line x1="12" y1="2" x2="12" y2="8" />
      <line x1="12" y1="16" x2="12" y2="22" />
      <line x1="2" y1="12" x2="8" y2="12" />
      <line x1="16" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="8.88" y2="8.88" />
      <line x1="15.12" y1="15.12" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="8.88" y2="15.12" />
      <line x1="15.12" y1="8.88" x2="19.07" y2="4.93" />
    </svg>
  );
}
