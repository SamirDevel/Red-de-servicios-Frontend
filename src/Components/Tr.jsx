import React from 'react'
import Th from './Th'
import Td from './Td';
function Tr(props) {
    const cells = new Array();
    const end = props.colsNames.length
    for(let i=0; i<end; i++){
        if(props.type===1){
            cells.push(
                <Th text = {props.colsNames[i]} row={props.row} col={i} key={i} fn={()=>{props.fn(props.colsKeys[i])}}/>
            )
        }else{
            const data = props.colsKeys[i]=='NUMBER'?props.row+1:props.data[props.colsKeys[i]];
            let highlight='';
            const indexOfHighlight = props.colsHigh!=undefined?props.colsHigh.indexOf(props.colsKeys[i]):-1;
            if(indexOfHighlight!=-1)highlight = props.colsFn[indexOfHighlight](data);
            cells.push(
                <Td content = {data} row={props.row} col={i} key={i} highlight={highlight}/>
            )
        }
    }
    return (
    <tr id={props.id}>
        {cells}
    </tr>
  )
}

export default Tr