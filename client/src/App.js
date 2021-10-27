import './App.css';
import Sim from './components/Sim'
import Header from './components/Header'
import Drawer from './components/Drawer'
import Curtain from './components/Curtain'
import Shop from './components/Shop'

function App() {
    return (
        <div className="App">
            <Sim />
            <Header />
            <Drawer />
            <Curtain />
            <Shop />
        </div>
    );
}

export default App;
