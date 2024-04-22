function Input(props) {
  function enterKey(e){
    if(e.key === 'Enter'){
      if(props.fn !== undefined)props.fn()
      //e.target.blur();
    }
  }
  return (      
    <input
      type={props.type}
      className= {`${props.custom} px-2 rounded-xl border-solid border-2 border-black h-7`}
      onKeyDown={enterKey}
      id={props.id}
      onChange={props.change}
      value = {props.value}
      placeholder={props.placeholder}
      autoComplete={props.list}
      ref={props.customRef}
    >
    </input>
  )
}

export default Input