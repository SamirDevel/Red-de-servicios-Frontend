import { useState, useEffect } from "react"
import Thead from "./Thead"
import Tbody from "./Tbody"
import Tfoot from "./Tfoot"

function Table(props) {
    const [heads, setHeads] = useState(props.colsHeads)
    const [values, setValues] = useState([])
    const [sorted, setSorted] = useState([])
    useEffect(()=>{
        setValues(props.list.map(item=>item))
        setSorted([])
    }, [props.list])

    useEffect(()=>{
        if(sorted.length>0)setValues([])
    }, [sorted])

    useEffect(()=>{
        if(sorted.length>0)setValues(sorted)
    },[values])

    function quicksort(array, criterio, reversed) {
        if (array.length <= 1) {
          return array;
        }
        const pivot = array[0][criterio];
        const left = []; 
        const right = []
        for (var i = 1; i < array.length; i++) {
            const menor = array[i][criterio] < pivot;
            if(reversed === true) menor===true ?left.push(array[i]) :right.push(array[i]);
          else menor===true ?right.push(array[i]) :left.push(array[i]);
        }
        return quicksort(left,criterio, reversed).concat(array[0], quicksort(right, criterio, reversed));
    };

    function handleClickHead(index, reversed){
        if(values.length>0){
            const keys = Object.keys(values[0]);
            const key = keys[index];
            setSorted(quicksort(values,key,reversed))
        }
    }

    return (
        <table className="mx-1">
            <Thead theme={`${props.theme}`} heads={heads} clicked={handleClickHead}/>
            <Tbody heads={heads} values={values} keyName={props.keyName}/>
            {(()=>{
                
                if(props.foots!==undefined)return <Tfoot theme={props.theme} heads={heads} values={props.foots} keyName={props.keyName}/>
            })()}
        </table>
    )
}

export default Table