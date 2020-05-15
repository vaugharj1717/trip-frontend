import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Action, startSavingNote, startChangingDate, startChangingDepDate} from '../actions.js';
import {debounce} from '../helpers.js';
import './Display.css';
import Spinner from '../spinner/Spinner.js';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//handler methods
let handleNoteChange;
let handleDateChange;
let handleDepDateChange;

function Display(props){
    const dispatch = useDispatch();
    const destination = props.currentDestination;
    // const destination = useSelector(state => state.currentDestination);
    const trip = props.currentTrip;
    const showDestinationSelector = useSelector(state => state.showDestinationSelector);
    const user = useSelector(state => state.user);

    //initial dates
    const [month, setMonth] = useState("01");
    const [day, setDay] = useState("01");   
    const [year, setYear] = useState("2020"); 
    const [hour, setHour] = useState("12");
    const [min, setMin] = useState("00");
    const [half, setHalf] = useState("AM");
    const [text, setText] = useState("");
    const [depMonth, setDepMonth] = useState("01");
    const [depDay, setDepDay] = useState("01");   
    const [depYear, setDepYear] = useState("2020"); 
    const [depHour, setDepHour] = useState("12");
    const [depMin, setDepMin] = useState("00");
    const [depHalf, setDepHalf] = useState("AM");

    //setters for positioning purposes
    const [left, setLeft] = useState(400);
    const [height, setHeight] = useState(400);
    const [right, setRight] = useState(0);

    //date validator
    const [validDate, setValidDate] = useState(true);

    //hooks for loading states
    const destinationLoading = useSelector(state => state.destinationLoading);
    const tripLoading = useSelector(state => state.tripLoading);
    const noteLoading = useSelector(state => state.noteLoading);
    const dateLoading = useSelector(state => state.dateLoading);

    
    //handler for resizing and scroll events
    useEffect( () => {
        //handler for resize events
        function handleResize(){
            const pageHeight = window.innerHeight;
            const pageWidth = window.innerWidth;
            const notesHeight = 350;
            if(pageHeight < 815 && pageHeight > 500){
                //for every 40px, remove 40px from note (to maintain text position on background linear gradient)
                const numRows = Math.floor((730 - pageHeight) / 38);
                setHeight(notesHeight - (38 * numRows));
            }
                //min height for note area
            else if(pageHeight <= 500){
                setHeight(156);
            }

            let name; let photo;
            photo = document.getElementById('photo');
            if(document.getElementById('name')) name = document.getElementById('name');


            //prevent name of destination from colliding with photo
            if(photo && name !== undefined && pageWidth < 1250 && pageWidth > 1000){
                setRight((1250 - pageWidth) * .5);
            }
            else if(photo && name !== undefined && pageWidth <= 1035 && pageWidth > 950) {setRight(((1250 - pageWidth) * .5) - 35);}
            else if(photo && pageWidth <= 950){setRight(114);}
            else {setRight(0);}
        }

        //handler for scroll events
        function handleScroll(){
            //allow Display to be scrollable left-to-right (while remaining fixed top-to-bottom)
            const left = document.documentElement.scrollLeft;
            setLeft(400 - left);
        }
    
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        
        handleResize();
        handleScroll();

        //cleanup function, remove event listeners
        return ()=>{
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize)
        }
        
    }, [destination]);


    //initialize date when new destination is selected
    useEffect( () => {
        const initArrival = (destination && destination.arrival) ? destination.arrival : {month: "01", day: "01", year: "2020", hour: "12", min: "00", half: "AM"};
        const initDeparture = (destination && destination.departure) ? destination.departure : {month: "01", day: "01", year: "2020", hour: "12", min: "00", half: "AM"};
        const initText = (destination && destination.text !== null) ? destination.text : "";
        setText(initText);
        setMonth(initArrival.month); setDepMonth(initDeparture.month);
        setDay(initArrival.day);     setDepDay(initDeparture.day);
        setYear(initArrival.year);   setDepYear(initDeparture.year);
        setHour(initArrival.hour);   setDepHour(initDeparture.hour);
        setMin(initArrival.min);     setDepMin(initDeparture.min);
        setHalf(initArrival.half);   setDepHalf(initDeparture.half);
        setValidDate(true);
    }, [destination]);

    //handle changes to date or note by user
    useEffect(() => {

        //create debounced method for saving notes
        const doNoteSave = debounce((text, id, tripid) => {
            dispatch(startSavingNote(text, id, tripid));
        }, 1000, false);

        //create debounced method for saving arrival time
        const doDateChange = debounce((month, day, year, hour, min, half, tripid, id) => {
            if(isSanitized(month, day, year, hour, min, half)){
                dispatch(startChangingDate(month, day, year, hour, min, half, tripid, id));
            }
            else{
                setValidDate(false);
                dispatch({type: Action.DateLoading, payload: false})
            }
        }
        , 500, false);

        //create debounced method for saving departure time
        const doDepDateChange = debounce((month, day, year, hour, min, half, tripid, id) => {
            if(isSanitized(month, day, year, hour, min, half)){
                dispatch(startChangingDepDate(month, day, year, hour, min, half, tripid, id));
            }
            else{
                setValidDate(false);
                dispatch({type: Action.DateLoading, payload: false})
            }
        }
        , 500, false);

        //when change is made to note, show loading indicator and call debounce method
        handleNoteChange = function(text, id, tripid){
            dispatch({type: Action.NoteLoading, payload: true});
            setText(text);
            doNoteSave(text, id, tripid);
        }

        //when change is made to arrival date, show loading indicator and call debounce method
        handleDateChange = function(month, day, year, hour, min, half, tripid, id){
            dispatch({type: Action.DateLoading, payload: true});
            doDateChange(month, day, year, hour, min, half, tripid, id);
            setValidDate(true);
        }

        //when change is made to departure date, show loading indicator and call debounce method
        handleDepDateChange = function(month, day, year, hour, min, half, tripid, id){
            dispatch({type: Action.DateLoading, payload: true});
            doDepDateChange(month, day, year, hour, min, half, tripid, id);
            setValidDate(true);
        }

        //check if date input is sanitized
        function isSanitized(month, day, year, hour, min, half){
            if(!month || month === null || month.length !== 2 || isNaN(month) || month <= 0 || month > 12 || month.indexOf('-') !== -1 || month.indexOf('.') !== -1 || month.indexOf(' ') !== -1){
                return false;
            }
            if(!year || year === null || year.length !== 4 || isNaN(year) || year < 1000 || year.indexOf('-') !== -1 || year.indexOf('.') !== -1 || year.indexOf(' ') !== -1) {
                return false;
            } 
            if(!hour || hour === '' || hour.length !== 2 || isNaN(hour) || hour <= 0 || hour > 12 || hour.indexOf('-') !== -1 || hour.indexOf('.') !== -1 || hour.indexOf(' ') !== -1) {
                return false;
            }
            if(!min || min.length !== 2 || isNaN(min) || min < 0 || min >= 60 || min.indexOf('-') !== -1 || min.indexOf('.') !== -1 || min.indexOf(' ') !== -1) {
                return false;
            }
            if(!day || day.length !== 2 || isNaN(day) || day <= 0 || day > 31 || day.indexOf('-') !== -1 || day.indexOf('.') !== -1 || day.indexOf(' ') !== -1) {
                return false;
            }
            if(!half || (half !== "PM" && half !== "AM")){
                return false;
            }
            return true;
        }
    }, [dispatch]);

    //call date change handlers when change is made to dates
    useEffect(() => {
        if(destination){
            handleDateChange(month, day, year, hour, min, half, destination.tripid, destination.id);
        }
    }, [month, day, year, hour, min, half, destination]);

    useEffect(() => {
        if(destination){
            handleDepDateChange(depMonth, depDay, depYear, depHour, depMin, depHalf, destination.tripid, destination.id);
        }
    }, [depMonth, depDay, depYear, depHour, depMin, depHalf, destination]);

    //when user clicks on display area, automatically sanitize date input
    function handleClick(){
        sanitizeDateInput();
        sanitizeDepDateInput();
    }

    //sanitize date input
    function sanitizeDepDateInput(){
        if(isNaN(depMonth) || depMonth <= 0 || depMonth > 12 || depMonth.indexOf(' ') !== -1 || depMonth.indexOf('-') !== -1 || depMonth.indexOf('.') !== -1 || depMonth.indexOf(' ') !== -1) {
            setDepMonth("01");
        } else{setDepMonth(depMonth => depMonth.padStart(2, '0'))}
        if(isNaN(depYear) || depYear < 1000 || depYear.indexOf(' ') !== -1 || depYear.indexOf('-') !== -1 || depYear.indexOf('.') !== -1 || depYear.indexOf(' ') !== -1) {
            setDepYear("2020");
        } 
        if(isNaN(depHour) || depHour <= 0 || depHour > 12 || depHour.indexOf(' ') !== -1 || depHour.indexOf('-') !== -1 || depHour.indexOf('.') !== -1 || depHour.indexOf(' ') !== -1) {
            setDepHour("01");
        } else{setDepHour(depHour => depHour.padStart(2, '0'))}
        if(isNaN(depMin) || depMin < 0 || depMin >= 60 || depMin.indexOf(' ') !== -1 || depMin.indexOf('-') !== -1 || depMin.indexOf('.') !== -1 || depMin.indexOf(' ') !== -1) {
            setDepMin("00");
        } else{setDepMin(depMin => depMin.padStart(2, '0'))}
        if(isNaN(depDay) || depDay <= 0 || depDay > 31 || depDay.indexOf(' ') !== -1 || depDay.indexOf('-') !== -1 || depDay.indexOf('.') !== -1 || depDay.indexOf(' ') !== -1) {
            setDepDay("01");
        } else{setDepDay(depDay => depDay.padStart(2, '0'))}
        if(depHalf.toUpperCase() !== "PM" && depHalf.toUpperCase() !== "AM"){
            setHalf("AM");
        } else{setDepHalf(depHalf => depHalf.toUpperCase())}
    }

    //sanitize date input
    function sanitizeDateInput(){
        if(isNaN(month) || month <= 0 || month > 12 || month.indexOf(' ') !== -1 || month.indexOf('-') !== -1 || month.indexOf('.') !== -1 || month.indexOf(' ') !== -1) {
            setMonth("01");
        } else{setMonth(month => month.padStart(2, '0'))}
        if(isNaN(year) || year < 1000 || year.indexOf(' ') !== -1 || year.indexOf('-') !== -1 || year.indexOf('.') !== -1 || year.indexOf(' ') !== -1) {
            setYear("2020");
        } 
        if(isNaN(hour) || hour <= 0 || hour > 12 || hour.indexOf(' ') !== -1 || hour.indexOf('-') !== -1 || hour.indexOf('.') !== -1 || hour.indexOf(' ') !== -1) {
            setHour("01");
        } else{setHour(hour => hour.padStart(2, '0'))}
        if(isNaN(min) || min < 0 || min >= 60 || min.indexOf(' ') !== -1 || min.indexOf('-') !== -1 || min.indexOf('.') !== -1 || min.indexOf(' ') !== -1) {
            setMin("00");
        } else{setMin(min => min.padStart(2, '0'))}
        if(isNaN(day) || day <= 0 || day > 31 || day.indexOf(' ') !== -1 || day.indexOf('-') !== -1 || day.indexOf('.') !== -1 || day.indexOf(' ') !== -1) {
            setDay("01");
        } else{setDay(day => day.padStart(2, '0'))}
        if(half.toUpperCase() !== "PM" && half.toUpperCase() !== "AM"){
            setHalf("AM");
        } else{setHalf(half => half.toUpperCase())}
    }

    //Display when destination is selected
    if(destination && !destinationLoading) return(
        <div id="display" style={{left: `${left}px`}} onClick={handleClick} className={showDestinationSelector ? "display-z" : "display"}>

                {/*Header*/}
                <div className="display-header-container">
                    <div className="display-header-left">
                        {/*Photo*/}
                        {destination.fetchphotourl && destination.fetchphotourl !== "nophoto" &&
                        <div id="photo" className="photo" style={{backgroundImage: `url(${destination.fetchphotourl})`,}}>
                            <a href={destination.fetchphotourl} target="_blank" rel="noopener noreferrer" alt={"Destination Photo"}><span className="alt-text">Destination Photo</span></a>
                        </div>
                        }
                    </div>

                        {/*Name, Date, and Map Button*/}
                        <div id="name" className="destination-name" style={{left: `calc(50% + ${right}px)`}}>{destination.name}
                            {/*Arrival Date Form*/}
                            {destination && destination.dindex !== 0 && //Only show if it isn't origin destination
                            <div className="arrival">Arrival: 
                                <div className="date">
                                    <input type="text" maxLength={2} className="date-input" value={month} 
                                    onChange={(e) => setMonth(e.target.value)} onClick={(e) => {if(e.target === document.activeElement) e.stopPropagation()}}></input>/
                                    <input type="text" maxLength={2} className="date-input" value={day} 
                                    onChange={(e) => setDay(e.target.value)} onClick={(e) => {if(e.target === document.activeElement) e.stopPropagation()}}></input>/
                                    <input type="text" maxLength={4} className="date-input year" value={year} 
                                    onChange={(e) => setYear(e.target.value)} onClick={(e) => {if(e.target === document.activeElement) e.stopPropagation()}}></input>&nbsp;
                                    <input type="text" maxLength={2} className="date-input" value={hour} 
                                    onChange={(e) => setHour(e.target.value)} onClick={(e) => {if(e.target === document.activeElement) e.stopPropagation()}}></input>:
                                    <input type="text" maxLength={2} className="date-input" value={min} 
                                    onChange={(e) => setMin(e.target.value)} onClick={(e) => {if(e.target === document.activeElement) e.stopPropagation()}}></input>&nbsp;
                                    <input type="text" maxLength={2} className="date-input half" value={half} 
                                    onChange={(e) => setHalf(e.target.value)} onClick={(e) => {if(e.target === document.activeElement) e.stopPropagation()}}></input>
                                </div>
                            </div>
                            }

                            {/*Departure Date Form*/}
                            <div className={destination && destination.dindex !== 0 ? "departure" : "departure-only"}>Departure: 
                                <div className="date">
                                    <input type="text" maxLength={2} className="date-input" value={depMonth} 
                                    onChange={(e) => setDepMonth(e.target.value)} onClick={(e) => {if(e.target === document.activeElement) e.stopPropagation()}}></input>/
                                    <input type="text" maxLength={2} className="date-input" value={depDay} 
                                    onChange={(e) => setDepDay(e.target.value)} onClick={(e) => {if(e.target === document.activeElement) e.stopPropagation()}}></input>/
                                    <input type="text" maxLength={4} className="date-input year" value={depYear} 
                                    onChange={(e) => setDepYear(e.target.value)} onClick={(e) => {if(e.target === document.activeElement) e.stopPropagation()}}></input>&nbsp;
                                    <input type="text" maxLength={2} className="date-input" value={depHour} 
                                    onChange={(e) => setDepHour(e.target.value)} onClick={(e) => {if(e.target === document.activeElement) e.stopPropagation()}}></input>:
                                    <input type="text" maxLength={2} className="date-input" value={depMin} 
                                    onChange={(e) => setDepMin(e.target.value)} onClick={(e) => {if(e.target === document.activeElement) e.stopPropagation()}}></input>&nbsp;
                                    <input type="text" maxLength={2} className="date-input half" value={depHalf} 
                                    onChange={(e) => setDepHalf(e.target.value)} onClick={(e) => {if(e.target === document.activeElement) e.stopPropagation()}}></input>
                                </div>
                            </div>

                            {/*Map and Loading Indicator*/}
                            <div className={destination && destination.dindex !== 0 ? "map-button" : "map-button-only"}
                                ><a href={destination.url} target="_blank" rel="noopener noreferrer">Go to map</a>
                                <div className = "date-loading-container">
                                    {dateLoading &&
                                        <Spinner small={true}/>
                                    }
                                    {!dateLoading && validDate &&
                                        <FontAwesomeIcon className = "icon" color="white" icon={faCheck}/>
                                    }
                                    {!dateLoading && !validDate &&
                                        <p>Invalid Date</p>
                                    }
                                </div>
                            </div>
                        </div>     
            </div>

            {/*Note Header*/}
            <div className="note-header" style={{bottom: `${height + 10}px`}}>Notes
                        <div className="note-loading-container">
                            {noteLoading &&
                            <Spinner small={true}/>
                            }
                            {!noteLoading &&
                                <FontAwesomeIcon className = "icon" color="white" icon={faCheck}/>
                            }
                        </div>
            </div>
            {/*Note TextBox*/}
            <textarea value={text} style={{height: `${height}px`}} maxLength="500" background-attachment="local" className="note-box" 
                onChange={(e) => handleNoteChange(e.target.value, destination.id, destination.tripid)}>
            </textarea>      
        </div>
    )

    //Display when trip is loading
    else if(tripLoading) return(
        <div className = "trip-loading-container">
            <Spinner />
        </div>
    )
    
    //Display when destination isn't selected
    else if(trip && !destination) return(
        <div id="display" style={{left: `${left}px`}} className="display-z">
                <div className="no-dest-header">No Destination Selected</div>
                <div className="no-dest-msg">Create or select a destination to see more.</div>
        </div>
    )

    //Display when not logged in
    else if(!user.isLoggedIn) return(
        <div className="display-only">
            <div className="title-header">Trip Maker</div>
            <div className="title-msg">Register or Login to get started.</div>
        </div>
    )

    //Display when destination is loading
    else if(destinationLoading) return(
        <div className="display" style={{left: `${left}px`}} onClick={handleClick}>
             <div className = "display-loading-container">
                <Spinner />
            </div>
        </div>
    )

    //display when trip isn't selected
    else return(
        <div className="display-only">
            <div className="greeting">Hello, {user.username}.</div>
            <div className="title-msg">Create or select a trip to get started.</div>
        </div>
    )

}

export default Display;