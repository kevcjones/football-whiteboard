'use client';

import React, { useState } from 'react';
import { Frame } from '@/types';

interface FrameToolbarProps {
  frames: Frame[];
  currentFrameId: string;
  onFrameSelect: (frameId: string) => void;
  onFrameAdd: () => void;
  onFrameDelete: (frameId: string) => void;
  onFrameReorder: (frameIds: string[]) => void;
}

export const FrameToolbar: React.FC<FrameToolbarProps> = ({
  frames,
  currentFrameId,
  onFrameSelect,
  onFrameAdd,
  onFrameDelete,
  onFrameReorder
}) => {
  const [draggedFrame, setDraggedFrame] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, frameId: string) => {
    setDraggedFrame(frameId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetFrameId: string) => {
    e.preventDefault();
    if (draggedFrame && draggedFrame !== targetFrameId) {
      const draggedIndex = frames.findIndex(f => f.id === draggedFrame);
      const targetIndex = frames.findIndex(f => f.id === targetFrameId);

      const newFrames = [...frames];
      const [removed] = newFrames.splice(draggedIndex, 1);
      newFrames.splice(targetIndex, 0, removed);

      onFrameReorder(newFrames.map(f => f.id));
    }
    setDraggedFrame(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, frameId: string) => {
    e.stopPropagation();
    if (frames.length === 1) {
      alert('Cannot delete the last frame');
      return;
    }
    setShowDeleteConfirm(frameId);
  };

  const confirmDelete = (frameId: string) => {
    onFrameDelete(frameId);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Frame buttons - smaller and more compact */}
          {frames.map((frame, index) => (
            <div
              key={frame.id}
              className="relative group"
              draggable
              onDragStart={(e) => handleDragStart(e, frame.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, frame.id)}
            >
              <button
                onClick={() => onFrameSelect(frame.id)}
                className={`
                  flex items-center justify-center w-8 h-6 rounded text-xs font-medium transition-colors cursor-pointer
                  ${currentFrameId === frame.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                  ${draggedFrame === frame.id ? 'opacity-50' : ''}
                `}
                title={`${frame.name} - Drag to reorder`}
              >
                {index + 1}
              </button>

              {/* Delete button (appears on hover) */}
              {frames.length > 1 && (
                <button
                  onClick={(e) => handleDeleteClick(e, frame.id)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Delete frame"
                >
                  ×
                </button>
              )}

              {/* Delete confirmation - positioned above the button */}
              {showDeleteConfirm === frame.id && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10">
                  <p className="text-xs text-gray-700 mb-2">Delete frame {index + 1}?</p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => confirmDelete(frame.id)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add frame button */}
          <button
            onClick={onFrameAdd}
            className="flex items-center justify-center w-8 h-6 rounded bg-green-500 text-white hover:bg-green-600 transition-colors ml-1"
            title="Add new frame (clone current)"
          >
            <span className="text-sm font-bold">+</span>
          </button>
        </div>

        {/* Frame info - moved to the right */}
        <div className="text-xs text-gray-500">
          Frame {frames.findIndex(f => f.id === currentFrameId) + 1} of {frames.length}
        </div>
      </div>
    </div>
  );
};