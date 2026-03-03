import PathLayout from './PathLayout'
const ActiveLineIcon = (props) => (
  <PathLayout
      d={"M12.5 " + (props["activeLineHeight"] || 24) + "h-1"}
      strokeColor={props["color"]}
      {...props}
    />
)
export default ActiveLineIcon;
