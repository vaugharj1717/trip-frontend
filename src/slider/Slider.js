import React, {useState} from 'react'
import SelectDestinationBox from '../select-destination-box/SelectDestinationBox.js';
import DestinationBox from '../destination-box/DestinationBox.js';
import SliderNameplate from '../slider-nameplate/SliderNameplate.js';
import './Slider.css';
import {useSelector, useDispatch} from 'react-redux';
import {startAddingDestination, startSelectingDestination, startDeletingDestination,
showDestinationSelect, hideDestinationSelect} from '../actions.js';

function Slider(props){
    const dispatch = useDispatch();
    const destinations = props.destinations;
    const [selectionIndex, setSelectionIndex] = useState(-1);
    const [showDestinationSelector, setShowDestinationSelector] = useState(false);

    const currentTrip = useSelector(state => state.currentTrip);

    function onAddDestinationSelect(i){
        if(i === selectionIndex){
            setShowDestinationSelector(false);
            setSelectionIndex(-1);
        }
        else{
            setSelectionIndex(i);
            setShowDestinationSelector(true);
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
                <div className="slider-destination-connector">
                    <div className="slider-add-button slider-first" onClick={() => onAddDestinationSelect(0)}>
                    {0 === selectionIndex && showDestinationSelector &&
                        <SelectDestinationBox isFirst={true}/>
                    }
                    </div>
                </div>
                {destinations.map((d, i) => {
                    return(
                        <div key={d.id} className="slider-destination-container">
                            <DestinationBox destination={d}/>
                            {(i !== destinations.length - 1) &&
                                <div className="slider-destination-connector">
                                    <div className="slider-add-button" onClick={() => onAddDestinationSelect(i+1)}>
                                        {i + 1 === selectionIndex && showDestinationSelector &&
                                            <SelectDestinationBox index={i+1} isFirst={false}/>
                                        }
                                    </div>
                                </div>
                            }
                            {(i === destinations.length - 1) &&
                                <div className="slider-destination-connector">
                                    <div className="slider-add-button slider-last" onClick={() => {onAddDestinationSelect(i+1)}}>
                                        {i + 1 === selectionIndex && showDestinationSelector &&
                                            <SelectDestinationBox index={i+1} isFirst={false}/>
                                        }
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