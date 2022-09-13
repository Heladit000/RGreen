import React from 'react';
import Image from "@images/solid.png"

const Photo = ({dataUrl, externalClass}) => {
    return (
        <div className={externalClass}>
            {dataUrl ? <img src={dataUrl}/> : <img src={Image}/>}
        </div>
    );
};

export default Photo;