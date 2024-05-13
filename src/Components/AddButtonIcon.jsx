import { RiPlayListAddLine } from "react-icons/ri"
import IconButton from "./IconButton"

function AddButtonIcon({size, fn}) {
  return (
    <IconButton icon={<RiPlayListAddLine size={size} className="blueHover"/>} fn={fn}/>
  )
}

export default AddButtonIcon