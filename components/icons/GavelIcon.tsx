
import React from 'react';

const GavelIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
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
    className={className}
  >
    <path d="m14 13-8.5 8.5"></path>
    <path d="m11 10 1.5-1.5"></path>
    <path d="m15 6-1.5-1.5"></path>
    <path d="m9 12 2-2"></path>
    <path d="m13 8 2-2"></path>
    <path d="m22 2-3 1-7.5 7.5-1 1L4 21l-3-3 6.5-6.5L12 11l1-1 7.5-7.5 1-3z"></path>
  </svg>
);

export default GavelIcon;
