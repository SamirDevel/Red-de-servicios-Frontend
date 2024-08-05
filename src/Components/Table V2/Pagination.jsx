import React, { useEffect, useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import IconButton from '../IconButton';
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

function Pagination({elements, result, children, limit}) {
    const [page, setPage] = useState(1);

    useEffect(()=>{
        const {start, end} = currentPage()
        const paginated = elements.filter((element,index)=>{
            const realIndex = index+1;
            return realIndex>=start&&realIndex<=end;
        })
        result(paginated, page)
    }, [page, elements])

    function handdleFoward(){
        const { end } = currentPage()
        if(elements.length<=end)alert('no se puede avanzar más')
        else setPage(page+1)
    }
    function fistPage(){
        setPage(1)
    }
    function lastPage(){
        if(elements.length===0)alert('no se puede avanzar más')
        else {
            const lastIndex = Math.floor(elements.length/limit)
            setPage(lastIndex)
        }        
    }
    function handdleBack(){
        const { start } = currentPage()
        if(start===1||elements.length===0)alert('No se puede retorceder más')
        else setPage(page-1)
    }
    function currentPage(){
        const lastIndex = page*limit;
        const end = lastIndex<=elements.length ? lastIndex : elements.length
        const firstIndex = end-limit +1;
        const start = firstIndex<=0
            ?elements.length===0 ? 0 :1
            :firstIndex ;
        return {start, end}
    }
    function getCurrentPageText(){
        const {start, end} = currentPage()
        return `${start}-${end} de ${elements.length}`
    }
    function Component(){
        return <div className=' w-full px-1 flex flex-row items-center'>
            <IconButton icon={<MdKeyboardDoubleArrowLeft size={35}/>} fn={fistPage}/>
            <span className=' mx-2'/>
            <IconButton icon={<IoIosArrowBack size={35}/>} fn={handdleBack}/>
            <span className=' mx-2'/>
            <label>{getCurrentPageText()}</label>
            <span className=' mx-2'/>
            <IconButton icon={<IoIosArrowForward size={35}/>} fn={handdleFoward}/>
            <span className=' mx-2'/>
            <IconButton icon={<MdKeyboardDoubleArrowRight size={35}/>} fn={lastPage}/>
        </div>
    }
    return (
        <>
            {Component()}
            <span className="my-2"/>
            {
                React.Children.map(children,(child, index)=>{
                    return React.cloneElement(child, {key:index})
                })
            }
            <span className="my-2"/>
            {Component()}
        </>
    )
}

export default Pagination