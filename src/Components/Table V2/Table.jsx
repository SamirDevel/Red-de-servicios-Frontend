import { useState, useEffect } from "react"
import Thead from "./Thead"
import Tbody from "./Tbody"
import Tfoot from "./Tfoot"
import { DragDropContext } from "react-beautiful-dnd"
import { fns } from "../../Functions"
import IconButton from "../IconButton"
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import ExcelJS from 'exceljs'
import Pagination from "./Pagination"
import DownloadModal from "../DownloadModal"

function Table({colsHeads, list, theme, foots, manage, handdleExport, aftherRendered, limit}) {
    const [displayed, setDisplayed] = useState([]);
    const [page, setPage] = useState(0)
    const [selfLimit, setSelfLimit] = useState(limit!==undefined?limit:30);
    const [isDownladin, setIsDownloading] = useState(false)
    useEffect(()=>{
        //console.log(list)
    }, [list])
    useEffect(()=>{
        if(aftherRendered)aftherRendered()
    },[displayed])

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

    async function exportToExcell(){
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1')
        const {columns, rows} = handdleExport();
        worksheet.columns = columns.map(head=>{
            return {
                ...head, width:10
            }
            
        })
        //const keys = Object.keys(list[0])
        for(const row of rows){
            worksheet.addRow(row)
        }
        
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        return blob;
        //console.log(worksheet)
    }
    function isExportable(){
        return handdleExport !== undefined
            ?<>
                <IconButton fn={()=>setIsDownloading(true)} id='icon' icon={<PiMicrosoftExcelLogoFill size={45} className="greenHover"/>}/>
            </>
            :<></>
    }

    function paginate(paginated, page){
        setDisplayed(paginated),
        setPage(page)
    }

    return (
        <div className=" flex flex-col items-end">
            {(()=>{
                if(isDownladin===true)return <DownloadModal isOpen={isDownladin} bufferFn={exportToExcell} closefn={()=>setIsDownloading(false)} icon={<PiMicrosoftExcelLogoFill size={45} className="green"/>}/>
            })()}
            <span className="my-2"/>
            {isExportable()}
            <span className="my-2"/>
            <Pagination elements={list} result={paginate} limit={selfLimit}>  
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