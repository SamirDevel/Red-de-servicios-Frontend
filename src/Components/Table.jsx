import Tr from './Tr'
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fns } from '../Functions';
function Table({manage, values, transposed, colsNames, colsKeys, colsHigh, colsFn, theme}) {
    
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

    function onDragEnd(result) {
        if (!result.destination) {
          return;
        }
    
        const reorderedItems = fns.reorder(
          values,
          result.source.index,
          result.destination.index
        );
    
        manage(reorderedItems);
      }
    //states
    const [reversed, setReversed] = useState(false);
    const [criterio, setCriterio] = useState('');
    //effects
    useEffect(()=>{
        setReversed(!reversed);
    },[criterio]);

    useEffect(()=>{
        if(manage!=undefined){
            if(reversed)
                manage(reversequicksort(values,criterio));
            else manage(quicksort(values,criterio));
        }
    },[reversed]);

    const heads= (()=>{
        const heads = new Array();
        if(transposed===true){
            heads.push(colsNames[0]);
            const end = values.length;
            for(let i=0; i<end; i++)heads.push(values[i][colsKeys[0]]);
        }
        return heads
    })();
    const head = <Tr transposed={transposed} type={1} colsNames={transposed===true?heads:colsNames} colsKeys={colsKeys} row={-1} fn={transposed===true?undefined:sort}/>
    const array = new Array();
    const end = values.length;
    if(transposed===true){
        const end2 = colsKeys.length
        const newKeys = new Array();
        newKeys.push('HEAD');
        for(let i=1; i<end2; i++){
            const obj = {
                HEAD:colsNames[i]
            }
            for(let j=0; j<end; j++){
                obj[`${j}`] = values[j][colsKeys[i]];
                if(newKeys.includes(`${j}`)===false)newKeys.push(`${j}`);
            }
            array.push(
                <Draggable key={i} draggableId={i.toString()} index={i}>
                    {
                        provided=>(
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                < Tr 
                                colsHigh={colsHigh} colsFn={colsFn}
                                type={2} colsNames={heads} 
                                data={obj} row={i} colsKeys={newKeys} 
                                key={i} id={`${obj}`}
                                />
                            </div>
                        )
                    }
                </Draggable>
            )
        }
    }else{
        for(let i=0; i<end; i++){
            array.push(
                <Draggable key={i} draggableId={i.toString()} index={i}>
                    {
                        provided=>(
                            < Tr
                                colsHigh={colsHigh} colsFn={colsFn}
                                type={2} colsNames={colsNames} 
                                data={values[i]} row={i} colsKeys={colsKeys} 
                                key={i} id={values[i]['ID']}
                                dragRef={provided.innerRef} draggable={provided.draggableProps} handler={provided.dragHandleProps}
                            />
                        )
                    }
                </Draggable>
            )
        }
    }
    if(transposed===true)console.log(array);
    function sort(object){
        if(object!=criterio){
            setCriterio(object);
        }else{
            setReversed(!reversed);
        }
    }
    return (
    <DragDropContext onDragEnd={onDragEnd}>
        <table className={`${values.length>0?'visible':'hidden'}`}>
            <thead className={theme}>
                {head}
            </thead>
            <Droppable droppableId='droppableRow'>
                {provided=>(
                    <tbody {...provided.droppableProps} ref={provided.innerRef}>
                        {array}
                        {provided.placeholder}
                    </tbody>
                )}
            </Droppable>
        </table>
    </DragDropContext>
  )
}

export default Table