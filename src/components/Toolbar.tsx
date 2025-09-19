'use client';

import React from 'react';

interface ToolbarProps {
  selectedTool: 'move' | 'red-player' | 'blue-player' | 'delete' | 'ball' | 'arrow';
  onToolSelect: (tool: 'move' | 'red-player' | 'blue-player' | 'delete' | 'ball' | 'arrow') => void;
  onClearFrame?: () => void;
  onFormationOpen?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ selectedTool, onToolSelect, onClearFrame, onFormationOpen }) => {
  const tools = [
    {
      id: 'move' as const,
      name: 'Move',
      icon: '✋',
      shortcut: 'M',
      description: 'Select and move players (M)'
    },
    {
      id: 'red-player' as const,
      name: 'Red Player',
      icon: '🔴',
      shortcut: 'R',
      description: 'Place red team player (R)'
    },
    {
      id: 'blue-player' as const,
      name: 'Blue Player',
      icon: '🔵',
      shortcut: 'B',
      description: 'Place blue team player (B)'
    },
    {
      id: 'delete' as const,
      name: 'Delete',
      icon: '🗑️',
      shortcut: 'D',
      description: 'Delete players (D)'
    },
    {
      id: 'ball' as const,
      name: 'Ball',
      icon: '⚽',
      shortcut: 'S',
      description: 'Place or move the ball (S)'
    },
    {
      id: 'arrow' as const,
      name: 'Arrow',
      icon: '↗️',
      shortcut: 'L',
      description: 'Draw movement arrows (L). Hold Cmd/Ctrl for multi-segment curved arrows'
    }
  ];

  return (
    <div className="bg-white shadow-lg border-r border-gray-200 p-3 flex flex-col h-full">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Tools</h3>
        <p className="text-xs text-gray-500">Shortcuts available</p>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-1.5">

      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolSelect(tool.id)}
          className={`
            flex items-center gap-2 p-2 rounded text-left transition-colors
            ${selectedTool === tool.id
              ? 'bg-blue-100 border border-blue-300 text-blue-900'
              : 'bg-gray-50 border border-transparent hover:bg-gray-100 text-gray-700'
            }
          `}
          title={tool.description}
        >
          <span className="text-lg">{tool.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium truncate">{tool.name}</span>
              <kbd className="ml-1 px-1 py-0.5 bg-gray-200 rounded text-xs font-mono">
                {tool.shortcut}
              </kbd>
            </div>
          </div>
        </button>
      ))}
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 pt-2 space-y-1">
        {/* Clear Frame Button */}
        {onClearFrame && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all players, ball, and arrows from this frame?')) {
                onClearFrame();
              }
            }}
            className="w-full flex items-center gap-2 p-2 rounded text-left transition-colors bg-red-50 border border-red-200 hover:bg-red-100 text-red-700"
            title="Clear all elements from the current frame"
          >
            <span className="text-lg">🧹</span>
            <span className="text-xs font-medium">Clear</span>
          </button>
        )}

        {/* Formation Setup Button */}
        {onFormationOpen && (
          <button
            onClick={onFormationOpen}
            className="w-full flex items-center gap-2 p-2 rounded text-left transition-colors bg-green-50 border border-green-200 hover:bg-green-100 text-green-700"
            title="Quick formation setup"
          >
            <span className="text-lg">⚽</span>
            <span className="text-xs font-medium">Formation</span>
          </button>
        )}
      </div>
    </div>
  );
};