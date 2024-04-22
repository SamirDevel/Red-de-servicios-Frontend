import { list } from "postcss";
import Option from "./Option"

function Select(props) {
    const end = props.list.length;
    const array = new Array();
    for(let i=0; i<end; i++){
      let text;
      let value;
      let key; 
      if(props.criterio!=undefined){
        text = value = key = props.list[i][props.criterio];
      }else{
        text = value = key = props.list[i];
      }
      array.push( <Option text={text} value={value} key={key}/> )
    }
    return (
    <select id={props.id} key='select'
     onChange={props.fn}
     className = {`rounded-xl border-solid border-2 border-black ${props.custom}`}
     >
        <Option text = 'Seleccionar Opcion' value={-1} key='-1'/>
        {array}
    </select>
  )
}

export default Select