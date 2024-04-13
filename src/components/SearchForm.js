import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

const SearchForm = ({ onSearch }) => {
    const [steamId, setSteamId] = useState('');
    const [appId, setAppId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(steamId, appId);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <InputGroup>
                <Form.Control
                    placeholder="Enter Steam ID"
                    value={steamId}
                    onChange={(e) => setSteamId(e.target.value)}
                />
                <Form.Control
                    placeholder="Enter App ID (for news)"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                />
                <Button type="submit">Search</Button>
            </InputGroup>
        </Form>
    );
}

export default SearchForm;
