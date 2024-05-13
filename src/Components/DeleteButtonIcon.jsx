import IconButton from './IconButton'
import { AiFillDelete } from "react-icons/ai"

function DeleteButtonIcon({size, fn}) {
  return (
    <IconButton icon={<AiFillDelete size={size} className="redHover"/>} fn={fn}/>
  )
}

export default DeleteButtonIcon