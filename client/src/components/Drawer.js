export default function Drawer() {
    return (
        <div id="drawer">
            <div id="message">
                <div id="phrase"></div>
                <div id="objective">
                    <div>Next Objective:</div>
                    <div id="content"></div>
                </div>
            </div>
            <button id="resume-button">
                <span dataText="loading">resume level</span>
            </button>
            <button id="reset-button">
                <span dataText="loading">reset level</span>
            </button>
            <button id="next-level-button">
                <span dataText="loading">next level</span>
            </button>
            <button id="shop-button">
                <span dataText="loading">shop</span>
            </button>
        </div>
    )
}
