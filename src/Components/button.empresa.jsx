

function ButtonEmpresa({text, fn}) {
  return (
    <button onClick={e=>{
        e.preventDefault();
        fn();
    }}
    className="w-[150px] bg-cyan-600 h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#007490] before:to-[rgb(103,232,249)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-[#fff]">
        {text}
    </button>
  )
}

export default ButtonEmpresa