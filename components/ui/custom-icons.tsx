import { SvgProps } from "react-native-svg";
import React from "react";

export function SvgIcon({ Icon, size = 28, color = 'black', ...props }: { Icon: React.ComponentType<SvgProps>; size?: number; color?: string } & SvgProps) {
  console.log(color);
  return <Icon width={size} height={size} stroke={color} {...props} />;
}