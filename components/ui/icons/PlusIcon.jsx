import * as React from "react"
import { Path } from "react-native-svg"
import SvgLayout from "./SvgLayout"
const PlusIcon = (props) => (
  <SvgLayout
    {...props}
  >
    <Path
      fill={props["color"]}
      d="M13 6a1 1 0 0 0-2 0v5H6a1 1 0 0 0 0 2h5v5a1 1 0 0 0 2 0v-5h5a1 1 0 0 0 0-2h-5V6Z"
    />
  </SvgLayout>
)
export default PlusIcon
