import fishImage from '../images/fish.png'

export default function FishMeter() {
    return (
        <svg width="238" height="44" viewBox="0 0 238 44" fill="none" xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink">
            <clipPath id="mask">
                <use href="#container"/>
            </clipPath>
            <rect id="container" x="10" y="12" width="220" height="20" rx="10" fill="#C4C4C4" stroke="white" strokeWidth="2"/>
            <rect id="gauge" clipPath="url(#mask)" x="10" y="12" width="0" height="20" rx="10" fill="#0D3C4F"/>
            <circle cx="22" cy="22" r="21.5" fill="#96CAD3" stroke="white"/>
            <circle cx="22" cy="22" r="21.5" fill="#96CAD3" stroke="white"/>
            <rect x="7" y="13" width="30" height="18" fill="url(#pattern)"/>
            <text id="caught" x="55%" y="50%" fill="white" fontFamily="Josefin Sans" fontSize="12" dominantBaseline="middle" textAnchor="middle">0/40</text>
            <defs>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans');
            </style>
            <pattern id="pattern" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlinkHref="#image" transform="translate(-0.00571429) scale(0.0171429 0.0285714)"/>
            </pattern>
            <image id="image" width="59" height="35" href={fishImage}/>
            </defs>
        </svg>
    )

}
