import React from 'react'

function MenuButton(props) {
  return (
    <div
    onClick={props.fn}
    className=' self-center text-4xl rounded bg-primary w-96
    shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 
     text-cyan-800 font-extrabold calibri
     hover:bg-cyan-800 hover:text-white hover:cursor-pointer
     hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]'
    >
        {props.text}
    </div>
  )
}

export default MenuButton