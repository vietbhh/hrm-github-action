import React from 'react';
import { useSkin } from '@hooks/useSkin'

function SwitchMode(props) {

    const { skin, setSkin } = useSkin()

    const changeSkin = (name) => {
        setSkin(name)
    }

    return (
        <>
            <div 
                className={`mode-light ${
                    skin && skin === "light" ? "active" : ""
                }`} 
                onClick={()=>changeSkin("light")}
            >
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="vuesax/bold/sun">
                        <g id="sun">
                            <path id="Vector" d="M12.6426 19C16.5086 19 19.6426 15.866 19.6426 12C19.6426 8.13401 16.5086 5 12.6426 5C8.77658 5 5.64258 8.13401 5.64258 12C5.64258 15.866 8.77658 19 12.6426 19Z" fill={` ${skin && skin === "light" ? "#2F9BFA" :"#C4C3BB"}`}/>
                            <path id="Vector_2" d="M12.6426 22.96C12.0926 22.96 11.6426 22.55 11.6426 22V21.92C11.6426 21.37 12.0926 20.92 12.6426 20.92C13.1926 20.92 13.6426 21.37 13.6426 21.92C13.6426 22.47 13.1926 22.96 12.6426 22.96ZM19.7826 20.14C19.5226 20.14 19.2726 20.04 19.0726 19.85L18.9426 19.72C18.5526 19.33 18.5526 18.7 18.9426 18.31C19.3326 17.92 19.9626 17.92 20.3526 18.31L20.4826 18.44C20.8726 18.83 20.8726 19.46 20.4826 19.85C20.2926 20.04 20.0426 20.14 19.7826 20.14ZM5.50258 20.14C5.24258 20.14 4.99258 20.04 4.79258 19.85C4.40258 19.46 4.40258 18.83 4.79258 18.44L4.92258 18.31C5.31258 17.92 5.94258 17.92 6.33258 18.31C6.72258 18.7 6.72258 19.33 6.33258 19.72L6.20258 19.85C6.01258 20.04 5.75258 20.14 5.50258 20.14ZM22.6426 13H22.5626C22.0126 13 21.5626 12.55 21.5626 12C21.5626 11.45 22.0126 11 22.5626 11C23.1126 11 23.6026 11.45 23.6026 12C23.6026 12.55 23.1926 13 22.6426 13ZM2.72258 13H2.64258C2.09258 13 1.64258 12.55 1.64258 12C1.64258 11.45 2.09258 11 2.64258 11C3.19258 11 3.68258 11.45 3.68258 12C3.68258 12.55 3.27258 13 2.72258 13ZM19.6526 5.99C19.3926 5.99 19.1426 5.89 18.9426 5.7C18.5526 5.31 18.5526 4.68 18.9426 4.29L19.0726 4.16C19.4626 3.77 20.0926 3.77 20.4826 4.16C20.8726 4.55 20.8726 5.18 20.4826 5.57L20.3526 5.7C20.1626 5.89 19.9126 5.99 19.6526 5.99ZM5.63258 5.99C5.37258 5.99 5.12258 5.89 4.92258 5.7L4.79258 5.56C4.40258 5.17 4.40258 4.54 4.79258 4.15C5.18258 3.76 5.81258 3.76 6.20258 4.15L6.33258 4.28C6.72258 4.67 6.72258 5.3 6.33258 5.69C6.14258 5.89 5.88258 5.99 5.63258 5.99ZM12.6426 3.04C12.0926 3.04 11.6426 2.63 11.6426 2.08V2C11.6426 1.45 12.0926 1 12.6426 1C13.1926 1 13.6426 1.45 13.6426 2C13.6426 2.55 13.1926 3.04 12.6426 3.04Z" fill={` ${skin && skin === "light" ? "#2F9BFA" :"#C4C3BB"}`}/>
                        </g>
                    </g>
                </svg>
                <span className={`text ${
                    skin && skin === "light" ? "text-active" : ""
                }`} >
                    Light
                </span>
            </div>

            <div 
                className={`mode-light ${
                        skin && skin === "dark" ? "active" : ""
                    }`}  
                onClick={()=>changeSkin("dark")}
            >
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="vuesax/bold/moon">
                        <g id="moon">
                            <path id="Vector" d="M22.1733 15.9301C22.0133 15.6601 21.5633 15.2401 20.4433 15.4401C19.8233 15.5501 19.1933 15.6001 18.5633 15.5701C16.2333 15.4701 14.1233 14.4001 12.6533 12.7501C11.3533 11.3001 10.5533 9.41012 10.5433 7.37012C10.5433 6.23012 10.7633 5.13012 11.2133 4.09012C11.6533 3.08012 11.3433 2.55012 11.1233 2.33012C10.8933 2.10012 10.3533 1.78012 9.29326 2.22012C5.20326 3.94012 2.67326 8.04012 2.97326 12.4301C3.27326 16.5601 6.17326 20.0901 10.0133 21.4201C10.9333 21.7401 11.9033 21.9301 12.9033 21.9701C13.0633 21.9801 13.2233 21.9901 13.3833 21.9901C16.7333 21.9901 19.8733 20.4101 21.8533 17.7201C22.5233 16.7901 22.3433 16.2001 22.1733 15.9301Z" fill={` ${skin && skin === "dark" ? "#2F9BFA" :"#C4C3BB"}`}/>
                        </g>
                    </g>
                </svg>
                <span className={`text ${
                    skin && skin === "dark" ? "text-active" : ""
                }`} >
                    Dark
                </span>

            </div>
        </>
    );
}

export default SwitchMode;