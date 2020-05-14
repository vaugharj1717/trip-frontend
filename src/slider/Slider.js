import React, {useState} from 'react'
import SelectDestinationBox from '../select-destination-box/SelectDestinationBox.js';
import DestinationBox from '../destination-box/DestinationBox.js';
import SliderNameplate from '../slider-nameplate/SliderNameplate.js';
import './Slider.css';
import {useSelector, useDispatch} from 'react-redux';
import {setShowDestinationSelector, hideDestinationSelect} from '../actions.js';


const streetTitles = ["St", "Blvd", "Ave", "Ln", "Way", "Ct"]

function Slider(props){
    const dispatch = useDispatch();
    const destinations = props.destinations;
    destinations.sort((a, b) => a.dindex > b.dindex ? 1 : -1);
    console.log(destinations);
    const [selectionIndex, setSelectionIndex] = useState(-1);
    const showDestinationSelector = useSelector(state => state.showDestinationSelector);
    const currentTrip = useSelector(state => state.currentTrip);
    

    function onAddDestinationSelect(i){
        if(i === selectionIndex && showDestinationSelector){
            setSelectionIndex(-1);
            dispatch(setShowDestinationSelector(false));
        }
        else{
            setSelectionIndex(i);
            dispatch(setShowDestinationSelector(true));
            
        }
    }

    function onHideDestinationSelect(){
        dispatch(hideDestinationSelect());
    }

    return(
        <div className="slider-root">
            
        {currentTrip && currentTrip.id &&
            <SliderNameplate trip={currentTrip}/>
        }
        
            <div className="slider">
            {/* {currentTrip && currentTrip.id && destinations.length > 0 &&
                <div className="slider-destination-connector-first">
                    <div className="slider-add-button slider-first" onClick={() => onAddDestinationSelect(0)}>
                    {0 === selectionIndex && showDestinationSelector &&
                        <SelectDestinationBox isFirst={true} index={0}/>
                    }
                    <div className = "slider-add-button-text">New Destination</div>
                    <div className = "slider-add-button-street">{streetTitles[0]}</div>
                    </div>
                </div>
            } */}

            {currentTrip && currentTrip.id && destinations.length === 0 &&
                <div className="slider-destination-connector-only">
                    <div className="slider-add-button slider-first" onClick={() => onAddDestinationSelect(0)}>
                    {0 === selectionIndex && showDestinationSelector &&
                        <SelectDestinationBox isFirst={true} index={0}/>
                    }
                    <div className = "slider-add-button-text">Choose Starting Point</div>
                    </div>
                </div>
            }
                {destinations.map((d, i) => {
                    return(
                        <div key={d.id} className="slider-destination-container">
                            <DestinationBox i={i} destination={d}/>
                            {(i !== destinations.length - 1) &&
                                <div className="slider-destination-connector">
                                    <div className="slider-add-button" onClick={() => onAddDestinationSelect(i+1)}>
                                        {i + 1 === selectionIndex && showDestinationSelector &&
                                            <SelectDestinationBox index={i+1} isFirst={false}/>
                                        }
                                        <div className = "slider-add-button-text">Add Destination</div>
                                        <div className = "slider-add-button-street">{streetTitles[(i+1) % streetTitles.length]}</div>
                                    </div>
                                </div>
                            }
                            {(i === destinations.length - 1) &&
                                <div className="slider-destination-connector">
                                    <div className="slider-add-button slider-last" onClick={() => {onAddDestinationSelect(i+1)}}>
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