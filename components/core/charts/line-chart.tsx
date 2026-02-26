import { CONFIG } from '@/config';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Mask,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

type LineChartDataPoint = {
  value: number;
  hasData: boolean;
};

type LineChartProps = {
  data: LineChartDataPoint[];
  maxValue: number;
  selectedIndex: number | null;
  colorScheme: 'light' | 'dark';
  lineColor?: string;
  dataPointColors?: string[];
  height?: number;
  paddingTop?: number;
  paddingBottom?: number;
  renderTooltip?: (params: {
    dataPoint: LineChartDataPoint;
    index: number;
  }) => ReactNode;
  referenceLines?: number[];
  emptyLabel?: string;
};

export type { LineChartDataPoint };

type Point = {
  x: number;
  y: number;
};

type ChartDimensions = {
  height: number;
  paddingTop: number;
  paddingBottom: number;
};

function valueToY(
  value: number,
  maxValue: number,
  dims: ChartDimensions
): number {
  const drawHeight = dims.height - dims.paddingTop - dims.paddingBottom;
  return dims.paddingTop + drawHeight * (1 - value / maxValue);
}

function createSmoothPath(points: Point[]): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
  }

  let path = `M ${points[0].x},${points[0].y}`;
  const tension = 0.3;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  return path;
}

function createAreaPath(points: Point[], chartHeight: number): string {
  if (points.length < 2) return '';

  const curvePath = createSmoothPath(points);

  return `${curvePath} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`;
}

function parseHslColor(hsl: string): string {
  const match = hsl.match(/hsl\((\d+)\s+([\d.]+)%?\s+([\d.]+)%?\)/);
  if (match) {
    return `hsl(${match[1]}, ${match[2]}%, ${match[3]}%)`;
  }
  return hsl;
}

export function LineChart({
  data,
  maxValue,
  selectedIndex,
  colorScheme,
  lineColor: lineColorProp,
  dataPointColors,
  height = 220,
  paddingTop = 24,
  paddingBottom = 32,
  renderTooltip,
  referenceLines,
  emptyLabel,
}: LineChartProps) {
  const [chartWidth, setChartWidth] = useState(0);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setChartWidth(event.nativeEvent.layout.width);
  }, []);

  const theme = colorScheme === 'dark' ? THEME.dark : THEME.light;
  const lineColor = lineColorProp ?? CONFIG.tintColor.hex;
  const cardColor = parseHslColor(theme.card);

  const hasAnyData = data.some((d) => d.hasData);
  const dims: ChartDimensions = { height, paddingTop, paddingBottom };
  const referenceLines_ = referenceLines ?? [3, 6, 9];
  const refLineColor =
    colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  const points: Point[] =
    chartWidth > 0
      ? data.map((d, i) => ({
          x: (i / Math.max(data.length - 1, 1)) * chartWidth,
          y: valueToY(d.value, maxValue, dims),
        }))
      : [];

  const curvePath = createSmoothPath(points);
  const areaPath = createAreaPath(points, height);

  const selectedPoint = selectedIndex != null ? points[selectedIndex] : null;
  const selectedDataPoint = selectedIndex != null ? data[selectedIndex] : null;

  const tooltipWidth = 150;
  const tooltipLeft = selectedPoint
    ? Math.max(
        0,
        Math.min(selectedPoint.x - tooltipWidth / 2, chartWidth - tooltipWidth)
      )
    : 0;

  return (
    <View onLayout={onLayout}>
      {chartWidth > 0 && (
        <View style={{ height }}>
          <Svg
            width={chartWidth}
            height={height}
          >
            {referenceLines_.map((refValue) => (
              <Path
                key={refValue}
                d={`M 0,${valueToY(refValue, maxValue, dims)} L ${chartWidth},${valueToY(refValue, maxValue, dims)}`}
                stroke={refLineColor}
                strokeWidth={1}
                strokeDasharray="4 6"
              />
            ))}
            {hasAnyData && (
              <>
                <Defs>
                  {dataPointColors && dataPointColors.length > 1 ? (
                    <>
                      <LinearGradient
                        id="severityGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        {dataPointColors.map((color, i) => (
                          <Stop
                            key={i}
                            offset={`${(i / Math.max(dataPointColors.length - 1, 1)) * 100}%`}
                            stopColor={color}
                          />
                        ))}
                      </LinearGradient>
                      <LinearGradient
                        id="verticalFade"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <Stop offset="0%" stopColor="white" stopOpacity={0.3} />
                        <Stop offset="100%" stopColor="white" stopOpacity={0} />
                      </LinearGradient>
                      <Mask id="areaFadeMask">
                        <Rect
                          x="0"
                          y="0"
                          width={chartWidth}
                          height={height}
                          fill="url(#verticalFade)"
                        />
                      </Mask>
                    </>
                  ) : (
                    <LinearGradient
                      id="chartGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <Stop
                        offset="0%"
                        stopColor={lineColor}
                        stopOpacity={0.3}
                      />
                      <Stop
                        offset="100%"
                        stopColor={lineColor}
                        stopOpacity={0}
                      />
                    </LinearGradient>
                  )}
                </Defs>

                <Path
                  d={areaPath}
                  fill={
                    dataPointColors && dataPointColors.length > 1
                      ? 'url(#severityGradient)'
                      : 'url(#chartGradient)'
                  }
                  mask={
                    dataPointColors && dataPointColors.length > 1
                      ? 'url(#areaFadeMask)'
                      : undefined
                  }
                />

                <Path
                  d={curvePath}
                  stroke={
                    dataPointColors && dataPointColors.length > 1
                      ? 'url(#severityGradient)'
                      : lineColor
                  }
                  strokeWidth={2.5}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {selectedPoint && selectedDataPoint && (
                  <Circle
                    cx={selectedPoint.x}
                    cy={selectedPoint.y}
                    r={5}
                    fill={
                      dataPointColors?.[selectedIndex!] ?? lineColor
                    }
                  />
                )}
              </>
            )}
          </Svg>

          {!hasAnyData && emptyLabel && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text className="text-sm text-muted-foreground">
                {emptyLabel}
              </Text>
            </View>
          )}

          {selectedPoint && selectedDataPoint?.hasData && renderTooltip && (
            <View
              style={{
                position: 'absolute',
                left: tooltipLeft,
                top: Math.max(0, selectedPoint.y - 150),
                width: tooltipWidth,
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  backgroundColor: cardColor,
                  borderRadius: 14,
                  width: tooltipWidth,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 10,
                  elevation: 6,
                }}
              >
                {renderTooltip({
                  dataPoint: selectedDataPoint,
                  index: selectedIndex!,
                })}
              </View>
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: 7,
                  borderLeftColor: 'transparent',
                  borderRightWidth: 7,
                  borderRightColor: 'transparent',
                  borderTopWidth: 7,
                  borderTopColor: cardColor,
                }}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}
