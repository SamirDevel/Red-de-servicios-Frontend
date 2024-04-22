import { MdCancel } from "react-icons/md";
import IconButton from './IconButton'
function CancelButtonIcon({size, url}) {
    return (
        <IconButton icon={ <MdCancel className='redHover' size={size}/>} fn={()=>window.open(`${url}`,'_blank',)}/>
    )
}

export default CancelButtonIcon