import { Wrapper } from './Drawer.styles'

export default function Drawer({ open }) {
    return (
        <Wrapper id="drawer" open={open}>
            <div id="message">
                <div id="phrase"></div>
                <div id="objective">
                    <div>Next Objective:</div>
                    <div id="content"></div>
                </div>
            </div>
            <button id="resume-button">
                <span data-text="loading">resume level</span>
            </button>
            <button id="reset-button">
                <span data-text="loading">reset level</span>
            </button>
            <button id="next-level-button">
                <span data-text="loading">next level</span>
            </button>
            <button id="shop-button">
                <span data-text="loading">shop</span>
            </button>
        </Wrapper>
    )
}
