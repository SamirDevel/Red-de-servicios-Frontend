function Input({fn, type, custom, id, change, value, placeholder, list, customRef}) {
  function enterKey(e){
    if(e.key === 'Enter'){
      if(fn !== undefined)fn()
      //e.target.blur();
    }
  }
  return (      
    <input
      type={type}
      className= {`${custom} px-2 rounded-xl border-solid border-2 border-black h-7`}
      onKeyDown={enterKey}
      id={id}
      onChange={change}
      value = {value}
      placeholder={placeholder}
      autoComplete={list}
      ref={customRef}
    >
    </input>
  )
}

export default Input