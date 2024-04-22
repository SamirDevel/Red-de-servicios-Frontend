
function Th(props) {
  return (
    <th key={`${props.row}-${props.col}`}
    className=' text-xl cursor-pointer select-none max-w-fit min-w-fit w-fit'
    onClick={props.fn}>
        {props.text}
    </th>
  )
}

export default Th