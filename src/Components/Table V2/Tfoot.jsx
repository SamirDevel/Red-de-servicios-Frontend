import { useState, useEffect } from 'react'
import Tr from './Tr'

function Tfoot(props) {
    const [heads, setHeads] = useState(props.heads)
  
    function makeRows(){
      return props.values.map((value, index)=><Tr key={props.keyName!==undefined?value[props.keyName]:index} heads={props.heads} value ={value} type='foot' index={-1}/>)
    }

    return (
      <tfoot className={`${props.theme}`}>
        {makeRows()}
      </tfoot>
    )
  }

export default Tfoot