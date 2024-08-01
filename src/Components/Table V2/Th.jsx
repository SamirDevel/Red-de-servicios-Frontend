import { useState, useEffect } from "react";

function Th({clicked, content}) {
    const [reversed, setReversed] = useState(false);
    
    useEffect(()=>{
        clicked(reversed);
    },[reversed])

    return (
        <th className='text-xl cursor-pointer max-w-fit min-w-fit w-fit' onClick={e=>setReversed(reversed=>!reversed)}>
            {content}
        </th>
    )
}

export default Th