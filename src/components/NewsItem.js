import React from 'react';
import { Card } from 'react-bootstrap';

const NewsItem = ({ news }) => {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{news.title}</Card.Title>
                <Card.Text>{news.contents}</Card.Text>
                <Card.Link href={news.url}>Read More</Card.Link>
            </Card.Body>
        </Card>
    );
};

export default NewsItem;
