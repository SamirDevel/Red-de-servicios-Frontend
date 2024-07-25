import React from 'react'
import Th from './Th'
import Td from './Td';
function Tr({colsNames, type, row, fn, colsKeys, data, colsHigh, colsFn, id, dragRef, draggable, handler}) {
    const cells = new Array();
    const end = colsNames.length
    for(let i=0; i<end; i++){
        if(type===1){
            cells.push(
                <Th text = {colsNames[i]} row={row} col={i} key={i} fn={()=>{fn(colsKeys[i])}}/>
            )
        }else{
            const newData = colsKeys[i]=='NUMBER'?row+1:data[colsKeys[i]];
            let highlight='';
            const indexOfHighlight = colsHigh!=undefined?colsHigh.indexOf(colsKeys[i]):-1;
            if(indexOfHighlight!=-1)highlight = colsFn[indexOfHighlight](newData);
            cells.push(
                <Td content = {newData} row={row} col={i} key={i} highlight={highlight}/>
            )
        }
    }
    return (
    <tr id={id} ref={dragRef} {...draggable} {...handler}>
        {cells}
    </tr>
  )
}

export default Tr