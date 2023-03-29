import React from 'react';
import { BookLoader } from "react-awesome-loaders";

const Loader = () => {
    return (
        <div>
            <BookLoader
                background={"linear-gradient(135deg, #dcdcdc, #e5e4e2 )"}
                desktopSize={"70px"}
                mobileSize={"50px"}
                textColor={"#dcdcdc"}
            />
        </div>
    )
}

export default Loader;