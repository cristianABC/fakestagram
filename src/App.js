import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state ={
      user: null,
      pictures: []
    };
    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout= this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged(user=>{
      this.setState({
        user
      });
    });

   firebase.database().ref('pictures').on('child_added',snapshot=>{
     this.setState({
       pictures: this.state.pictures.concat(snapshot.val())
     });
   });
  }

 handleAuth(){
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
  .then(result => console.log( `${result.user.displayName} ha iniciado sesión`))

  .catch(error => console.log(`Error:${error.code}`));
  
 }

 handleLogout(){
   firebase.auth().signOut()
   .then(result => console.log( `${result.user.displayName} ha cerrado sesión`))
   .catch(error => console.log(`Error:${error.code}:${error.message}`));
 }
  handleUpload(event){
        const file = event.target.files[0];
        const storageRef = firebase.storage().ref(`/pictures/${file.name}`);
        const task = storageRef.put(file);
        
        task.on('state_changed',snapshot=>{
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
            this.setState({
                uploadValue: percentage
            })
        },error => {console.log(error.message)
        
        },()=>{
            const record ={
              photoURL: this.state.user.photoURL,
              displayName: this.state.user.displayName,
              image: task.snapshot.downloadURL
            };
            const dbRef = firebase.database().ref('pictures');
            const newPic = dbRef.push();
            newPic.set(record);
        });
    }
 
 renderLoginButton(){
  if(this.state.user){
    return (
    <div>
      <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName}/>
      <p> {this.state.user.displayName} </p>
      <FileUpload onUpload={this.handleUpload}/>
      {
        this.state.pictures.map(picture=>(
          <div>
            <img width="100"src={picture.image}/>
              <br/>
              <img  width="50" src={picture.photoURL}alt={picture.displayName}/>
              <text>Corazon</text>
              <br/>
              <span>{picture.displayName}</span> 
          </div>
        )).reverse()  
      }

      <button onClick={this.handleLogout}>Salir</button>
    </div>
    );
  }else{
    return ( <button onClick={this.handleAuth}>Login con google</button>);
  }
 }
 
 
  render() {
    return (
      <div className="App">
        <div className="App-header">
        
          <h2>Fakestagram</h2>
        </div>
          <p className="App-intro"> </p>
              <div> 
                  {this.renderLoginButton()}
              </div>
          
          
      </div>
    );
  }
}

export default App;
