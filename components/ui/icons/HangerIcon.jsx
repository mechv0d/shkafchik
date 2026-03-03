import * as React from "react";
import PathLayout from "./PathLayout";
import SvgLayout from "./SvgLayout";
const HangerIcon = (props) => (
  <SvgLayout
    {...props}
  >
    <PathLayout
    d="M14 6a2 2 0 0 0-4 0c0 1.667.67 3 2 4h-.008m0 0 7.97 4.428a2 2 0 0 1 1.03 1.749V17a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2v-.823a2 2 0 0 1 1.029-1.749L11.99 10Z"
    strokeColor={props["color"]}
    {...props}
    />
  </SvgLayout>
)
export default HangerIcon;
