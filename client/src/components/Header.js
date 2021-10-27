import menu from '../images/menu.svg'
import chartIcon from '../images/chart-icon.svg'
import clockMeter from '../images/clock-meter.svg'
import FishMeter from './FishMeter'
import coinMeter from '../images/coin-meter.svg'

export default function Header() {
   return (
       <header>
        <div id="icons">
            <img id="hamburger-menu" className="icon" src={menu} alt="hambuger menu"></img>
            <img id="chart-icon" className="icon" src={chartIcon} alt="line chart"></img>
        </div>
        <div id="stats">
            <object id="time-meter" data={clockMeter} type="image/svg+xml"></object>
            <FishMeter />
            <object id="coin-meter" data={coinMeter} type="image/svg+xml"></object>
        </div>
       </header>
   )
}
