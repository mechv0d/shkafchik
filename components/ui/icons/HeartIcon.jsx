import PathLayout from "./PathLayout";
import SvgLayout from "./SvgLayout";
const HeartIcon = (props) => (
  <SvgLayout {...props}>
    <PathLayout
      d="M19.071 13.142 13.414 18.8a2 2 0 0 1-2.828 0l-5.657-5.657A5 5 0 1 1 12 6.072a5 5 0 0 1 7.071 7.07Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeColor={props["color"]}
      {...props}
    />
  </SvgLayout>
);
export default HeartIcon;
