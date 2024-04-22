import IconButton from "./IconButton"
import { BsPrinterFill } from "react-icons/bs"
function PrintButtonIcon({size, fn}) {
  return (
    <IconButton icon={<BsPrinterFill size={size} className='blueHover'/>} fn={async()=>{  
      const doc = fn();
      //console.log(doc)
      window.open(doc.output("bloburl"), "Carta", "width=inherit, height=0")
    }}/>
  )
}

export default PrintButtonIcon