'use client';

import React, { useState, useEffect } from 'react';
import { SoccerField } from '@/components/SoccerField';
import { Toolbar } from '@/components/Toolbar';
import { FrameToolbar } from '@/components/FrameToolbar';
import { Player, Frame } from '@/types';

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedTool, setSelectedTool] = useState<'move' | 'red-player' | 'blue-player' | 'delete'>('move');

  // Initialize with first frame
  const [frames, setFrames] = useState<Frame[]>([{
    id: 'frame-1',
    name: 'Frame 1',
    players: [],
    cones: [],
    createdAt: new Date()
  }]);
  const [currentFrameId, setCurrentFrameId] = useState('frame-1');

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

  // Get current frame
  const currentFrame = frames.find(f => f.id === currentFrameId) || frames[0];

  const handlePlayerAdd = (x: number, y: number, team: 'red' | 'blue') => {
    const newPlayer: Player = {
      id: `player-${Date.now()}-${Math.random()}`,
      name: `Player ${currentFrame.players.length + 1}`,
      position: 'player',
      x,
      y,
      team,
      number: currentFrame.players.filter(p => p.team === team).length + 1
    };

    setFrames(prev => prev.map(frame =>
      frame.id === currentFrameId
        ? { ...frame, players: [...frame.players, newPlayer] }
        : frame
    ));
  };

  const handlePlayerMove = (id: string, x: number, y: number) => {
    setFrames(prev => prev.map(frame =>
      frame.id === currentFrameId
        ? {
            ...frame,
            players: frame.players.map(player =>
              player.id === id ? { ...player, x, y } : player
            )
          }
        : frame
    ));
  };

  const handlePlayerDelete = (id: string) => {
    setFrames(prev => prev.map(frame =>
      frame.id === currentFrameId
        ? { ...frame, players: frame.players.filter(player => player.id !== id) }
        : frame
    ));
  };

  const handleFrameSelect = (frameId: string) => {
    setCurrentFrameId(frameId);
  };

  const handleFrameAdd = () => {
    const newFrameNumber = frames.length + 1;
    const newFrame: Frame = {
      id: `frame-${Date.now()}`,
      name: `Frame ${newFrameNumber}`,
      players: [...currentFrame.players], // Clone current frame's players
      cones: [...currentFrame.cones], // Clone current frame's cones
      createdAt: new Date()
    };

    setFrames(prev => [...prev, newFrame]);
    setCurrentFrameId(newFrame.id);
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
              players={currentFrame.players}
              selectedTool={selectedTool}
              onPlayerAdd={handlePlayerAdd}
              onPlayerMove={handlePlayerMove}
              onPlayerDelete={handlePlayerDelete}
            />
          </div>
        </main>

        {/* Frame Toolbar */}
        <FrameToolbar
          frames={frames}
          currentFrameId={currentFrameId}
          onFrameSelect={handleFrameSelect}
          onFrameAdd={handleFrameAdd}
        />
      </div>
    </div>
  );
}