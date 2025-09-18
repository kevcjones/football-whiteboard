'use client';

import React from 'react';
import { Frame } from '@/types';

interface FrameToolbarProps {
  frames: Frame[];
  currentFrameId: string;
  onFrameSelect: (frameId: string) => void;
  onFrameAdd: () => void;
}

export const FrameToolbar: React.FC<FrameToolbarProps> = ({
  frames,
  currentFrameId,
  onFrameSelect,
  onFrameAdd
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg border border-gray-200 p-2">
      <div className="flex items-center gap-2">
        {/* Frame buttons */}
        {frames.map((frame, index) => (
          <button
            key={frame.id}
            onClick={() => onFrameSelect(frame.id)}
            className={`
              flex items-center justify-center w-12 h-8 rounded text-sm font-medium transition-colors
              ${currentFrameId === frame.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            title={frame.name}
          >
            {index + 1}
          </button>
        ))}

        {/* Add frame button */}
        <button
          onClick={onFrameAdd}
          className="flex items-center justify-center w-12 h-8 rounded bg-green-500 text-white hover:bg-green-600 transition-colors ml-2"
          title="Add new frame (clone current)"
        >
          <span className="text-lg font-bold">+</span>
        </button>
      </div>

      {/* Frame info */}
      <div className="text-xs text-gray-500 text-center mt-1">
        Frame {frames.findIndex(f => f.id === currentFrameId) + 1} of {frames.length}
      </div>
    </div>
  );
};