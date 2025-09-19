'use client';

import React, { useRef, useEffect } from 'react';
import { Line, Group, Circle } from 'react-konva';
import { Arrow, Player } from '@/types';
import Konva from 'konva';

interface ArrowMarkerProps {
  arrow: Arrow;
  players: Player[];
  isMoveModeActive: boolean;
  isDeleteModeActive: boolean;
  onArrowMove?: (id: string, startX: number, startY: number, endX: number, endY: number) => void;
  onArrowDelete?: (id: string) => void;
}

export const ArrowMarker: React.FC<ArrowMarkerProps> = ({ arrow, players, isMoveModeActive, isDeleteModeActive, onArrowMove, onArrowDelete }) => {
  const lineRef = useRef<Konva.Line>(null);
  const arrowHeadRef = useRef<Konva.Line>(null);

  // Calculate arrow head direction based on the final segment
  const getArrowHeadDirection = () => {
    let startPoint, endPoint;

    if (arrow.segments && arrow.segments.length > 0) {
      // Use the last segment for arrow head direction
      const lastSegment = arrow.segments[arrow.segments.length - 1];
      startPoint = lastSegment;
      endPoint = { x: arrow.endX, y: arrow.endY };
    } else {
      // Use start and end points for single segment arrows
      startPoint = { x: arrow.startX, y: arrow.startY };
      endPoint = { x: arrow.endX, y: arrow.endY };
    }

    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    return { dx, dy, length };
  };

  const { dx, dy, length } = getArrowHeadDirection();

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

  // Animate dashes for dashed arrows
  useEffect(() => {
    if (!lineRef.current || !style.dash || style.dash.length === 0) return;

    const layer = lineRef.current.getLayer();
    if (!layer) return;

    const dashAnimation = new Konva.Animation((frame) => {
      if (!frame || !lineRef.current) return;

      // Calculate the dash offset based on time to create movement effect
      const dashLength = style.dash[0] + style.dash[1];
      const dashOffset = -(frame.time / 30) % dashLength;

      lineRef.current.dashOffset(dashOffset);
    }, layer);

    dashAnimation.start();

    return () => {
      dashAnimation.stop();
    };
  }, [style.dash, style.stroke]); // Re-run when dash pattern or style changes

  // Create points array for the arrow line
  const createArrowPoints = () => {
    const points = [arrow.startX, arrow.startY];

    if (arrow.segments && arrow.segments.length > 0) {
      // Add all segment points
      arrow.segments.forEach(segment => {
        points.push(segment.x, segment.y);
      });
    }

    // Add end point
    points.push(arrow.endX, arrow.endY);

    return points;
  };

  const arrowPoints = createArrowPoints();

  return (
    <Group>
      {/* Main arrow line (multi-segment or single) */}
      <Line
        ref={lineRef}
        points={arrowPoints}
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
        ref={arrowHeadRef}
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