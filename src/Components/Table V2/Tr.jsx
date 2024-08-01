import React from 'react'
import Th from './Th'
import Td from './Td'
import { Draggable } from 'react-beautiful-dnd'

function Tr({heads, clicked, value, type, index}) {
    function makeHead(){
        return heads.map((head, index)=><Th key={index} index={index} content={head.text} clicked={(reversed)=>clicked(index,reversed)}/>)
    }

    function makeBody(){
        return heads.map((head, index)=>{            
            const key =Object.keys(value)[index]
            const content = value[key]
            return <Td key={index} index={index} content={content} type={head.type} bgCell={head.bg}/>
        })
    }

    function makeRow(){
        if(type==='head') return <tr>
            {makeHead()}
            </tr>
        else if(type==='body') return<Draggable draggableId={index.toString()} index={index}>
            {
                provided=>(
                <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    {makeBody()}
                </tr>
                )
            }
        </Draggable>
    }
    return (
        <>
            {makeRow()}
        </>
    )
}

export default Tr