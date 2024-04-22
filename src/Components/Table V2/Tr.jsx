import React from 'react'
import Th from './Th'
import Td from './Td'

function Tr(props) {
    function makeHead(){
        return props.heads.map((head, index)=><Th key={index} index={index} content={head.text} clicked={(reversed)=>props.clicked(index,reversed)}/>)
    }

    function makeBody(){
        return props.heads.map((head, index)=>{            
            const key =Object.keys(props.value)[index]
            const content = props.value[key]
            return <Td key={index} index={index} content={content} type={head.type}/>
        })
    }

    function makeRow(){
        if(props.type==='head') return makeHead();
        if(props.type==='body') return makeBody();
    }
    return (
        <tr>
            {makeRow()}
        </tr>
    )
}

export default Tr