import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Basket from './pages/Basket';
import ThankYou from './pages/ThankYou';


const App = () => {
  return (
    <Router>
      <Route path='/thankyou'>
        <ThankYou />
      </Route>
      <Route exact path='/'>
        <Basket />
      </Route>
    </Router>
  )
 
}

export default App;
