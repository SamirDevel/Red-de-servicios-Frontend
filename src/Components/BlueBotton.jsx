function BlueBotton({fn, text, id}){
    return (
        <button
            onClick={fn}
            className = "text-white text-2xl bg-cyan-600 w-32 h-fit rounded-xl self-center place-self-center hover:bg-white hover:text-cyan-600"
            id={id}
            type="button"
        >
            {text}
        </button>
    )
}

export default BlueBotton