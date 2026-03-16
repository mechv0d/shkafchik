import SvgLayout from "./SvgLayout"
import PathLayout from "./PathLayout"
const SearchIcon = (props) => (
  <SvgLayout
    {...props}
  >
    <PathLayout
      stroke={props["color"]}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m20 20-4.05-4.05m0 0a7.002 7.002 0 0 0-2.271-11.418A7 7 0 1 0 15.95 15.95Z"
      {...props}
    />
  </SvgLayout>
)
export default SearchIcon
