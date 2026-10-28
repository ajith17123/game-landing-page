import './App.css';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import Home from './components/Home';
import SmoothScroll from './components/SmoothScroll';

function App () {

  useEffect(()=> {
    AOS.init({
      duration:1200,
      easing: 'ease-in-out',
    })
  }, [] );

  return(
    <SmoothScroll>
      <HashRouter>
        <Routes>
          <Route path='/' element={< Home />} />
        </Routes>
      </HashRouter>
    </SmoothScroll>
  )
}

export default App;


