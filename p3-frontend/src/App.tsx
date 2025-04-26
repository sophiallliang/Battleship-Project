import './App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import ProfileStatus from './components/ProfileStatus'
import NavigationBar from './components/NavigationBar'
import SignIn from './pages/SignIn'
import Signup from './pages/Signup'
import Home from './pages/Home'
import HighScores from './pages/HighScores'
import AllGames from './pages/AllGames'
import Game from './pages/Game'
import CreateGame from './pages/CreateGame'
import Rules from './pages/Rules'

function App() {
  return (
    <BrowserRouter>
      <div className='header'>
        <NavigationBar />
        <ProfileStatus />
      </div>
      
      <div className='route-content-container'>
        {/* <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/game/normal' element={<NormalGame />}></Route>
          <Route path='/game/easy' element={<EasyGame />}></Route>
          <Route path='/rules' element={<Rules />}></Route>
          <Route path='/highscores' element={<HighScores />}></Route>
          <Route path='*' element={<ErrorPage errCode={404} message='The page does not exist' />} />
        </Routes> */}
        <Routes>
          <Route path='/register' element={<Signup />}></Route>
          <Route path='/login' element={<SignIn />}></Route>
          <Route path='/' element={<Home />}></Route>
          <Route path='/rules' element={<Rules />}></Route>
          <Route path='/create_game' element={<CreateGame />}></Route>
          <Route path='/games' element={<AllGames />}></Route>
          <Route path='/game/:game_id' element={<Game />}></Route>
          <Route path='/high-scores' element={<HighScores />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
