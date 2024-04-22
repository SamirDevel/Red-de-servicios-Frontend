import React from 'react'

function Div({children, width, height, orientation, parent, custom}) {
    function getNewChild(child){
        if(parent===true&&React.isValidElement(child))return React.cloneElement(child,{height, width, orientation:getOrientation()});
        else if(React.isValidElement(child))return React.cloneElement(child);
        else return child
    }
    function getType(){
        if(orientation==='flex-row') return width
        if(orientation==='flex-col') return height
    }
    function getOrientation(){
        if(parent===true){
            if(orientation==='flex-row') return 'flex-col'
            if(orientation==='flex-col') return 'flex-row'
        }else {
            return orientation
        }
    }
    function getChildren(){
        if(children.length ===undefined)return getNewChild(children);
        else {
            return children.map((child, index)=>{
                const  newChild = getNewChild(child);
                const self = getType();
                return <div className={`${self}`} key={`${orientation}-${index}`}>
                    {newChild}
                </div>
        });
        }
    }
    return (
        <div className={`flex ${orientation} ${custom!==undefined?custom:''}`}>
            {getChildren()}
        </div>
    )
}

export default Div