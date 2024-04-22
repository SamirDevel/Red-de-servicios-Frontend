import Select from './Select'

function LabelSelect(props) {
  return (
    <div className='flex flex-row'>
      <label className='mr-1'>
          {props.text}
      </label>
      <Select list={props.list} id={props.id} fn={props.fn} value={props.value} criterio={props.criterio}/>
    </div>
  )
}

export default LabelSelect