import Input from "./Input"

function LabelInput(props) {
  return (
    <div className="flex flex-row">
      <label className="mr-2">
        {`${props.text} `}
      </label>
      <Input custom={props.custom} type = {props.type} fn={props.fn} id={props.id} change={props.change} value={props.value}/>
    </div>
  )
}

export default LabelInput