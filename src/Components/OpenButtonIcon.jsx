import { RxOpenInNewWindow } from "react-icons/rx"
import IconButton from './IconButton'
function OpenButtonIcon({size, url}) {
    return (
        <IconButton icon={ <RxOpenInNewWindow size={size}/>} fn={()=>window.open(`${url}`,'_blank',)}/>
    )
}

export default OpenButtonIcon