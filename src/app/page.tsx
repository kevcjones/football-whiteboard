'use client';

import React, { useState, useEffect } from 'react';
import { SoccerField } from '@/components/SoccerField';
import { Toolbar } from '@/components/Toolbar';
import { Player } from '@/types';

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedTool, setSelectedTool] = useState<'move' | 'red-player' | 'blue-player'>('move');

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

  const handlePlayerAdd = (x: number, y: number, team: 'red' | 'blue') => {
    const newPlayer: Player = {
      id: `player-${Date.now()}-${Math.random()}`,
      name: `Player ${players.length + 1}`,
      position: 'player',
      x,
      y,
      team,
      number: players.filter(p => p.team === team).length + 1
    };
    setPlayers(prev => [...prev, newPlayer]);
  };

  const handlePlayerMove = (id: string, x: number, y: number) => {
    setPlayers(prev => prev.map(player =>
      player.id === id ? { ...player, x, y } : player
    ));
  };

  return (
    <div className="w-full h-screen bg-gray-100 overflow-hidden">
      <div className="flex flex-col h-full">
        <header className="bg-white shadow-sm p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Soccer Training Whiteboard</h1>
        </header>

        <main className="flex-1 flex">
          <Toolbar
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />
          <div className="flex-1">
            <SoccerField
              width={dimensions.width - 200}
              height={dimensions.height - 80}
              players={players}
              selectedTool={selectedTool}
              onPlayerAdd={handlePlayerAdd}
              onPlayerMove={handlePlayerMove}
            />
          </div>
        </main>
      </div>
    </div>
  );
}