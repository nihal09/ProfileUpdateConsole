import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import BusinessProfileForm from './components/BusinessProfileForm';

function App() {
  return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/user/:userId/profile/:profileId">
              {({ match }) => {
                  const { userId, profileId } = match!=null ? match.params : {userId :"6a291a13-3a3f-4cf1-b51d-85e0fa8d8166", profileId:"64e5b94a-e3d3-40ab-8aa5-4e39789e37b7"};
                return <BusinessProfileForm userId={userId} profileId={profileId} />;
              }}
            </Route>
          </Switch>
        </div>
      </Router>
  );
}

export default App;
