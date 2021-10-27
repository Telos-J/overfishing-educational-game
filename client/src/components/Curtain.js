export default function Curtain() {
    return (
        <div id="curtain">
            <svg id="graph" width="477" height="215" viewBox="0 0 477 215" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans');
                    </style>
                </defs>
            <path id="population-curve" d="M398.999 155.891C325.564 -9.71104 171.9 -9.71103 91.6727 155.891" stroke="white" strokeWidth="4" stroke-linecap="round"/>
            <text id="x-label" fill="white" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Josefin Sans" fontSize="15" fontStyle="italic" letterSpacing="0em"><tspan x="193.101" y="206.25">Population Size</tspan></text>
            <g id="harvest">
            <line x1="38" y1="155.5" x2="475" y2="155.5" stroke="white" strokeWidth="2"/>
            <text fill="white" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Josefin Sans" fontSize="15" fontStyle="italic" letterSpacing="0em"><tspan x="38.0001" y="148.898">H = <tspan id="harvest-rate">0</tspan></tspan></text>
            </g>
            <g id="pointer">
            <text fill="white" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Josefin Sans" fontSize="15" fontStyle="italic" letterSpacing="0em"><tspan x="418.208" y="149.25">N = <tspan id="numFish">100</tspan>&#10;</tspan><tspan x="475" y="164.25">&#10;</tspan></text>
            <line x1="475" y1="155.5" x2="398" y2="155.5" stroke="white" strokeWidth="2"/>
            <ellipse id="dot" cx="398.337" cy="155.58" rx="7.68317" ry="6.5802" fill="white"/>
            </g>
            <text id="carrying-capacity" fill="white" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Josefin Sans" fontSize="15" fontStyle="italic" letterSpacing="0em"><tspan x="392.313" y="187.624">K = 100</tspan></text>
            <text id="origin" fill="white" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Josefin Sans" fontSize="15" fontStyle="italic" letter-spacing="0em"><tspan x="86.0001" y="187.33">0</tspan></text>
            <text id="y-label" transform="translate(0 172) rotate(-90)" fill="white" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Josefin Sans" fontSize="15" fontStyle="italic" letterSpacing="0em"><tspan x="5.11133" y="14.75">Population Growth Rate</tspan></text>
            </svg>
        </div>
    )
}
