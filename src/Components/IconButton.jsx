function IconButton({fn, id, icon}) {
    return (
    <button
        onClick={fn}
        id={id}
    >
        {icon}
    </button>
  )
}

export default IconButton