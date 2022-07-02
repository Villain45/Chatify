
import {Route,Router} from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'
import './App.css'

function App() {
  return (
 
      <div className="App">
        <Route path="/" exact component={HomePage} />
        <Route path="/chats" component={ChatPage}/>
      </div>
    
  );
}

export default App;
