import React from 'react';
import './App.css';
import Nav from './nav/Nav.js'
import Login from './login/Login.js'
import ContentPane from './content-pane/ContentPane.js';
import Spinner from './spinner/Spinner.js';
import Registration from './registration/Registration.js';
import {useSelector, useDispatch} from 'react-redux';
import {stopDropdown} from './actions'





function App() {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const loginLoading = useSelector(state => state.loginLoading);
  const registerLoading = useSelector(state => state.registerLoading);
  const atRegistration = useSelector(state => state.atRegistration);
  const atLogin = useSelector(state => state.atLogin);


  function handleClick(){
    dispatch(stopDropdown())
  }



  if(atRegistration){
    return(
      <div className="App" onClick={handleClick}>
        <div className="page"></div>
        <Nav user={user} />
        <Registration />
        {registerLoading &
        <div className = "loading-container">
            <Spinner />
        </div>
        }
      </div>

    )
  } 
  
  else if(atLogin){
    return(
      <div>
        
        <div className="App" onClick={handleClick}>
          <div className="page"></div>
            <Nav user={user} />
            <Login />
            {loginLoading &&
            <div className = "loading-container">
              <Spinner />
            </div>
          }
        </div>
      </div>
    )
  }

  else{
    return (
      <div className="App" onClick={handleClick}>
        <div className="page"></div>
        <Nav user={user} />
        <ContentPane />
      </div>
    );
  }
}

export default App;
