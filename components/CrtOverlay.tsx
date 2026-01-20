
import React from 'react';

const CrtOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 z-50 pointer-events-none pointer-events-none">
      {/* Scanline pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 6px 100%'
        }} 
      />
      {/* CRT curvature / vignette effect */}
      <div 
        className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.3) 100%)'
        }}
      />
    </div>
  );
};

export default CrtOverlay;
