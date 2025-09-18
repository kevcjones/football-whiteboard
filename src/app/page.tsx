'use client';

import React, { useState, useEffect } from 'react';
import { SoccerField } from '@/components/SoccerField';
import { Toolbar } from '@/components/Toolbar';
import { FrameToolbar } from '@/components/FrameToolbar';
import { FrameSetManager } from '@/components/FrameSetManager';
import { Player, Frame, FrameSet, Ball, Arrow } from '@/types';

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedTool, setSelectedTool] = useState<'move' | 'red-player' | 'blue-player' | 'delete' | 'ball' | 'arrow'>('move');

  // Initialize with first frame
  const [frames, setFrames] = useState<Frame[]>([{
    id: 'frame-1',
    name: 'Frame 1',
    players: [],
    cones: [],
    arrows: [],
    createdAt: new Date()
  }]);
  const [currentFrameId, setCurrentFrameId] = useState('frame-1');
  const [currentFrameSetId, setCurrentFrameSetId] = useState<string | undefined>(undefined);

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

  // Get current frame and ensure arrows array exists
  const currentFrame = frames.find(f => f.id === currentFrameId) || frames[0];
  const safeCurrentFrame = {
    ...currentFrame,
    arrows: currentFrame.arrows || []
  };

  const handlePlayerAdd = (x: number, y: number, team: 'red' | 'blue') => {
    const newPlayer: Player = {
      id: `player-${Date.now()}-${Math.random()}`,
      name: `Player ${safeCurrentFrame.players.length + 1}`,
      position: 'player',
      x,
      y,
      team,
      number: safeCurrentFrame.players.filter(p => p.team === team).length + 1
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
            ),
            // Update arrows attached to this player
            arrows: (frame.arrows || []).map(arrow =>
              arrow.attachedTo?.type === 'player' && arrow.attachedTo.id === id
                ? { ...arrow, startX: x, startY: y }
                : arrow
            )
          }
        : frame
    ));
  };

  const handlePlayerDelete = (id: string) => {
    setFrames(prev => prev.map(frame =>
      frame.id === currentFrameId
        ? {
            ...frame,
            players: frame.players.filter(player => player.id !== id),
            // Remove arrows attached to this player
            arrows: (frame.arrows || []).filter(arrow =>
              !(arrow.attachedTo?.type === 'player' && arrow.attachedTo.id === id)
            )
          }
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

  const handleFrameDelete = (frameId: string) => {
    if (frames.length <= 1) return; // Prevent deleting last frame

    setFrames(prev => prev.filter(frame => frame.id !== frameId));

    // If deleting current frame, switch to another frame
    if (currentFrameId === frameId) {
      const currentIndex = frames.findIndex(f => f.id === frameId);
      const nextFrame = frames[currentIndex + 1] || frames[currentIndex - 1] || frames[0];
      setCurrentFrameId(nextFrame.id);
    }
  };

  const handleFrameReorder = (newFrameIds: string[]) => {
    const reorderedFrames = newFrameIds.map(id => frames.find(f => f.id === id)!);
    setFrames(reorderedFrames);
  };

  const handleLoadFrameSet = (frameset: FrameSet) => {
    setFrames(frameset.frames);
    setCurrentFrameSetId(frameset.id);

    // Set current frame to first frame in the loaded set
    if (frameset.frames.length > 0) {
      setCurrentFrameId(frameset.frames[0].id);
    }
  };

  const handleFrameSetSaved = (frameset: FrameSet) => {
    setCurrentFrameSetId(frameset.id);
  };

  const handleBallPlace = (x: number, y: number) => {
    setFrames(prev => prev.map(frame =>
      frame.id === currentFrameId
        ? { ...frame, ball: { x, y } }
        : frame
    ));
  };

  const handleBallMove = (x: number, y: number) => {
    setFrames(prev => prev.map(frame =>
      frame.id === currentFrameId
        ? {
            ...frame,
            ball: { x, y },
            // Update arrows attached to the ball
            arrows: (frame.arrows || []).map(arrow =>
              arrow.attachedTo?.type === 'ball'
                ? { ...arrow, startX: x, startY: y }
                : arrow
            )
          }
        : frame
    ));
  };

  const handleArrowAdd = (arrow: Arrow) => {
    setFrames(prev => prev.map(frame =>
      frame.id === currentFrameId
        ? { ...frame, arrows: [...(frame.arrows || []), arrow] }
        : frame
    ));
  };

  const handleArrowMove = (id: string, startX: number, startY: number, endX: number, endY: number) => {
    setFrames(prev => prev.map(frame =>
      frame.id === currentFrameId
        ? {
            ...frame,
            arrows: (frame.arrows || []).map(arrow =>
              arrow.id === id ? { ...arrow, startX, startY, endX, endY } : arrow
            )
          }
        : frame
    ));
  };

  return (
    <div className="w-full h-screen bg-gray-100 overflow-hidden">
      <div className="flex flex-col h-full">
        <header className="bg-white shadow-sm p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Soccer Training Whiteboard</h1>
          {currentFrameSetId && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Current: </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {frames.find(() => true)?.name?.replace(/Frame \d+/, '') || 'Untitled Frameset'}
              </span>
            </div>
          )}
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
              players={safeCurrentFrame.players}
              ball={safeCurrentFrame.ball}
              arrows={safeCurrentFrame.arrows}
              selectedTool={selectedTool}
              onPlayerAdd={handlePlayerAdd}
              onPlayerMove={handlePlayerMove}
              onPlayerDelete={handlePlayerDelete}
              onBallPlace={handleBallPlace}
              onBallMove={handleBallMove}
              onArrowAdd={handleArrowAdd}
              onArrowMove={handleArrowMove}
            />
          </div>
        </main>

        {/* Frame Toolbar */}
        <FrameToolbar
          frames={frames}
          currentFrameId={currentFrameId}
          onFrameSelect={handleFrameSelect}
          onFrameAdd={handleFrameAdd}
          onFrameDelete={handleFrameDelete}
          onFrameReorder={handleFrameReorder}
        />

        {/* FrameSet Manager */}
        <FrameSetManager
          frames={frames}
          currentFrameSetId={currentFrameSetId}
          onLoadFrameSet={handleLoadFrameSet}
          onFrameSetSaved={handleFrameSetSaved}
        />
      </div>
    </div>
  );
}