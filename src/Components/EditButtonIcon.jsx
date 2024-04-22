import { FiEdit } from "react-icons/fi";
import IconButton from './IconButton'
function EditButtonIcon({size, url}) {
    return (
        <IconButton icon={ <FiEdit size={size}/>} fn={()=>window.open(`${url}`,'_blank',)}/>
    )
}

export default EditButtonIcon