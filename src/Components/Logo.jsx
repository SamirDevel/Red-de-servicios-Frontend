import React from 'react'

function Logo({custom}) {
  return (
    <img src="/Public/CMP image 2.png" className={`${custom!==undefined?custom:''}`}/>
  )
}

export default Logo