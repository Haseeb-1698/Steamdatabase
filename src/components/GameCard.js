import React from 'react';
import { Card } from 'react-bootstrap';

const GameCard = ({ game }) => {
    return (
        <Card>
            <Card.Img variant="top" src={game.img_icon_url} />
            <Card.Body>
                <Card.Title>{game.name}</Card.Title>
                <Card.Text>
                    Playtime: {game.playtime_forever} minutes {/* Or format hours */}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default GameCard;
