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

export interface Drill {
  id: string;
  name: string;
  players: Player[];
  cones: Cone[];
  description?: string;
}

export interface WhiteboardState {
  players: Player[];
  cones: Cone[];
  selectedDrill?: Drill;
  isDrawing: boolean;
  selectedTool: 'move' | 'red-player' | 'blue-player';
}