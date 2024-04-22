import IconButton from './IconButton'
import { AiFillDelete } from "react-icons/ai"

function DeleteButtonIcon(props) {
  return (
    <IconButton icon={<AiFillDelete size={props.size} className="redHover"/>} fn={props.fn}/>
  )
}

export default DeleteButtonIcon