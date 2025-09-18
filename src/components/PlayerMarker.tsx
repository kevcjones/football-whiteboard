'use client';

import React from 'react';
import { Circle, Text, Group } from 'react-konva';
import { Player } from '@/types';

interface PlayerMarkerProps {
  player: Player;
  onDragEnd: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  isDraggable: boolean;
  isDeleteMode: boolean;
}

export const PlayerMarker: React.FC<PlayerMarkerProps> = ({
  player,
  onDragEnd,
  onDelete,
  isDraggable,
  isDeleteMode
}) => {
  const color = player.team === 'red' ? '#ef4444' : '#3b82f6';
  const textColor = '#ffffff';

  return (
    <Group
      x={player.x}
      y={player.y}
      draggable={isDraggable}
      onDragEnd={(e) => {
        onDragEnd(player.id, e.target.x(), e.target.y());
      }}
      onClick={() => {
        if (isDeleteMode) {
          onDelete(player.id);
        }
      }}
    >
      <Circle
        radius={20}
        fill={color}
        stroke={isDeleteMode ? "#ff0000" : "#ffffff"}
        strokeWidth={isDeleteMode ? 4 : 2}
        shadowColor="black"
        shadowBlur={3}
        shadowOpacity={0.3}
        shadowOffsetY={2}
      />
      {player.number && (
        <Text
          text={player.number.toString()}
          fontSize={14}
          fontStyle="bold"
          fill={textColor}
          width={40}
          height={40}
          align="center"
          verticalAlign="middle"
          offsetX={20}
          offsetY={20}
        />
      )}
    </Group>
  );
};