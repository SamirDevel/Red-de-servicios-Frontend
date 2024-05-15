import Select from './Select'

function LabelSelect({text, list, id, fn, value, criterio}) {
  return (
    <div className='flex flex-row'>
      <label className='mr-1'>
          {text}
      </label>
      <Select list={list} id={id} fn={fn} value={value} criterio={criterio}/>
    </div>
  )
}

export default LabelSelect