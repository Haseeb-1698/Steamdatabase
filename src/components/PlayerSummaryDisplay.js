import React from 'react';

const PlayerProfile = ({ playerData }) => {
    return (
        <div>
            <h2>{playerData.personaname}</h2>
            <img src={playerData.avatar.medium} alt="Player Avatar" /> {/* or avatarfull */}
            {/* Display other profile details here */}
        </div>
    );
};

export default PlayerProfile;
