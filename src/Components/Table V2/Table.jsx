import { useState, useEffect } from "react"
import Thead from "./Thead"
import Tbody from "./Tbody"
import Tfoot from "./Tfoot"
import { DragDropContext } from "react-beautiful-dnd"
import { compare, fns } from "../../Functions"
import IconButton from "../IconButton"
import Pagination from "./Pagination"
import DownloadModal from "../DownloadModal"

function Table({colsHeads, list, theme, foots, manage, handdleExport, icon, aftherRendered, limit, foreingCompare}) {
    const [displayed, setDisplayed] = useState([]);
    const [page, setPage] = useState(0)
    const [paginated, setPaginated] = useState([])
    const [filtred, setFiltred] = useState([])
    const [isFiltred, setIsFiltred] = useState(false)
    const [selfLimit, setSelfLimit] = useState(limit!==undefined?limit:30);
    const [isDownlading, setIsDownloading] = useState(false)
    useEffect(()=>{
        //console.log(list)
    }, [list])
    useEffect(()=>{
        if(aftherRendered)aftherRendered()
    },[displayed])
    useEffect(()=>{
        setDisplayed(paginated)
        //setSelfLimit(limit)
    }, [paginated])
    useEffect(()=>{
        if(isFiltred){
            setDisplayed(filtred)
            //setSelfLimit(filtred.length)
        }else{
            setDisplayed(paginated)
            //setSelfLimit(limit)
        }
    }, [filtred])

    function handleClickHead(index, reversed){
        if(displayed.length>0){
            const keys = Object.keys(list[0]);
            const key = keys[index];
            const sorted = fns.quicksort(list,key,reversed)
            setDisplayed([])
            manage(sorted)
        }
    }
    function onDragEnd(result) {
        function operation(index){
            return (page-1)*selfLimit+index
        }
        if (!result.destination) {
          return;
        }
        const origin = operation(result.source.index)
        const destination = operation(result.destination.index)
        const reorderedItems = fns.reorder(
          list,
          origin,
          destination
        );
        setDisplayed([])
        manage(reorderedItems);
    }
    function isExportable(){
        return handdleExport !== undefined
            ?<>
                <IconButton fn={()=>setIsDownloading(true)} id='icon' icon={icon}/>
            </>
            :<></>
    }

    function paginate(paginated, page){
        setPaginated(paginated),
        setPage(page)
    }
    function filter(array=[], flag){
        setFiltred(array);
        setIsFiltred(flag)
    }

    async function compare(toFind, option){
        const keys = Object.keys(option)
        const promises = keys.map(async (key)=>{
            const optionStr = option[key].toString()
            const flag = optionStr.includes(toFind);
            return flag
        })
        const results = await Promise.all(promises);
        return results.includes(true)
    }

    return (
        <div className=" flex flex-col items-end">
            {(()=>{
                if(isDownlading===true)return <DownloadModal isOpen={isDownlading} downloadFn={handdleExport} closefn={()=>setIsDownloading(false)} icon={icon}/>
            })()}
            <span className="my-2"/>
            {isExportable()}
            <span className="my-2"/>
            <Pagination elements={list} result={paginate} limit={selfLimit} filter={filter} compare={foreingCompare!==undefined?foreingCompare:compare}>  
                <DragDropContext onDragEnd={onDragEnd}>
                    <table className="mx-1 select-none">
                        <Thead theme={`${theme}`} heads={colsHeads} clicked={handleClickHead}/>
                        <Tbody heads={colsHeads} values={displayed}/>
                        {(()=>{                
                            if(foots!==undefined)return <Tfoot theme={theme} heads={colsHeads} values={foots}/>
                        })()}
                    </table>
                </DragDropContext>
            </Pagination>
            <span className="my-2"/>
        </div>
    )
}

export default Table