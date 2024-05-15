import Tr from './Tr'
import { useState, useEffect } from 'react';
function Table(props) {
    
    function quicksort(array, criterio) {
        if (array.length <= 1) {
          return array;
        }
        const pivot = array[0][criterio];
        const left = []; 
        const right = []
        for (let i = 1; i < array.length; i++) {
          array[i][criterio] < pivot ? left.push(array[i]) : right.push(array[i]);
        }
        return quicksort(left,criterio).concat(array[0], quicksort(right, criterio));
    };
      
    function reversequicksort(array, criterio) {
        if (array.length <= 1) {
          return array;
        }
        const pivot = array[0][criterio];
        const left = []; 
        const right = []
        for (let i = 1; i < array.length; i++) {
          array[i][criterio] > pivot ? right.push(array[i]) : left.push(array[i]);
        }
        return reversequicksort(right,criterio).concat(array[0], reversequicksort(left, criterio));
    };
    //states
    const [reversed, setReversed] = useState(false);
    const [criterio, setCriterio] = useState('');
    //effects
    useEffect(()=>{
        setReversed(!reversed);
    },[criterio]);

    useEffect(()=>{
        if(props.manage!=undefined){
            if(reversed)
                props.manage(reversequicksort(props.values,criterio));
            else props.manage(quicksort(props.values,criterio));
        }
    },[reversed]);

    const heads= (()=>{
        const heads = new Array();
        if(props.transposed===true){
            heads.push(props.colsNames[0]);
            const end = props.values.length;
            for(let i=0; i<end; i++)heads.push(props.values[i][props.colsKeys[0]]);
        }
        return heads
    })();
    const head = <Tr transposed={props.transposed} type={1} colsNames={props.transposed===true?heads:props.colsNames} colsKeys={props.colsKeys} row={-1} fn={props.transposed===true?undefined:sort}/>
    const array = new Array();
    const end = props.values.length;
    if(props.transposed===true){
        const end2 = props.colsKeys.length
        const newKeys = new Array();
        newKeys.push('HEAD');
        for(let i=1; i<end2; i++){
            const obj = {
                HEAD:props.colsNames[i]
            }
            for(let j=0; j<end; j++){
                obj[`${j}`] = props.values[j][props.colsKeys[i]];
                if(newKeys.includes(`${j}`)===false)newKeys.push(`${j}`);
            }
            array.push(
                < Tr 
                    colsHigh={props.colsHigh} colsFn={props.colsFn}
                    type={2} colsNames={heads} 
                    data={obj} row={i} colsKeys={newKeys} 
                    key={i} id={`${obj}`}
                />
            )
        }
    }else{
        for(let i=0; i<end; i++){
            array.push(
                < Tr
                    colsHigh={props.colsHigh} colsFn={props.colsFn}
                    type={2} colsNames={props.colsNames} 
                    data={props.values[i]} row={i} colsKeys={props.colsKeys} 
                    key={i} id={props.values[i]['ID']}
                />
            )
        }
    }
    if(props.transposed===true)console.log(array);
    function sort(object){
        if(object!=criterio){
            setCriterio(object);
        }else{
            setReversed(!reversed);
        }
    }
    return (
    <table className={`${props.values.length>0?'visible':'hidden'}`}>
        <thead className={props.theme}>
            {head}
        </thead>
        <tbody>
            {array}
        </tbody>
    </table>
  )
}

export default Table