'use client';

import React, { useState, useEffect } from 'react';
import { SoccerField } from '@/components/SoccerField';

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="w-full h-screen bg-gray-100 overflow-hidden">
      <div className="flex flex-col h-full">
        <header className="bg-white shadow-sm p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Soccer Training Whiteboard</h1>
        </header>

        <main className="flex-1 relative">
          <SoccerField
            width={dimensions.width}
            height={dimensions.height - 80}
          />
        </main>
      </div>
    </div>
  );
}