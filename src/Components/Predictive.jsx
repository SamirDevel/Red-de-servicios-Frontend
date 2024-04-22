import { useState, useEffect, useRef } from "react";
import Input from "./Input";
function Predictive(props) {
  //States
  const [suggestions, setSuggestions] = useState([]);
  const [activeSugestion, setActiveSuggestion] = useState(-1);
  //console.log(props.list);
  //Reffs
  const optionRefs = useRef(null);
  //Effects
  useEffect(()=>{
    if(suggestions.length>0&&activeSugestion>-1)
      props.change(suggestions[activeSugestion][props.Parameter]);
      
      const container = optionRefs.current;
      const currentOption = container.children[activeSugestion];
      if (currentOption!=null && currentOption !=undefined) {
        const containerRect = container.getBoundingClientRect();
        const optionRect = currentOption.getBoundingClientRect();
  
        if (optionRect.bottom > containerRect.bottom) {
          container.scrollTop += optionRect.bottom - containerRect.bottom;
        } else if (optionRect.top < containerRect.top) {
          container.scrollTop -= containerRect.top - optionRect.top;
        }
      }
  },[activeSugestion]);
  //functions
  function filter(key, value){
    if(props.list.length>0){
      const array = props.list.reduce((filtred,option)=>{
        if(option[key].indexOf(value) != -1)filtred.push(option);
        return filtred;
      },[])
      setSuggestions(array);
      //value.length>0?setActiveSuggestion(0):setActiveSuggestion(-1);
    }
  }

  function navigateSugestions(value){
    const newSugestion = activeSugestion + value;
    if(newSugestion>=0&&newSugestion<suggestions.length)setActiveSuggestion(newSugestion);
  }

  function setList(){
        return suggestions.map((suggestion, index)=>(
         <div className={`w-fit ${
          index==activeSugestion?
          'bg-blue-600 text-white rounded-2xl'
          :'bg-white text-inherit'
          } hover:bg-blue-600 hover:text-white cursor-pointer pointer-events-auto select-auto`} 
          key={`${suggestion[props.Parameter]}-${suggestion['id']}`}
          onMouseDown={()=>{props.change(suggestions[index][props.Parameter]);props.fn()}}>
            {props.Diferencer != undefined?`${suggestion[props.Parameter]}, ${suggestion[props.Diferencer]}`:suggestion[props.Parameter]}
        </div>
        ));
  }
  return (
    <div
      onBlur={(e)=>{
        setActiveSuggestion(0);
        setSuggestions([]);
      }}
      onFocus={(e)=>{
        if(e.target.value.length>0)
          filter(props.Parameter,e.target.value.toUpperCase());
      }}
      onKeyDown={e=>{
        if(e.target.value.length>0){
          if(e.key=='ArrowUp')navigateSugestions(-1);
          if(e.key=='ArrowDown')navigateSugestions(1);
        }
      }}
      className=' w-1/4 bg-white'
    >
      <div>
        <Input fn={()=>{
          if(props.value.length>0)activeSugestion>-1?props.change(suggestions[activeSugestion][props.Parameter]):props.change(suggestions[0][props.Parameter]);
          props.fn()
        }} 
        id={props.id} 
        change={e=>{
          props.change(e.target.value);
          filter(props.Parameter,e.target.value.toUpperCase());
        }} 
        value={props.value}
        type='search'/>
      </div>
      <div ref={optionRefs} className={`${props.value.length>0?'visible absolute z-20 bg-white h-40 overflow-auto':'hidden'}`}>
        {setList()}
      </div>
    </div>
  )
}

export default Predictive