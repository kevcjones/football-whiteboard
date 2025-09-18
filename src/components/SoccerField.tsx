"use client";

import React, { useState } from "react";
import { Stage, Layer, Rect, Line, Circle, Arc } from "react-konva";
import { PlayerMarker } from "./PlayerMarker";
import { BallMarker } from "./BallMarker";
import { ArrowMarker } from "./ArrowMarker";
import { Player, Ball, Arrow } from "@/types";

interface SoccerFieldProps {
  width: number;
  height: number;
  players: Player[];
  ball?: Ball;
  arrows: Arrow[];
  selectedTool:
    | "move"
    | "red-player"
    | "blue-player"
    | "delete"
    | "ball"
    | "arrow";
  onPlayerAdd: (x: number, y: number, team: "red" | "blue") => void;
  onPlayerMove: (id: string, x: number, y: number) => void;
  onPlayerDelete: (id: string) => void;
  onBallPlace: (x: number, y: number) => void;
  onBallMove: (x: number, y: number) => void;
  onArrowAdd: (arrow: Arrow) => void;
  onArrowMove: (
    id: string,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => void;
  onArrowDelete: (id: string) => void;
}

export const SoccerField: React.FC<SoccerFieldProps> = ({
  width,
  height,
  players,
  ball,
  arrows,
  selectedTool,
  onPlayerAdd,
  onPlayerMove,
  onPlayerDelete,
  onBallPlace,
  onBallMove,
  onArrowAdd,
  onArrowMove,
  onArrowDelete,
}) => {
  const [isDrawingArrow, setIsDrawingArrow] = useState(false);
  const [arrowStart, setArrowStart] = useState<{
    x: number;
    y: number;
    attachedTo?: { type: "player" | "ball"; id?: string };
  } | null>(null);

  const fieldRatio = 105 / 68; // FIFA field ratio (length/width)
  const fieldWidth = Math.min(width * 0.9, height * 0.9 * fieldRatio);
  const fieldHeight = fieldWidth / fieldRatio;

  const offsetX = (width - fieldWidth) / 2;
  const offsetY = (height - fieldHeight) / 2;

  // Helper function to check if click is near a player or ball
  const findNearbyEntity = (x: number, y: number, threshold = 25) => {
    // Check players
    for (const player of players) {
      const distance = Math.sqrt((player.x - x) ** 2 + (player.y - y) ** 2);
      if (distance <= threshold) {
        return {
          type: "player" as const,
          id: player.id,
          x: player.x,
          y: player.y,
        };
      }
    }

    // Check ball
    if (ball) {
      const distance = Math.sqrt((ball.x - x) ** 2 + (ball.y - y) ** 2);
      if (distance <= threshold) {
        return { type: "ball" as const, x: ball.x, y: ball.y };
      }
    }

    return null;
  };

  const handleStageClick = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();

    if (selectedTool === "red-player" || selectedTool === "blue-player") {
      const team = selectedTool === "red-player" ? "red" : "blue";
      onPlayerAdd(pos.x, pos.y, team);
    } else if (selectedTool === "ball") {
      onBallPlace(pos.x, pos.y);
    } else if (selectedTool === "arrow") {
      if (!isDrawingArrow) {
        // Start drawing arrow
        const nearby = findNearbyEntity(pos.x, pos.y);
        setArrowStart({
          x: nearby ? nearby.x : pos.x,
          y: nearby ? nearby.y : pos.y,
          attachedTo: nearby ? { type: nearby.type, id: nearby.id } : undefined,
        });
        setIsDrawingArrow(true);
      } else {
        // Finish drawing arrow
        if (arrowStart) {
          const newArrow: Arrow = {
            id: `arrow-${Date.now()}-${Math.random()}`,
            startX: arrowStart.x,
            startY: arrowStart.y,
            endX: pos.x,
            endY: pos.y,
            attachedTo: arrowStart.attachedTo,
            style: "movement", // Default to movement style
          };
          onArrowAdd(newArrow);
        }
        setIsDrawingArrow(false);
        setArrowStart(null);
      }
    }
  };

  return (
    <Stage width={width} height={height} onClick={handleStageClick}>
      <Layer>
        {/* Field background */}
        <Rect
          x={offsetX}
          y={offsetY}
          width={fieldWidth}
          height={fieldHeight}
          fill="#4ade80"
          stroke="#ffffff"
          strokeWidth={3}
        />

        {/* Center line */}
        <Line
          points={[
            offsetX + fieldWidth / 2,
            offsetY,
            offsetX + fieldWidth / 2,
            offsetY + fieldHeight,
          ]}
          stroke="#ffffff"
          strokeWidth={2}
        />

        {/* Center circle */}
        <Circle
          x={offsetX + fieldWidth / 2}
          y={offsetY + fieldHeight / 2}
          radius={fieldHeight * 0.135}
          stroke="#ffffff"
          strokeWidth={2}
        />

        {/* Center spot */}
        <Circle
          x={offsetX + fieldWidth / 2}
          y={offsetY + fieldHeight / 2}
          radius={3}
          fill="#ffffff"
        />

        {/* Left penalty area */}
        <Rect
          x={offsetX}
          y={offsetY + fieldHeight * 0.263}
          width={fieldWidth * 0.167}
          height={fieldHeight * 0.474}
          stroke="#ffffff"
          strokeWidth={2}
        />

        {/* Right penalty area */}
        <Rect
          x={offsetX + fieldWidth * 0.833}
          y={offsetY + fieldHeight * 0.263}
          width={fieldWidth * 0.167}
          height={fieldHeight * 0.474}
          stroke="#ffffff"
          strokeWidth={2}
        />

        {/* Left goal area */}
        <Rect
          x={offsetX}
          y={offsetY + fieldHeight * 0.368}
          width={fieldWidth * 0.055}
          height={fieldHeight * 0.264}
          stroke="#ffffff"
          strokeWidth={2}
        />

        {/* Right goal area */}
        <Rect
          x={offsetX + fieldWidth * 0.945}
          y={offsetY + fieldHeight * 0.368}
          width={fieldWidth * 0.055}
          height={fieldHeight * 0.264}
          stroke="#ffffff"
          strokeWidth={2}
        />

        {/* Left penalty spot */}
        <Circle
          x={offsetX + fieldWidth * 0.11}
          y={offsetY + fieldHeight / 2}
          radius={3}
          fill="#ffffff"
        />

        {/* Right penalty spot */}
        <Circle
          x={offsetX + fieldWidth * 0.89}
          y={offsetY + fieldHeight / 2}
          radius={3}
          fill="#ffffff"
        />

        {/* Corner arcs */}
        <Arc
          x={offsetX}
          y={offsetY}
          innerRadius={fieldHeight * 0.015}
          outerRadius={fieldHeight * 0.015}
          angle={90}
          rotation={0}
          stroke="#ffffff"
          strokeWidth={2}
        />

        <Arc
          x={offsetX + fieldWidth}
          y={offsetY}
          innerRadius={fieldHeight * 0.015}
          outerRadius={fieldHeight * 0.015}
          angle={90}
          rotation={90}
          stroke="#ffffff"
          strokeWidth={2}
        />

        <Arc
          x={offsetX + fieldWidth}
          y={offsetY + fieldHeight}
          innerRadius={fieldHeight * 0.015}
          outerRadius={fieldHeight * 0.015}
          angle={90}
          rotation={180}
          stroke="#ffffff"
          strokeWidth={2}
        />

        <Arc
          x={offsetX}
          y={offsetY + fieldHeight}
          innerRadius={fieldHeight * 0.015}
          outerRadius={fieldHeight * 0.015}
          angle={90}
          rotation={270}
          stroke="#ffffff"
          strokeWidth={2}
        />
      </Layer>

      {/* Players Layer */}
      <Layer>
        {/* Arrows - render first so they appear behind players/ball */}
        {arrows?.map((arrow) => (
          <ArrowMarker
            key={arrow.id}
            arrow={arrow}
            isMoveModeActive={selectedTool === "move"}
            isDeleteModeActive={selectedTool === "delete"}
            onArrowMove={onArrowMove}
            onArrowDelete={onArrowDelete}
          />
        ))}

        {players.map((player) => (
          <PlayerMarker
            key={player.id}
            player={player}
            onDragEnd={onPlayerMove}
            onDelete={onPlayerDelete}
            isDraggable={selectedTool === "move"}
            isDeleteMode={selectedTool === "delete"}
          />
        ))}

        {/* Ball */}
        {ball && (
          <BallMarker
            ball={ball}
            onDragEnd={onBallMove}
            isDraggable={selectedTool === "move" || selectedTool === "ball"}
          />
        )}
      </Layer>
    </Stage>
  );
};
