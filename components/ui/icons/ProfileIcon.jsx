import PathLayout from "./PathLayout";
import SvgLayout from "./SvgLayout";
const ProfileIcon = (props) => (
  <SvgLayout
    {...props}
  >
     <PathLayout
    d="M21 12a8.96 8.96 0 0 1-1.526 5.016A8.991 8.991 0 0 1 12 21a8.99 8.99 0 0 1-8.93-7.882A9 9 0 1 1 21 12Z"
    strokeColor={props["color"]}
    {...props}
    />
    <PathLayout
    d="M13 9a1 1 0 0 1-1 1v2a3 3 0 0 0 3-3h-2Zm-1 1a1 1 0 0 1-1-1H9a3 3 0 0 0 3 3v-2Zm-1-1a1 1 0 0 1 1-1V6a3 3 0 0 0-3 3h2Zm1-1a1 1 0 0 1 1 1h2a3 3 0 0 0-3-3v2Zm-6.834 9.856-.959-.285-.155.523.355.413.759-.651Zm13.668 0 .76.651.354-.413-.155-.523-.959.285ZM9 16h6v-2H9v2Zm0-2a5 5 0 0 0-4.793 3.571l1.917.57A3 3 0 0 1 9 16v-2Zm3 6a7.98 7.98 0 0 1-6.075-2.795l-1.518 1.302A9.98 9.98 0 0 0 12 22v-2Zm3-4c1.357 0 2.506.902 2.876 2.142l1.917-.571A5.001 5.001 0 0 0 15 14v2Zm3.075 1.205A7.98 7.98 0 0 1 12 20v2a9.979 9.979 0 0 0 7.594-3.493l-1.519-1.302Z"
    fillWidth={1}
    stroke="none"
    fill={props["color"]}
    {...props}
    />
  </SvgLayout>
)
export default ProfileIcon;
