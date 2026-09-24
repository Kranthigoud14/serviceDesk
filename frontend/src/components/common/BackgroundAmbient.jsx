import React from 'react';

export default function BackgroundAmbient({ variant = 'default' }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base Operational Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      {/* Radial glow at the top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-glow opacity-80" />

      {/* Floating Ambient Orbs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl animate-float-slow"
      />
      <div
        className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-float-reverse"
      />
      {variant === 'workforce' && (
        <div
          className="absolute bottom-10 left-1/3 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl animate-float-slow"
        />
      )}
      {variant === 'auth' && (
        <div
          className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] rounded-full bg-blue-500/10 blur-3xl animate-float-slow"
        />
      )}
    </div>
  );
}

