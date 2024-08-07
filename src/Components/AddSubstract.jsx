import React, { useEffect, useState } from 'react'

function AddSubstract({add, substract}) {
    const [current, setCurrent] = useState('')

    useEffect(()=>{
        if(current==='+')add()
        if(current==='-')substract()
    }, [current])

    function handdleCLickAdd(){
        setCurrent('+')
    }
    function handdleCLickSubstract(){
        setCurrent('-')
    }

    return (
        <div className=' select-none'>
            <button 
            onClick={handdleCLickSubstract} 
            className={`rounded-l-full border-2 border-black w-8 ${current==='-'?'bg-red-500':''}`}>
                -
            </button>
            <button 
            onClick={handdleCLickAdd} 
            className={`rounded-r-full border-2 border-black w-8 ${current==='+'?'bg-green-500':''}`}>
                +
            </button>
        </div>
    )
}

export default AddSubstract