import Input from "./Input"

function IconInput(props) {
    const custom='border border-gray-300 rounded-md py-2 pl-10 pr-4 block w-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:bg-white focus:border-black focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:ring-offset-0 sm:text-sm';
    return (
    <div className="relative flex">
        <span className="absolute text-gray-400">
            {props.icon}
        </span>
        <Input custom={custom} id={props.id} placeholder={props.placeholder} value={props.value} change={props.change}/>
    </div>
  )
}

export default IconInput