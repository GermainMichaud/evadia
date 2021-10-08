/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
// import toast from 'react-hot-toast';
import Header from '../Header';
import Footer from '../Footer';
import Homepage from '../Homepage';
import Contact from '../Contact';
import About from '../About';
import Legals from '../Legals';
import Criteria from '../Criteria';
import Results from '../Results';
import Details from '../Details';
import Connexion from '../Connexion';
import Account from '../Account';
import Inscription from '../Inscription';
import Notfound from '../Notfound';
import API from '../../api';
import { useUser } from '../../hooks/useAuth';
import useCity from '../../store/city';

import './index.scss';
import NewPassword from '../ForgottenPassword/NewPassword';
import ForgottenPassword from '../ForgottenPassword';
import userStore from '../../store/user';
import Map from '../Map';
import useWindowSize from '../../hooks/useWindowSize';

const App = () => {
  const setUser = userStore((state) => state.setUser);
  const setFavorites = useCity((state) => state.setFavorites);
  const { data, isError, error, isLoading } = useUser();
  const { isMobile } = useWindowSize();

  const getFavorites = async () => {
    const favorites = await API.getUserFavorites();
    setFavorites(favorites);
  };

  useEffect(() => {
    if (data) {
      setUser(data.data);
      // toast.success('Vous êtes connecté');
      getFavorites();
    } else if (isError) {
      console.log('APP USER ERROR: ', error);
      setUser(null);
    }
  }, [data, isError]);

  return (
    <>
      <Header />
      <main>
        {!isMobile ? <Map /> : null}
        <Switch>
          <Route path="/" exact>
            <Homepage />
          </Route>
          <Route path="/contact" exact>
            <Contact />
          </Route>
          <Route path="/about" exact>
            <About />
          </Route>
          <Route path="/legals" exact>
            <Legals />
          </Route>
          <Route path="/criteria" exact>
            <Criteria />
          </Route>
          <Route path="/results" exact>
            <Results />
          </Route>
          <Route path="/details/:codeInsee" exact>
            <Details />
          </Route>
          <Route path="/connexion" exact>
            <Connexion />
          </Route>
          <Route path="/account" exact>
            <ProtectedRoute component={Account} />
            {/* <Account /> */}
          </Route>
          <Route path="/inscription" exact>
            <Inscription />
          </Route>
          <Route path="/newpassword" exact>
            <NewPassword />
          </Route>
          <Route path="/forgottenPassword" exact>
            <ForgottenPassword />
          </Route>
          <Route path="/new-password" exact>
            <NewPassword />
          </Route>
          <Route>
            <Notfound />
          </Route>
        </Switch>
      </main>
      <Footer />
    </>
  );
};

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const user = userStore((state) => state.user);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (user) {
          return <Component {...props} />;
        }
        return <Redirect to="/connexion" />;
      }}
    />
  );
};

export default App;
