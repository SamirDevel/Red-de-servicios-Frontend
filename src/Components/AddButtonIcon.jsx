import { RiPlayListAddLine } from "react-icons/ri"
import IconButton from "./IconButton"

function AddButtonIcon(props) {
  return (
    <IconButton icon={<RiPlayListAddLine className="blueHover"/>} fn={props.fn}/>
  )
}

export default AddButtonIcon