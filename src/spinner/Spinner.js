import React from 'react'
import './Spinner.css';

function Spinner(props){
    const small = props.small ? true : false;

    //for big spinner
    if(!small) return(
        <div className = "spinner">
            <div className = "outer">
                <div className = "inner1">
                    <div className = "inner2">
                        <div className = "inner3">
                            <div className = "inner4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    //for small spinner
    else return(
        <div className = "spinner">
            <div className = "outer small">
                
            </div>
            <div className = "inner1 small">
                    
            </div>
            <div className = "inner2 small">
                        
            </div>
            <div className = "inner3 small">
            </div>
        </div>
    )
}

export default Spinner;