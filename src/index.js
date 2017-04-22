import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import App from './App';
import './index.css';


firebase.initializeApp({
  apiKey: "AIzaSyCZ_BQ-xk1aQpIIhnMXMchzuYemiBwTFFk",
    authDomain: "resplendent-inferno-6968.firebaseapp.com",
    databaseURL: "https://resplendent-inferno-6968.firebaseio.com",
    projectId: "resplendent-inferno-6968",
    storageBucket: "resplendent-inferno-6968.appspot.com",
    messagingSenderId: "420752593299"
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
