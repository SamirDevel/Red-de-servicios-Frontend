import { useState, useEffect } from "react"
import Thead from "./Thead"
import Tbody from "./Tbody"
import Tfoot from "./Tfoot"
import { DragDropContext } from "react-beautiful-dnd"
import { fns } from "../../Functions"
import IconButton from "../IconButton"
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import ExcelJS from 'exceljs'
import { saveAs } from "file-saver"

function Table({colsHeads, list, theme, foots, manage, handdleExport, aftherRendered}) {
    const [displayed, setDisplayed] = useState([]);

    useEffect(()=>{
        setDisplayed(list)
    }, [list])
    useEffect(()=>{
        if(aftherRendered)aftherRendered()
    },[displayed])

    function handleClickHead(index, reversed){
        if(displayed.length>0){
            const keys = Object.keys(displayed[0]);
            const key = keys[index];
            const sorted = fns.quicksort(displayed,key,reversed)
            setDisplayed([])
            manage(sorted)
        }
    }
    function onDragEnd(result) {
        if (!result.destination) {
          return;
        }
    
        const reorderedItems = fns.reorder(
          list,
          result.source.index,
          result.destination.index
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
        saveAs(blob, 'table.xlsx')
        //console.log(worksheet)
    }
    function isExportable(){
        return handdleExport !== undefined
            ?<>
            <span className="my-2"/>
                <IconButton fn={exportToExcell} id='icon' icon={<PiMicrosoftExcelLogoFill size={45} className="greenHover"/>}/>
            </>
            :<></>
    }

    return (
        <div className=" flex flex-col items-end">
            {isExportable()}
            <DragDropContext onDragEnd={onDragEnd}>
                <table className="mx-1 select-none">
                    <Thead theme={`${theme}`} heads={colsHeads} clicked={handleClickHead}/>
                    <Tbody heads={colsHeads} values={displayed}/>
                    {(()=>{                
                        if(foots!==undefined)return <Tfoot theme={theme} heads={colsHeads} values={foots}/>
                    })()}
                </table>
            </DragDropContext>
            
        </div>
    )
}

export default Table