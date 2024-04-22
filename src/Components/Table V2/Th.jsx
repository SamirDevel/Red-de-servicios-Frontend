import { useState, useEffect } from "react";

function Th(props) {
    const [reversed, setReversed] = useState(false);
    
    useEffect(()=>{
        props.clicked(reversed);
    },[reversed])

    return (
        <th className='text-xl cursor-pointer select-none max-w-fit min-w-fit w-fit' onClick={e=>setReversed(reversed=>!reversed)}>
            {props.content}
        </th>
    )
}

export default Th