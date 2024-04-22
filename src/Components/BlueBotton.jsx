function BlueBotton(props){
    return (
        <button
            onClick={props.fn}
            className = "text-white text-2xl bg-cyan-600 w-32 h-fit rounded-xl self-center place-self-center hover:bg-white hover:text-cyan-600"
            id={props.id}
            type="button"
        >
            {props.text}
        </button>
    )
}

export default BlueBotton