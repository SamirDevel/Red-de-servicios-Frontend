import { list } from "postcss";
import Option from "./Option"

function Select({list, criterio, id, fn, custom}) {
    const end = list.length;
    const array = new Array();
    for(let i=0; i<end; i++){
      let text;
      let value;
      let key; 
      if(criterio!=undefined){
        text = value = key = list[i][criterio];
      }else{
        text = value = key = list[i];
      }
      array.push( <Option text={text} value={value} key={key}/> )
    }
    return (
    <select id={id} key='select'
     onChange={fn}
     className = {`rounded-xl border-solid border-2 border-black ${custom}`}
     >
        <Option text = 'Seleccionar Opcion' value={-1} key='-1'/>
        {array}
    </select>
  )
}

export default Select