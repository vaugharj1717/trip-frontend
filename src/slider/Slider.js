import React, {useState} from 'react'
import SelectDestinationBox from '../select-destination-box/SelectDestinationBox.js';
import DestinationBox from '../destination-box/DestinationBox.js';
import SliderNameplate from '../slider-nameplate/SliderNameplate.js';
import './Slider.css';
import {useSelector, useDispatch} from 'react-redux';
import {setShowDestinationSelector} from '../actions.js';


const streetTitles = ["St", "Blvd", "Ave", "Ln", "Way", "Ct"]

function Slider(props){
    const dispatch = useDispatch();
    const destinations = props.destinations;
    destinations.sort((a, b) => a.dindex > b.dindex ? 1 : -1);
    const [selectionIndex, setSelectionIndex] = useState(-1);
    const showDestinationSelector = useSelector(state => state.showDestinationSelector);
    const currentTrip = useSelector(state => state.currentTrip);
    

    function onAddDestinationSelect(i){
        //If selected destination is the currently selected destination, unselect that destination
        if(i === selectionIndex && showDestinationSelector){
            setSelectionIndex(-1);
            dispatch(setShowDestinationSelector(false));
        }

        //Set index of selected destination and show destination selector panel
        else{
            setSelectionIndex(i);
            dispatch(setShowDestinationSelector(true));
            
        }
    }

    return(
        <div className="slider-root">
        
        {/*If a trip is selected, show it's name plate*/}
        {currentTrip && currentTrip.id &&      
            <SliderNameplate trip={currentTrip}/>
        }
        
            <div className="slider">
            {/*If a trip is selected with at least one destination, show first destination selector*/}
            {currentTrip && currentTrip.id && destinations.length === 0 &&
                <div className="slider-destination-connector-only">
                    <div className="slider-add-button slider-first" onClick={(e) => {onAddDestinationSelect(0); e.stopPropagation()}}>
                    {0 === selectionIndex && showDestinationSelector &&    
                        <SelectDestinationBox isFirst={true} index={0}/>
                    }
                    <div className = "slider-add-button-text">Choose Starting Point</div>
                    </div>
                </div>
            }
                {/*For each destination, show it's destination box and connect it to the next destination box*/}
                {destinations.map((d, i) => {          
                    return(
                        <div key={d.id} className="slider-destination-container">
                            <DestinationBox i={i} destination={d}/>
                            {/*For every destination box except for the last one*/}
                            {(i !== destinations.length - 1) &&
                                <div className="slider-destination-connector">
                                    <div className="slider-add-button" onClick={(e) => {onAddDestinationSelect(i+1); e.stopPropagation()}}>
                                        {i + 1 === selectionIndex && showDestinationSelector &&
                                            <SelectDestinationBox index={i+1} isFirst={false}/>
                                        }
                                        <div className = "slider-add-button-text">Add Destination</div>
                                        <div className = "slider-add-button-street">{streetTitles[(i+1) % streetTitles.length]}</div>
                                    </div>
                                </div>
                            }

                            {/*For the final destination box, connect it to the final "Add Destination" button*/}
                            {(i === destinations.length - 1) &&   
                                <div className="slider-destination-connector">
                                    <div className="slider-add-button slider-last" onClick={(e) => {onAddDestinationSelect(i+1); e.stopPropagation()}}>
                                        {i + 1 === selectionIndex && showDestinationSelector &&
                                            <SelectDestinationBox index={i+1} isFirst={false}/>
                                        }
                                        <div className = "slider-add-button-text">Add Destination</div>
                                        <div className = "slider-add-button-street">{streetTitles[(i+ 1) % streetTitles.length]}</div>
                                    </div>
                                </div>
                            }
                        </div> 
                    );
                })}
            </div>
        </div>
    )
}

export default Slider;