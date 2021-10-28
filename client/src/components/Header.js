import chartIcon from '../images/chart-icon.svg'
import clockMeter from '../images/clock-meter.svg'
import FishMeter from './FishMeter'
import coinMeter from '../images/coin-meter.svg'
import Menu from './Menu'

export default function Header({ setDrawerOpen }) {
    return (
        <header>
            <div id="icons">
                <Menu setDrawerOpen={setDrawerOpen} />
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
