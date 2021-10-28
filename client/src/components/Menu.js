import menu from '../images/menu.svg'

export default function Menu({setDrawerOpen}) {
    const handleOnClick = () => {
        setDrawerOpen(prev => !prev)
    }

    return (
        <img 
            id="hamburger-menu" 
            className="icon" 
            src={menu} 
            onClick={handleOnClick}
            alt="hambuger menu" 
        />
    )
}
