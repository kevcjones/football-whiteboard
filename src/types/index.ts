export interface Player {
  id: string;
  name: string;
  position: string;
  x: number;
  y: number;
  number?: number;
  team: 'red' | 'blue';
}

export interface Cone {
  id: string;
  x: number;
  y: number;
  color: string;
}

export interface Ball {
  x: number;
  y: number;
}

export interface Drill {
  id: string;
  name: string;
  players: Player[];
  cones: Cone[];
  description?: string;
}

export interface Frame {
  id: string;
  name: string;
  players: Player[];
  cones: Cone[];
  ball?: Ball;
  createdAt: Date;
}

export interface FrameSet {
  id: string;
  name: string;
  frames: Frame[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WhiteboardState {
  frames: Frame[];
  currentFrameId: string;
  currentFrameSetId?: string;
  selectedDrill?: Drill;
  isDrawing: boolean;
  selectedTool: 'move' | 'red-player' | 'blue-player' | 'delete' | 'ball';
}