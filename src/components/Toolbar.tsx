'use client';

import React from 'react';

interface ToolbarProps {
  selectedTool: 'move' | 'red-player' | 'blue-player' | 'delete' | 'ball';
  onToolSelect: (tool: 'move' | 'red-player' | 'blue-player' | 'delete' | 'ball') => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ selectedTool, onToolSelect }) => {
  const tools = [
    {
      id: 'move' as const,
      name: 'Move',
      icon: '👆',
      description: 'Select and move players'
    },
    {
      id: 'red-player' as const,
      name: 'Red Player',
      icon: '🔴',
      description: 'Place red team player'
    },
    {
      id: 'blue-player' as const,
      name: 'Blue Player',
      icon: '🔵',
      description: 'Place blue team player'
    },
    {
      id: 'delete' as const,
      name: 'Delete',
      icon: '🗑️',
      description: 'Delete players'
    },
    {
      id: 'ball' as const,
      name: 'Ball',
      icon: '⚽',
      description: 'Place or move the ball'
    }
  ];

  return (
    <div className="bg-white shadow-lg border-r border-gray-200 p-4 flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Tools</h3>

      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolSelect(tool.id)}
          className={`
            flex items-center gap-3 p-3 rounded-lg text-left transition-colors
            ${selectedTool === tool.id
              ? 'bg-blue-100 border-2 border-blue-300 text-blue-900'
              : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 text-gray-700'
            }
          `}
          title={tool.description}
        >
          <span className="text-xl">{tool.icon}</span>
          <span className="text-sm font-medium">{tool.name}</span>
        </button>
      ))}
    </div>
  );
};