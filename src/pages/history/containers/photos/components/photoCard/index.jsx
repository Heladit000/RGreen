import React from 'react';

import "./style/photoCard.scss"

const PhotoCard = ({image, date}) => {
    return (
        <div className="photoCard">
            <img src={image} alt={date} draggable="false"/>
        </div>
    );
};

export default PhotoCard;