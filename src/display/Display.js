import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {startSavingNote, startChangingDate} from '../actions.js';
import {debounce} from '../helpers.js';
import './Display.css';

let handleNoteChange;
let handleDateChange;

function Display(props){
    const dispatch = useDispatch();
    const destination = props.currentDestination;
    const showDestinationSelector = useSelector(state => state.showDestinationSelector);
    const [month, setMonth] = useState("01");
    const [day, setDay] = useState("01");   
    const [year, setYear] = useState("2020"); 
    const [hour, setHour] = useState("12");
    const [min, setMin] = useState("00");
    const [half, setHalf] = useState("AM");
    const [text, setText] = useState("");
    const [left, setLeft] = useState(400);
    const [height, setHeight] = useState(400);
    

    useEffect( () => {
        function handleResize(){
            const pageHeight = window.innerHeight;
            const notesHeight = 374;
            if(pageHeight < 730){
                //for every 40px, remove 40px
                const numRows = Math.floor((730 - pageHeight) / 38);
                console.log(`${numRows} numrows`);
                setTimeout(() => setHeight(notesHeight - (38 * numRows), 0));
            }
        }

        function handleScroll(){
            const left = document.documentElement.scrollLeft;
            setLeft(400 - left);
        }
    
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        
        handleResize();
        handleScroll();
        return ()=>{
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize)
        }
        
    }, []);

    useEffect( () => {
        const initArrival = (destination && destination.arrival) ? destination.arrival : {month: "01", day: "01", year: "2020", hour: "12", min: "00", half: "AM"};
        const initText = (destination && destination.text !== null) ? destination.text : "";
        setText(initText);
        setMonth(initArrival.month);
        setDay(initArrival.day);
        setYear(initArrival.year);
        setHour(initArrival.hour);
        setMin(initArrival.min);
        setHalf(initArrival.half);
    }, [destination]);


    useEffect(() => {
        const doNoteSave = debounce((text, id, tripid) => {
            dispatch(startSavingNote(text, id, tripid));
        }, 1000, false);

        const doDateChange = debounce((month, day, year, hour, min, half, tripid, id) => {
            if(isSanitized(month, day, year, hour, min, half)){
                dispatch(startChangingDate(month, day, year, hour, min, half, tripid, id));
            }
            else{
                console.log("Invalid date")
            }
        }
        , 500, false);

        handleNoteChange = function(text, id, tripid){
            setText(text);
            doNoteSave(text, id, tripid);
        }

        handleDateChange = function(month, day, year, hour, min, half, tripid, id){
            doDateChange(month, day, year, hour, min, half, tripid, id);
        }

        function isSanitized(month, day, year, hour, min, half){
            if(month && (month.length !== 2 || isNaN(month) || month <= 0 || month > 12 || month.indexOf('-') !== -1 || month.indexOf('.') !== -1 || month.indexOf(' ') !== -1)) {
                console.log("month");
                return false;
            }
            if(year && (year.length !== 4 || isNaN(year) || year < 1000 || year.indexOf('-') !== -1 || year.indexOf('.') !== -1 || year.indexOf(' ') !== -1)) {
                console.log("yearh");
                return false;
            } 
            if(hour && (hour.length !== 2 || isNaN(hour) || hour <= 0 || hour > 12 || hour.indexOf('-') !== -1 || hour.indexOf('.') !== -1 || hour.indexOf(' ') !== -1)) {
                console.log("hour");
                return false;
            }
            if(min && (min.length !== 2 || isNaN(min) || min < 0 || min >= 60 || min.indexOf('-') !== -1 || min.indexOf('.') !== -1 || min.indexOf(' ') !== -1)) {
                return false;
            }
            if(day && (day.length !== 2 || isNaN(day) || day <= 0 || day > 31 || day.indexOf('-') !== -1 || day.indexOf('.') !== -1 || day.indexOf(' ') !== -1)) {
                return false;
            }
            if(half && (half !== "PM" && half !== "AM")){
                return false;
            }
            return true;
        }

    }, [dispatch]);

    useEffect(() => {
        if(destination){
            handleDateChange(month, day, year, hour, min, half, destination.tripid, destination.id);
        }
    }, [month, day, year, hour, min, half, destination]);

    function handleClick(){
        sanitizeDateInput();
    }

    function sanitizeDateInput(){
        if(isNaN(month) || month <= 0 || month > 12 || month.indexOf('-') !== -1 || month.indexOf('.') !== -1) {
            setMonth("01");
        } else{setMonth(month => month.padStart(2, '0'))}
        if(isNaN(year) || year < 1000 || year.indexOf('-') !== -1 || year.indexOf('.') !== -1) {
            setYear("2020");
        } 
        if(isNaN(hour) || hour <= 0 || hour > 12 || hour.indexOf('-') !== -1 || hour.indexOf('.') !== -1) {
            setHour("01");
        } else{setHour(hour => hour.padStart(2, '0'))}
        if(isNaN(min) || min < 0 || min >= 60 || min.indexOf('-') !== -1 || min.indexOf('.') !== -1) {
            setMin("00");
        } else{setMin(min => min.padStart(2, '0'))}
        if(isNaN(day) || day <= 0 || day > 31 || day.indexOf('-') !== -1 || day.indexOf('.') !== -1) {
            setDay("01");
        } else{setMin(day => day.padStart(2, '0'))}
        if(half.toUpperCase() !== "PM" && half.toUpperCase() !== "AM"){
            setHalf("AM");
        } else{setHalf(half => half.toUpperCase())}
    }

    

    if(!showDestinationSelector && destination) return(
        <div id="display" style={{left: `${left}px`}} onClick={handleClick} className="display">
            <div className="destination-name">{destination.name}</div>
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
            <div className="map-button"><a href={destination.url} target="_blank">Go to map</a></div>
            {destination.fetchphotourl && destination.fetchphotourl !== "nophoto" &&
            <div className="photo" style={{
                backgroundImage: `url(${destination.fetchphotourl})`,
            }}><a href={destination.fetchphotourl} target="_blank"></a></div>
            }
            <div className="note-header" style={{bottom: `${height + 22}px`}}>Notes</div>
            <textarea value={text} style={{height: `${height}px`}} maxLength="500" background-attachment="local" className="note-box" onChange={(e) => handleNoteChange(e.target.value, destination.id, destination.tripid)}></textarea>
            
        </div>
    )

    else return(
        <div id="display" onClick={handleClick} className="display-z">
            <div className="destination-name">{"Hi"}</div>
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
            <div  className="note-header">Notes</div>
            <textarea value={text} rows="11"  cols="11" maxLength="500" background-attachment="local" className="note-box" onChange={(e) => handleNoteChange(e.target.value, destination.id, destination.tripid)}></textarea>
        </div>
        
    )

    // else if(destination) return(
    //     <div id="display" className="display-z">
    //         <div className="destination-name">{destination.name}</div>
    //         <div className="note-header">Notes</div>
    //         <textarea value={text} rows="11"  cols="11" maxLength="500" background-attachment="local" className="note-box" onChange={(e) => handleNoteChange(e.target.value, destination.id, destination.tripid)}></textarea>
    //     </div>
    // )

    // else return(
    //     <div className="display-z"></div>
    // )
}

export default Display;