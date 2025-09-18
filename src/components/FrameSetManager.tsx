"use client";

import React, { useState, useEffect } from "react";
import { Frame, FrameSet } from "@/types";
import { framesetStorage } from "@/lib/framesetStorage";

interface FrameSetManagerProps {
  frames: Frame[];
  currentFrameSetId?: string;
  onLoadFrameSet: (frameset: FrameSet) => void;
  onFrameSetSaved: (frameset: FrameSet) => void;
}

export const FrameSetManager: React.FC<FrameSetManagerProps> = ({
  frames,
  currentFrameSetId,
  onLoadFrameSet,
  onFrameSetSaved,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [savedFrameSets, setSavedFrameSets] = useState<FrameSet[]>([]);
  const [saveMode, setSaveMode] = useState<"new" | "overwrite" | null>(null);
  const [newFrameSetName, setNewFrameSetName] = useState("");
  const [selectedFrameSetId, setSelectedFrameSetId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      loadFrameSets();
    }
  }, [isOpen]);

  const loadFrameSets = () => {
    const framesets = framesetStorage.getFrameSets();
    setSavedFrameSets(framesets);
  };

  const handleSaveNew = () => {
    if (!newFrameSetName.trim()) return;

    const newFrameSet: FrameSet = {
      id: `frameset-${Date.now()}`,
      name: newFrameSetName.trim(),
      frames: frames.map((frame) => ({ ...frame })), // Deep clone frames
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    framesetStorage.saveFrameSet(newFrameSet);
    onFrameSetSaved(newFrameSet);
    loadFrameSets();
    setSaveMode(null);
    setNewFrameSetName("");
  };

  const handleOverwrite = () => {
    if (!selectedFrameSetId) return;

    const existingFrameSet = savedFrameSets.find(
      (fs) => fs.id === selectedFrameSetId
    );
    if (!existingFrameSet) return;

    const updatedFrameSet: FrameSet = {
      ...existingFrameSet,
      frames: frames.map((frame) => ({ ...frame })), // Deep clone frames
      updatedAt: new Date(),
    };

    framesetStorage.saveFrameSet(updatedFrameSet);
    onFrameSetSaved(updatedFrameSet);
    loadFrameSets();
    setSaveMode(null);
    setSelectedFrameSetId(null);
  };

  const handleLoad = (frameset: FrameSet) => {
    onLoadFrameSet(frameset);
    setIsOpen(false);
  };

  const handleDelete = (framesetId: string) => {
    if (confirm("Are you sure you want to delete this frameset?")) {
      framesetStorage.deleteFrameSet(framesetId);
      loadFrameSets();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
      >
        💾 Manage Framesets
      </button>
    );
  }

  return (
    <div className="fixed inset-0 text-gray-900 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Frameset Manager</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Save Options */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Save Current Frames</h3>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setSaveMode("new")}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              Save as New
            </button>
            {currentFrameSetId && (
              <button
                onClick={() => setSaveMode("overwrite")}
                className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
              >
                Overwrite Current
              </button>
            )}
          </div>

          {/* Save New Form */}
          {saveMode === "new" && (
            <div className="border rounded p-3 bg-gray-50">
              <input
                type="text"
                placeholder="Enter frameset name..."
                value={newFrameSetName}
                onChange={(e) => setNewFrameSetName(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                onKeyPress={(e) => e.key === "Enter" && handleSaveNew()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNew}
                  disabled={!newFrameSetName.trim()}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setSaveMode(null)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Overwrite Confirmation */}
          {saveMode === "overwrite" && (
            <div className="border rounded p-3 bg-gray-50">
              <p className="text-sm mb-2 text-black">
                Overwrite the current frameset?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleOverwrite}
                  className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                >
                  Yes, Overwrite
                </button>
                <button
                  onClick={() => setSaveMode(null)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Saved Framesets List */}
        <div>
          <h3 className="font-semibold mb-2">
            Saved Framesets ({savedFrameSets.length})
          </h3>
          {savedFrameSets.length === 0 ? (
            <p className="text-gray-900 text-sm">No saved framesets yet.</p>
          ) : (
            <div className="space-y-2">
              {savedFrameSets.map((frameset) => (
                <div
                  key={frameset.id}
                  className={`border rounded p-3 ${
                    frameset.id === currentFrameSetId
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{frameset.name}</h4>
                      <p className="text-xs text-gray-900">
                        {frameset.frames.length} frames •{" "}
                        {frameset.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => handleLoad(frameset)}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(frameset.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
