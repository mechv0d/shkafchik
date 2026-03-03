import { Path } from "react-native-svg"
const PathLayout = (props) => (
  
    <Path
      stroke={props["strokeColor"] || '#fff'}
      strokeLinecap={props["strokeLinecap"] || 'round'}
      strokeLinejoin={props["strokeLinejoin"] || 'round'}
      strokeWidth={props["strokeWidth"] || 2}
      fill={props["fill"] || 'none'}
      d={props["d"] || ""}
      {...props}
    />
)
export default PathLayout;
