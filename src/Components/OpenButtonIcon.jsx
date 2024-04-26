import { RxOpenInNewWindow } from "react-icons/rx"
import IconButton from './IconButton'
function OpenButtonIcon({size, url, emergente}) {
    function cadenaEmergente(){
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        return `width=${Math.round(screenWidth*0.4)}, height=${screenHeight<1000?Math.round(screenHeight*0.6) :Math.round(screenHeight*0.457)}`
    }
    return (
        <IconButton icon={ <RxOpenInNewWindow size={size}/>} fn={()=>window.open(`${url}`,'_blank', emergente===true?cadenaEmergente():'')}/>
    )
}

export default OpenButtonIcon