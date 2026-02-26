import Svg, { Circle, Text as SvgText } from 'react-native-svg';

type GaugeProps = {
  value: number;
  max?: number;
  color: string;
  bgColor: string;
  size?: number;
  strokeWidth?: number;
};

export const Gauge = ({
  value,
  max = 10,
  color,
  bgColor,
  size = 44,
  strokeWidth = 4,
}: GaugeProps) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = value / max;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Svg
      width={size}
      height={size}
    >
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={bgColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation={-90}
        origin={`${center}, ${center}`}
      />
      <SvgText
        x={center}
        y={center}
        textAnchor="middle"
        alignmentBaseline="central"
        fontSize={size * 0.36}
        fontWeight="700"
        fill={color}
      >
        {value}
      </SvgText>
    </Svg>
  );
};
