import { FrameSet } from '@/types';

const STORAGE_KEY = 'soccerWhiteboard_framesets';

export const framesetStorage = {
  // Get all saved framesets
  getFrameSets(): FrameSet[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const framesets = JSON.parse(stored);
      // Convert date strings back to Date objects
      return framesets.map((fs: any) => ({
        ...fs,
        createdAt: new Date(fs.createdAt),
        updatedAt: new Date(fs.updatedAt),
        frames: fs.frames.map((frame: any) => ({
          ...frame,
          createdAt: new Date(frame.createdAt)
        }))
      }));
    } catch (error) {
      console.error('Error loading framesets:', error);
      return [];
    }
  },

  // Save a frameset
  saveFrameSet(frameset: FrameSet): void {
    if (typeof window === 'undefined') return;

    try {
      const framesets = this.getFrameSets();
      const existingIndex = framesets.findIndex(fs => fs.id === frameset.id);

      if (existingIndex >= 0) {
        // Update existing frameset
        framesets[existingIndex] = frameset;
      } else {
        // Add new frameset
        framesets.push(frameset);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(framesets));
    } catch (error) {
      console.error('Error saving frameset:', error);
    }
  },

  // Delete a frameset
  deleteFrameSet(framesetId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const framesets = this.getFrameSets();
      const filtered = framesets.filter(fs => fs.id !== framesetId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting frameset:', error);
    }
  },

  // Get a specific frameset by ID
  getFrameSet(framesetId: string): FrameSet | null {
    const framesets = this.getFrameSets();
    return framesets.find(fs => fs.id === framesetId) || null;
  }
};