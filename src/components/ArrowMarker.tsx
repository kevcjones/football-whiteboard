'use client';

import React from 'react';
import { Line, Group, Circle } from 'react-konva';
import { Arrow, Player } from '@/types';

interface ArrowMarkerProps {
  arrow: Arrow;
  players: Player[];
  isMoveModeActive: boolean;
  isDeleteModeActive: boolean;
  onArrowMove?: (id: string, startX: number, startY: number, endX: number, endY: number) => void;
  onArrowDelete?: (id: string) => void;
}

export const ArrowMarker: React.FC<ArrowMarkerProps> = ({ arrow, players, isMoveModeActive, isDeleteModeActive, onArrowMove, onArrowDelete }) => {
  // Calculate arrow head points
  const dx = arrow.endX - arrow.startX;
  const dy = arrow.endY - arrow.startY;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return null;


  // Arrow head size
  const headLength = 15;
  const headAngle = Math.PI / 6; // 30 degrees

  // Calculate arrow head points
  const arrowHead1X = arrow.endX - headLength * Math.cos(Math.atan2(dy, dx) - headAngle);
  const arrowHead1Y = arrow.endY - headLength * Math.sin(Math.atan2(dy, dx) - headAngle);
  const arrowHead2X = arrow.endX - headLength * Math.cos(Math.atan2(dy, dx) + headAngle);
  const arrowHead2Y = arrow.endY - headLength * Math.sin(Math.atan2(dy, dx) + headAngle);

  // Style based on arrow type and mode
  const getArrowStyle = () => {
    const baseStyle = (() => {
      switch (arrow.style) {
        case 'movement':
          return {
            stroke: '#2563eb', // Blue
            strokeWidth: 3,
            dash: [10, 5], // Dashed for movement
          };
        case 'pass':
          return {
            stroke: '#dc2626', // Red
            strokeWidth: 2,
            dash: [], // Solid for pass
          };
        case 'run':
          return {
            stroke: '#16a34a', // Green
            strokeWidth: 2,
            dash: [5, 5], // Short dashes for run
          };
        default:
          return {
            stroke: '#2563eb',
            strokeWidth: 3,
            dash: [10, 5],
          };
      }
    })();

    // Special styling based on what the arrow is attached to
    if (arrow.attachedTo?.type === 'ball') {
      return {
        stroke: '#4b5563', // Dark grey for ball arrows
        strokeWidth: 3,
        dash: [], // Solid for ball arrows
      };
    } else if (arrow.attachedTo?.type === 'player' && arrow.attachedTo.id) {
      // Find the player and use their team color
      const player = players.find(p => p.id === arrow.attachedTo?.id);
      if (player) {
        return {
          stroke: player.team === 'red' ? '#ef4444' : '#3b82f6', // Red for red team, blue for blue team
          strokeWidth: 3,
          dash: [10, 5], // Dashed for player arrows
        };
      }
    }

    // Override with red color in delete mode
    if (isDeleteModeActive) {
      return {
        ...baseStyle,
        stroke: '#ef4444', // Red in delete mode
        strokeWidth: baseStyle.strokeWidth + 1, // Slightly thicker
      };
    }

    return baseStyle;
  };

  const style = getArrowStyle();

  return (
    <Group>
      {/* Main arrow line */}
      <Line
        points={[arrow.startX, arrow.startY, arrow.endX, arrow.endY]}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        dash={style.dash}
        lineCap="round"
        lineJoin="round"
        onClick={() => {
          if (isDeleteModeActive && onArrowDelete) {
            onArrowDelete(arrow.id);
          }
        }}
      />

      {/* Arrow head */}
      <Line
        points={[
          arrow.endX, arrow.endY,
          arrowHead1X, arrowHead1Y,
          arrowHead2X, arrowHead2Y,
          arrow.endX, arrow.endY
        ]}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        fill={style.stroke}
        closed={true}
        onClick={() => {
          if (isDeleteModeActive && onArrowDelete) {
            onArrowDelete(arrow.id);
          }
        }}
      />

      {/* Draggable arrow head handle - only visible in move mode */}
      {isMoveModeActive && onArrowMove && (
        <Circle
          x={arrow.endX}
          y={arrow.endY}
          radius={8}
          fill="rgba(37, 99, 235, 0.3)"
          stroke="#2563eb"
          strokeWidth={2}
          draggable={true}
          onDragMove={(e) => {
            onArrowMove(arrow.id, arrow.startX, arrow.startY, e.target.x(), e.target.y());
          }}
          onDragEnd={(e) => {
            onArrowMove(arrow.id, arrow.startX, arrow.startY, e.target.x(), e.target.y());
          }}
        />
      )}

      {/* Draggable arrow start handle - only visible in move mode and not attached */}
      {isMoveModeActive && onArrowMove && !arrow.attachedTo && (
        <Circle
          x={arrow.startX}
          y={arrow.startY}
          radius={8}
          fill="rgba(37, 99, 235, 0.3)"
          stroke="#2563eb"
          strokeWidth={2}
          draggable={true}
          onDragMove={(e) => {
            onArrowMove(arrow.id, e.target.x(), e.target.y(), arrow.endX, arrow.endY);
          }}
          onDragEnd={(e) => {
            onArrowMove(arrow.id, e.target.x(), e.target.y(), arrow.endX, arrow.endY);
          }}
        />
      )}
    </Group>
  );
};