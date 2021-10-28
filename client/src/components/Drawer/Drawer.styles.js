import styled from 'styled-components';

export const Wrapper = styled.div`
    display: flex;
    position: absolute;
    width: 25rem;
    height: 100vh;
    border: 4px solid white;
    flex-direction: column;
    padding: 4rem 2rem 2rem 2rem;
    background: #49536A;
    transform: translateX(${({ open }) => open ? 0 : '-25rem'});
    align-items: center;
    color: white;
    font-family: 'Josefin Sans', sans-serif;
    transition: transform 0.2s;

    #message {
        display: none;
        text-align: center;
        margin: 1rem 0;
    }

    button {
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 5px 5px 0 0 white;
        width: 20rem;
        height: 4rem;
        background: #49536A;
        transition: transform 0.05s, box-shadow 0.05s;
        margin: 1rem 0;
        color: inherit;
        font-family: inherit;
        text-transform: uppercase;

        &:active {
            box-shadow: 1px 1px 0 0 white;
            transform: translate(4px, 4px);
        }

        &#next-level-button {
            display: none;
        }

        &#shop-button {
            //display: none;
        }

        span.running {
            animation: pulse-fade 0.125s linear alternate infinite;
            font-style: italic;
        }
    }
`
