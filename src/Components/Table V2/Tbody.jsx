import { useState, useEffect } from 'react'
import Tr from './Tr'

function Tbody(props) {
    function makeRows(){
        return props.values.map((value, index)=><Tr key={props.keyName!==undefined?value[props.keyName]:index} heads={props.heads} value ={value}type='body'/>)
    }
    return (
        <tbody>
            {makeRows()}
        </tbody>
    )
}

export default Tbody