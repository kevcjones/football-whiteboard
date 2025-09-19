import { Player } from '@/types';

export interface Formation {
  id: string;
  name: string;
  description: string;
  playerCount: number;
  positions: {
    x: number; // Percentage of field width (0-1)
    y: number; // Percentage of field height (0-1)
    position: string;
  }[];
}

export const formations: Formation[] = [
  // 7v7 Formations
  {
    id: '7v7-1-2-3-1',
    name: '1-2-3-1',
    description: '7v7: GK, 2 defenders, 3 midfielders, 1 forward',
    playerCount: 7,
    positions: [
      { x: 0.1, y: 0.5, position: 'GK' },      // Goalkeeper
      { x: 0.25, y: 0.3, position: 'CB' },     // Left CB
      { x: 0.25, y: 0.7, position: 'CB' },     // Right CB
      { x: 0.45, y: 0.2, position: 'LM' },     // Left Mid
      { x: 0.45, y: 0.5, position: 'CM' },     // Center Mid
      { x: 0.45, y: 0.8, position: 'RM' },     // Right Mid
      { x: 0.7, y: 0.5, position: 'ST' },      // Striker
    ],
  },
  {
    id: '7v7-1-3-2-1',
    name: '1-3-2-1',
    description: '7v7: GK, 3 defenders, 2 midfielders, 1 forward',
    playerCount: 7,
    positions: [
      { x: 0.1, y: 0.5, position: 'GK' },      // Goalkeeper
      { x: 0.25, y: 0.25, position: 'LB' },    // Left Back
      { x: 0.25, y: 0.5, position: 'CB' },     // Center Back
      { x: 0.25, y: 0.75, position: 'RB' },    // Right Back
      { x: 0.5, y: 0.35, position: 'CM' },     // Left CM
      { x: 0.5, y: 0.65, position: 'CM' },     // Right CM
      { x: 0.7, y: 0.5, position: 'ST' },      // Striker
    ],
  },

  // 11v11 Formations
  {
    id: '11v11-4-4-2',
    name: '4-4-2',
    description: '11v11: GK, 4 defenders, 4 midfielders, 2 forwards',
    playerCount: 11,
    positions: [
      { x: 0.05, y: 0.5, position: 'GK' },     // Goalkeeper
      { x: 0.2, y: 0.15, position: 'LB' },     // Left Back
      { x: 0.2, y: 0.38, position: 'CB' },     // Left CB
      { x: 0.2, y: 0.62, position: 'CB' },     // Right CB
      { x: 0.2, y: 0.85, position: 'RB' },     // Right Back
      { x: 0.45, y: 0.15, position: 'LM' },    // Left Mid
      { x: 0.45, y: 0.38, position: 'CM' },    // Left CM
      { x: 0.45, y: 0.62, position: 'CM' },    // Right CM
      { x: 0.45, y: 0.85, position: 'RM' },    // Right Mid
      { x: 0.7, y: 0.4, position: 'ST' },      // Left Striker
      { x: 0.7, y: 0.6, position: 'ST' },      // Right Striker
    ],
  },
  {
    id: '11v11-4-3-3',
    name: '4-3-3',
    description: '11v11: GK, 4 defenders, 3 midfielders, 3 forwards',
    playerCount: 11,
    positions: [
      { x: 0.05, y: 0.5, position: 'GK' },     // Goalkeeper
      { x: 0.2, y: 0.15, position: 'LB' },     // Left Back
      { x: 0.2, y: 0.38, position: 'CB' },     // Left CB
      { x: 0.2, y: 0.62, position: 'CB' },     // Right CB
      { x: 0.2, y: 0.85, position: 'RB' },     // Right Back
      { x: 0.45, y: 0.3, position: 'CM' },     // Left CM
      { x: 0.45, y: 0.5, position: 'CDM' },    // CDM
      { x: 0.45, y: 0.7, position: 'CM' },     // Right CM
      { x: 0.7, y: 0.2, position: 'LW' },      // Left Wing
      { x: 0.7, y: 0.5, position: 'ST' },      // Striker
      { x: 0.7, y: 0.8, position: 'RW' },      // Right Wing
    ],
  },
  {
    id: '11v11-3-5-2',
    name: '3-5-2',
    description: '11v11: GK, 3 defenders, 5 midfielders, 2 forwards',
    playerCount: 11,
    positions: [
      { x: 0.05, y: 0.5, position: 'GK' },     // Goalkeeper
      { x: 0.2, y: 0.3, position: 'CB' },      // Left CB
      { x: 0.2, y: 0.5, position: 'CB' },      // Center CB
      { x: 0.2, y: 0.7, position: 'CB' },      // Right CB
      { x: 0.35, y: 0.1, position: 'LWB' },    // Left Wing Back
      { x: 0.45, y: 0.35, position: 'CM' },    // Left CM
      { x: 0.45, y: 0.5, position: 'CDM' },    // CDM
      { x: 0.45, y: 0.65, position: 'CM' },    // Right CM
      { x: 0.35, y: 0.9, position: 'RWB' },    // Right Wing Back
      { x: 0.65, y: 0.4, position: 'ST' },     // Left Striker
      { x: 0.65, y: 0.6, position: 'ST' },     // Right Striker
    ],
  },

  // 9v9 Formations
  {
    id: '9v9-1-3-3-2',
    name: '1-3-3-2',
    description: '9v9: GK, 3 defenders, 3 midfielders, 2 forwards',
    playerCount: 9,
    positions: [
      { x: 0.08, y: 0.5, position: 'GK' },     // Goalkeeper
      { x: 0.22, y: 0.25, position: 'LB' },    // Left Back
      { x: 0.22, y: 0.5, position: 'CB' },     // Center Back
      { x: 0.22, y: 0.75, position: 'RB' },    // Right Back
      { x: 0.45, y: 0.25, position: 'LM' },    // Left Mid
      { x: 0.45, y: 0.5, position: 'CM' },     // Center Mid
      { x: 0.45, y: 0.75, position: 'RM' },    // Right Mid
      { x: 0.68, y: 0.4, position: 'ST' },     // Left Striker
      { x: 0.68, y: 0.6, position: 'ST' },     // Right Striker
    ],
  },
];

export function createFormationPlayers(
  formation: Formation,
  team: 'red' | 'blue',
  fieldWidth: number,
  fieldHeight: number,
  offsetX: number,
  offsetY: number
): Player[] {
  return formation.positions.map((pos, index) => {
    // Adjust positioning based on team side
    let adjustedX = pos.x;

    if (team === 'red') {
      // Red team on the left half (attacking right)
      adjustedX = pos.x * 0.5; // Scale to left half (0 to 0.5)
    } else {
      // Blue team on the right half (attacking left)
      adjustedX = 1 - (pos.x * 0.5); // Mirror and scale to right half (0.5 to 1)
    }

    // Calculate actual field positions
    const x = offsetX + (adjustedX * fieldWidth);
    const y = offsetY + (pos.y * fieldHeight);

    return {
      id: `${team}-${formation.id}-${index}`,
      name: `${pos.position} ${index + 1}`,
      position: pos.position,
      x,
      y,
      team,
      number: index + 1,
    };
  });
}

export function getFormationsByPlayerCount(playerCount: number): Formation[] {
  return formations.filter(f => f.playerCount === playerCount);
}