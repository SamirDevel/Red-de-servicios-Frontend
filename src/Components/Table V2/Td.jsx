import { useState, useEffect } from "react"
import * as fns from '../../Functions'
function Td({content, type, bgCell}) {
  function display(){
    if(type==='pesos')return fns.moneyFormat(content)
    if(type==='%')return `${fns.fixed2String(content)}%`
    if(type==='date')return `${fns.dateString(new Date(content))}`
    if(type==='float')return `${fns.fixed2String(content)}`
    else return content
  }
  return (
    <td className={`${bgCell!==undefined?bgCell(content):''}`}>
      <div className={`flex flex-col justify-center items-center`}>
        {display()}
      </div>
    </td>
  )
}

export default Td