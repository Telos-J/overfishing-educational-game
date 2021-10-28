import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Game from './components/Game'
import Header from './components/Header'
import Drawer from './components/Drawer'
import Curtain from './components/Curtain'
import Shop from './components/Shop'

function App() {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <div className="App">
            <Game />
            <Header setDrawerOpen={setDrawerOpen} />
            <Drawer open={drawerOpen} />
            <Curtain />
            <Shop />
        </div>
    );
}

export default App;
