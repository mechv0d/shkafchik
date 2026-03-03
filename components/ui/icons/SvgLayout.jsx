import Svg from "react-native-svg";
import ActiveLineIcon from "./ActiveLineIcon";
const SvgLayout = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={props["width"] || 24}
    height={props["height"] || 24}
    viewBox={props["viewBox"] || "0 0 24 24"}
    fill={props["svgFill"] || "none"}
    {...props}
  >
    {props.children}
    {props.focused && <ActiveLineIcon
        {...props}
        />}  
  </Svg>
)
export default SvgLayout;
