import React from "react";

type DynamicSvgProps = {
  fillColor1?: string;
  strokeColor1?: string;
  fillColor2?: string;
  strokeColor2?: string;
};

const AgreementHeadImg: React.FC<DynamicSvgProps> = ({
  fillColor1 = "#11B1ED",
  strokeColor1 = "#1FB2EC",
  fillColor2 = "#0FAFEB",
  strokeColor2 = "#11B2ED",
}) => (
  <svg
    viewBox="0 0 1511 290"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full"
  >
    <g filter="url(#filter0)">
      <path
        d="M116 97.5L11 7.5L461 7L531.5 101.5L116 97.5Z"
        fill={fillColor1}
        stroke={strokeColor1}
      />
    </g>
    <g filter="url(#filter1)">
      <path
        d="M663.5 279L460 7H1502V279H663.5Z"
        fill={fillColor2}
        stroke={strokeColor2}
      />
    </g>
    <defs>
      <filter
        id="filter0"
        x="0.649902"
        y="0.5"
        width="538.854"
        height="111.508"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="-1" dy="2" />
        <feGaussianBlur stdDeviation="4" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
      <filter
        id="filter1"
        x="451.001"
        y="0.5"
        width="1059.5"
        height="289"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="4" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export default AgreementHeadImg;
