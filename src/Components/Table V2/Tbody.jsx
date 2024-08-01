import { useState, useEffect } from 'react'
import Tr from './Tr'
import { Droppable } from 'react-beautiful-dnd'

function Tbody({ values, heads}) {
    function makeRows(){
        return  values.map((value, index)=>{
            return <Tr key={index} heads={heads} value ={value} type='body' index={index}/>
        })
    }
    return (
        <Droppable droppableId='droppableRow'>
            {
                provided=>(
                    <tbody {...provided.droppableProps} ref={provided.innerRef}>
                        {makeRows()}
                        {provided.placeholder}
                    </tbody>
                )
            }
        </Droppable>
    )
}

export default Tbody