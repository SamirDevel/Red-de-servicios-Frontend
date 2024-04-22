import {useState, useEffect, useRef} from 'react'
import {BiDownArrow} from 'react-icons/bi';
function CheckList(props) {
    //refs
    const divRef = useRef(null);
    const listRef = useRef(null);
    const checkRefs = useRef(null);
    //states    
    const [focus, setFocus] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [checkeds, setCheckeds] = useState([]);
    const [currentCheckeds, setCurrentCheckeds] = useState([]);
    //effects
    useEffect(()=>{
        const  newSibling = listRef.current.childNodes[0].childNodes[activeSuggestion];
        if (newSibling) {
            newSibling.scrollIntoView({
                block: 'center',
            });
            //console.log(newSibling);
        }
    },[activeSuggestion]);
    
    useEffect(()=>{
        props.visibility(!focus);
    },[focus]);
    
    useEffect(()=>{
        const  list = listRef.current.childNodes[0].childNodes;
        const end = list.length;
        for(let i=0; i<end; i++){
            const element = list[i].childNodes[0];
            const box = element.childNodes[0]
            const value = element.childNodes[0].textContent;
            box.checked =checkeds.some(el=>el===value?true:false);
            //
        }
        props.fn(checkeds);
    },[checkeds])
    //functions
    function navigateSuggestions(value){
        const newSugestion = activeSuggestion + value;
        if(newSugestion>=0&&newSugestion<props.list.length)setActiveSuggestion(newSugestion);
    }
    function handleCheck(flag,value){
        flag===true
        ?(setCurrentCheckeds([...currentCheckeds, ...[value]]))
        :(setCurrentCheckeds(prev=>prev.filter(item=>item!=value)));
    }
    return (
        <div ref={divRef}>
            <div className = {`select-none hover:bg-cyan-600 ${focus==false?'border-solid border-black border-2':''} hover:text-white w-36`}
            onClickCapture={(e)=>{setFocus(!focus)}}>
                <h3 className ='flex flex-row justify-evenly'>{props.name} <BiDownArrow className=' mt-1'/></h3>
            </div>
            <div tabIndex={0} ref={listRef} className={`${focus==true?'visible absolute h-40':'hidden'} overflow-auto bg-white`}
            onKeyDown={(e)=>{
                e.preventDefault();
                let Number = 0;
                if(e.key=='Enter'){
                    divRef.current.blur();
                    setFocus(false);
                }
                else if (e.key === 'ArrowUp') {
                    Number = -1;
                } else if (e.key === 'ArrowDown') {
                    Number = 1;
                }else if(e.key == ' '){
                    const myRef = listRef.current.childNodes[0].childNodes[activeSuggestion].childNodes[0];
                    //console.log(myRef.childNodes[1]);
                    myRef.childNodes[0].checked = !myRef.childNodes[0].checked;
                    handleCheck(myRef.childNodes[0].checked,myRef.childNodes[1]);
                    //props.fn(e);
                }
                navigateSuggestions(Number);
            }}
            onBlur={(e)=>{
                e.preventDefault();
                const isClickInside = divRef.current.contains(e.target);
                if (!isClickInside) {
                    setFocus(false);
                    setActiveSuggestion(0);
                }
                //console.log(e.currentTarget);
            }}>
                <ul ref={checkRefs} className=' select-none'>
                    {props.list.map((item, i)=>{
                        return <li key={`${i}-${props.list[i]}`} 
                        className={`${
                            i==activeSuggestion?
                            'bg-blue-600 text-white rounded-2xl'
                            :'bg-inherit text-inherit'
                            }`}
                            >
                            <label>
                                <input type="checkbox" onChange={(e)=>handleCheck(e.target.checked,item[props.Key])}/>
                                {item[props.Key]}
                            </label> 
                        </li>
                    })}
                </ul>
                <div className='flex flex-col'>
                    <button className=' text-white text-lg bg-cyan-600 h-7 rounded-md hover:bg-white hover:text-cyan-600' onClick={e=>{
                        e.preventDefault();
                        setCheckeds([...currentCheckeds]);
                        setFocus(false);
                    }}>Aceptar</button>
                    <button className=' text-white text-lg bg-cyan-600 h-7 rounded-md hover:bg-white hover:text-cyan-600' onClick={e=>{
                        e.preventDefault();
                        setCheckeds([...checkeds]);
                        setFocus(false);
                    }}>Cancelar</button>
                </div>
            </div>
        </div>
    )
}
export default CheckList