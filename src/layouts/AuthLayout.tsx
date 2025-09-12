import React from 'react';
import LiquidEther from '../components/LiquidEther/LiquidEther';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <div className="absolute inset-0 z-0">
  <LiquidEther
    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
    mouseForce={15}
    cursorSize={80}
    isViscous={false}
    viscous={15}
    iterationsViscous={12}
    iterationsPoisson={12}
    resolution={0.25}
    isBounce={false}
    autoDemo={false}
    autoSpeed={0.3}
    autoIntensity={1.0}
    takeoverDuration={0.25}
    autoResumeDelay={3000}
    autoRampDuration={0.3}
  />
</div>

      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
