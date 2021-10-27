import coin from '../images/coin.png'
import boat from '../images/boat.png'
import net from '../images/net.png'

export default function Shop() {
    return (
        <div id="shop">
            <div id="shop-header">
                <svg id="close-button" width="46" height="47" viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 23.5L4 43M23 23.5L42 4M23 23.5L4 4M23 23.5L42 43" stroke="#49536A" strokeWidth="8" strokeLinecap="round"/>
                </svg>
            </div>
            <div id="shop-main">
            <div class="item">
                <img class="item-img" src={net} alt="net"/>
                <div class="item-name">Basic Net</div>
                <button id="upgrade-size-button" class="upgrade-button">
                    <span dataText="loading" dataError="not enough coins">Upgrade Size<br/>Capacity: <span id="capacity">20</span></span>
                    <span id="cost"><img src={coin} alt="coin"/><span id="value">100</span></span>
                </button>
            </div>
            <div class="item">
                <img class="item-img" src={boat} alt="boat"/>
                <div class="item-name">Basic Boat</div>
                <button id="upgrade-speed-button" class="upgrade-button">
                    <span dataText="loading" dataError="not enough coins">Upgrade Reel Speed<br/>Speed: <span id="speed">15</span></span>
                    <span id="cost"><img src={coin} alt="coin"/><span id="value">100</span></span>
                </button>
            </div>
            </div>
        </div>
    )
}
