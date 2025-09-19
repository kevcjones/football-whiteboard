'use client';

import React, { useState } from 'react';
import { Formation, formations, getFormationsByPlayerCount } from '@/lib/formations';

interface FormationSelectorProps {
  onFormationSelect: (formation: Formation, team: 'red' | 'blue') => void;
  isOpen: boolean;
  onClose: () => void;
}

export const FormationSelector: React.FC<FormationSelectorProps> = ({
  onFormationSelect,
  isOpen,
  onClose,
}) => {
  const [selectedPlayerCount, setSelectedPlayerCount] = useState<number>(11);
  const [selectedTeam, setSelectedTeam] = useState<'red' | 'blue'>('red');

  const availablePlayerCounts = [...new Set(formations.map(f => f.playerCount))].sort();
  const availableFormations = getFormationsByPlayerCount(selectedPlayerCount);

  const handleFormationClick = (formation: Formation) => {
    onFormationSelect(formation, selectedTeam);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Quick Formation Setup</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Team Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Team
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTeam('red')}
              className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${
                selectedTeam === 'red'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">🔴</span>
              Red Team
            </button>
            <button
              onClick={() => setSelectedTeam('blue')}
              className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${
                selectedTeam === 'blue'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">🔵</span>
              Blue Team
            </button>
          </div>
        </div>

        {/* Player Count Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Player Count
          </label>
          <div className="flex gap-2 flex-wrap">
            {availablePlayerCounts.map(count => (
              <button
                key={count}
                onClick={() => setSelectedPlayerCount(count)}
                className={`px-3 py-2 rounded transition-colors ${
                  selectedPlayerCount === count
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {count}v{count}
              </button>
            ))}
          </div>
        </div>

        {/* Formation Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Formation
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableFormations.map(formation => (
              <button
                key={formation.id}
                onClick={() => handleFormationClick(formation)}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="font-semibold text-gray-800 mb-1">
                  {formation.name}
                </div>
                <div className="text-sm text-gray-600">
                  {formation.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {availableFormations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No formations available for {selectedPlayerCount}v{selectedPlayerCount}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> This will replace all existing {selectedTeam} team players with the selected formation.
          </p>
        </div>
      </div>
    </div>
  );
};