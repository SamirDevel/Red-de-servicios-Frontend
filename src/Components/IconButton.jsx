function IconButton(props) {
    return (
    <button
        onClick={props.fn}
        id={props.id}
    >
        {props.icon}
    </button>
  )
}

export default IconButton