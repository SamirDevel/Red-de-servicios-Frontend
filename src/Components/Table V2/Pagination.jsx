import React, { useEffect, useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import IconButton from '../IconButton';
import Searchbar from './Searchbar';
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
function Pagination({elements, result, children, limit, compare, filter}) {
    const [page, setPage] = useState(1);

    useEffect(()=>{
        const paginated = paginate();
        result(paginated, page)
    }, [page, elements])

    function paginate(){
        const {start, end} = currentPage()
        return  elements.filter((element,index)=>{
            const realIndex = index+1;
            return realIndex>=start&&realIndex<=end;
        })

    }
    function handdleFoward(){
        const { end } = currentPage()
        if(elements.length<=end)alert('no se puede avanzar más')
        else setPage(page+1)
    }
    function firstPage(){
        setPage(1)
    }
    function lastPage(){
        if(elements.length===0)alert('no se puede avanzar más')
        else {
            const maxDivisor = Math.floor(elements.length/limit)
            const multiplo = maxDivisor*limit;
            multiplo>elements.length
                ?setPage(maxDivisor)
                :setPage(maxDivisor +1)
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
        const start = ((page -1)*30)+1
        return {start, end}
    }
    function getCurrentPageText(){
        const {start, end} = currentPage()
        return `${start}-${end} de ${elements.length}`
    }
    function Component(){
        return <>
            <IconButton icon={<MdKeyboardDoubleArrowLeft size={35}/>} fn={firstPage}/>
            <span className=' mx-2'/>
            <IconButton icon={<IoIosArrowBack size={35}/>} fn={handdleBack}/>
            <span className=' mx-2'/>
            <label>{getCurrentPageText()}</label>
            <span className=' mx-2'/>
            <IconButton icon={<IoIosArrowForward size={35}/>} fn={handdleFoward}/>
            <span className=' mx-2'/>
            <IconButton icon={<MdKeyboardDoubleArrowRight size={35}/>} fn={lastPage}/>
        </>
    }
    return (
        <>
            <div className=' w-full px-1 flex flex-row items-center'>
                {Component()}
                <Searchbar list={elements} compare={compare} result={filter}/>
            </div>
            <span className="my-2"/>
            {
                React.Children.map(children,(child, index)=>{
                    return React.cloneElement(child, {key:index})
                })
            }
            <span className="my-2"/>
            <div className=' w-full px-1 flex flex-row items-center'>
                {Component()}
            </div>
        </>
    )
}

export default Pagination