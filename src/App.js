import React, {useEffect} from 'react';
import './App.css';
import Nav from './nav/Nav.js'
import Login from './login/Login.js'
import LoadingPane from './loading-pane/LoadingPane.js';
import ContentPane from './content-pane/ContentPane.js';
import Registration from './registration/Registration.js';
import {useSelector, useDispatch} from 'react-redux';
import {stopDropdown} from './actions'

function App() {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const tripLoading = useSelector(state => state.tripLoading);
  const atRegistration = useSelector(state => state.atRegistration);
  const atLogin = useSelector(state => state.atLogin);


  function handleClick(){
    dispatch(stopDropdown())
  }



  if(atRegistration){
    return(
      <div className="App" onClick={handleClick}>
        <Registration />
      </div>
    )
  } 
  
  else if(atLogin){
    return(
      <div className="App" onClick={handleClick}>
        <Login />
      </div>
    )
  }

  else if(!tripLoading){
    return (
      <div className="App" onClick={handleClick}>
        <Nav user={user} />
        <ContentPane />
      </div>
    );
  }
  
  else{
    return(
      <div className="App" onClick={handleClick}>
          <Nav user={user} />
          <LoadingPane />
      </div>
    )
  }
}

export default App;
