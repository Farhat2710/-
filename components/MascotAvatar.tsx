
import React from 'react';

interface MascotAvatarProps {
  isSpeaking: boolean;
  className?: string;
  onClick?: () => void;
}

const MascotAvatar: React.FC<MascotAvatarProps> = ({ isSpeaking, className, onClick }) => {
  return (
    <div 
      className={`relative cursor-pointer transition-transform duration-300 hover:scale-105 ${className}`}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 200 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(255,107,0,0.5)]"
      >
        {/* Hair - Fire/Aurora Style */}
        <path
          d="M60 120 C60 120 40 20 80 10 C80 10 90 70 110 50 C110 50 125 0 145 20 C145 20 135 120 135 120 L60 120"
          fill="#FF6B00"
          stroke="black"
          strokeWidth="6"
          className={isSpeaking ? "animate-pulse" : ""}
        />
        <path
          d="M70 120 C70 120 55 50 85 45 C85 45 95 90 115 75 C115 75 125 40 135 55 C135 55 125 120 125 120 L70 120"
          fill="#FF9A00"
          stroke="black"
          strokeWidth="4"
        />

        {/* Head */}
        <circle cx="100" cy="150" r="50" fill="#FFE4D1" stroke="black" strokeWidth="6" />
        
        {/* Face */}
        <circle cx="85" cy="145" r="4" fill="black" /> {/* Left eye */}
        <circle cx="115" cy="145" r="4" fill="black" /> {/* Right eye */}
        <path d="M100 140 L100 160" stroke="black" strokeWidth="3" strokeLinecap="round" /> {/* Nose */}
        
        {/* Mouth - Animated if speaking */}
        {isSpeaking ? (
          <ellipse cx="100" cy="175" rx="8" ry="4" fill="black" className="animate-bounce" />
        ) : (
          <path d="M90 175 Q100 185 110 175" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}

        {/* Neck & Collar */}
        <rect x="90" y="200" width="20" height="20" fill="#FFE4D1" stroke="black" strokeWidth="6" />
        <path d="M75 220 Q100 240 125 220" fill="white" stroke="black" strokeWidth="4" />

        {/* Dress */}
        <path
          d="M50 220 L150 220 L170 360 L30 360 Z"
          fill="#FFD700"
          stroke="black"
          strokeWidth="6"
        />
        {/* Wavy patterns on dress */}
        <path
          d="M40 300 Q100 280 160 300 L165 330 Q100 310 35 330 Z"
          fill="#FF8A00"
          stroke="black"
          strokeWidth="3"
        />
        
        {/* Arms */}
        <path d="M50 230 L20 280" stroke="#FFE4D1" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 230 L20 280" stroke="black" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" className="-z-10" />
        
        <path d="M150 230 L180 280" stroke="#FFE4D1" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M150 230 L180 280" stroke="black" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" className="-z-10" />

        {/* Legs & Shoes */}
        <rect x="75" y="360" width="15" height="20" fill="#FFE4D1" stroke="black" strokeWidth="6" />
        <rect x="110" y="360" width="15" height="20" fill="#FFE4D1" stroke="black" strokeWidth="6" />
        <path d="M65 380 L90 380 L95 395 L60 395 Z" fill="#FFD700" stroke="black" strokeWidth="4" />
        <path d="M110 380 L135 380 L140 395 L105 395 Z" fill="#FFD700" stroke="black" strokeWidth="4" />
      </svg>
      
      {/* Decorative Aura */}
      <div className="absolute inset-0 -z-10 bg-orange-500/10 blur-2xl rounded-full scale-110"></div>
    </div>
  );
};

export default MascotAvatar;
