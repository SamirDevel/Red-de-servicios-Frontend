import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineManageSearch } from 'react-icons/md'
import { fns } from '../../Functions';

function Searchbar({list, result, compare}) {
  const [value, setValue] = useState('');
  const [coincidences, setCoincidences] = useState([])
  const inpRef = useRef(null)
  useEffect(()=>{
    async function search() {
      if(value!==''){
        const array = await fns.findCoincidences(list, value, compare);
        setCoincidences(array);
      }else{
        setCoincidences(0)
      }
    }
    search()
  }, [value])
  function enterKey(key){
    if(key === 'Enter'){
      //inpRef.current.blur();
      setBlur()
    }
  }

  async function setBlur(){
    value!==''
      ?result(coincidences, true)
      :(result([], false),inpRef.current.blur())
  }

  return (
    <div className=' border-4 border-black rounded-full h-8 flex flex-row items-center'>
      <span className='mr-1'/>
      <MdOutlineManageSearch size={25}/>
      <span className='mx-2'/>
      <input 
        type="text" 
        className='unset' 
        value={value} 
        onChange={e=>setValue(e.target.value)}
        onKeyDown={e=>enterKey(e.key)}
        ref={inpRef}
        onBlur={e=>setBlur()}
      />
      <span className='mx-2'/>
      <label className={`${coincidences.length>0?'':'hidden w-96'}`}>{`Elementos encontrados: ${coincidences.length}`}</label>
      <span className='mx-2'/>
    </div>
  )
}

export default Searchbar