import { useState, useEffect } from "react"
import * as fns from '../../Functions'
function Td(props) {
  const [value, setValue] = useState(props.content)
  function display(){
    if(props.type==='pesos')return fns.moneyFormat(value)
      if(props.type==='%')return `${fns.fixedString(value)}%`
    else return value
  }
  return (
    <td>
      <div className="flex flex-col justify-center items-center">
        {display()}
      </div>
    </td>
  )
}

export default Td