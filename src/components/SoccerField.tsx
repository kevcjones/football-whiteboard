"use client";

import React from "react";
import { Stage, Layer, Rect, Line, Circle, Arc } from "react-konva";

interface SoccerFieldProps {
  width: number;
  height: number;
}

export const SoccerField: React.FC<SoccerFieldProps> = ({ width, height }) => {
  const fieldRatio = 105 / 68; // FIFA field ratio (length/width)
  const fieldWidth = Math.min(width * 0.9, height * 0.9 * fieldRatio);
  const fieldHeight = fieldWidth / fieldRatio;

  const offsetX = (width - fieldWidth) / 2;
  const offsetY = (height - fieldHeight) / 2;

  return (
    <Stage width={width} height={height}>
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
    </Stage>
  );
};
