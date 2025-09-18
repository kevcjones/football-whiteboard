'use client';

import React from 'react';
import { Text, Group } from 'react-konva';
import { Ball } from '@/types';

interface BallMarkerProps {
  ball: Ball;
  onDragEnd: (x: number, y: number) => void;
  isDraggable: boolean;
}

export const BallMarker: React.FC<BallMarkerProps> = ({
  ball,
  onDragEnd,
  isDraggable
}) => {
  return (
    <Group
      x={ball.x}
      y={ball.y}
      draggable={isDraggable}
      onDragMove={(e) => {
        if (isDraggable) {
          onDragEnd(e.target.x(), e.target.y());
        }
      }}
      onDragEnd={(e) => {
        onDragEnd(e.target.x(), e.target.y());
      }}
    >
      <Text
        text="⚽"
        fontSize={30}
        x={-15}
        y={-15}
        width={30}
        height={30}
        align="center"
        verticalAlign="middle"
        shadowColor="black"
        shadowBlur={3}
        shadowOpacity={0.3}
        shadowOffsetY={2}
      />
    </Group>
  );
};