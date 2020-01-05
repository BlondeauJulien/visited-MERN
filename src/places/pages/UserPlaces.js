import React from 'react';

import PlaceList from '../components/PlaceList';

const UserPlaces = () => {
const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/71/33/e6.jpg',
        address: '20 W 34th St, New York, NT, 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/71/33/e6.jpg',
        address: '20 W 34th St, New York, NT, 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
]

    return (
        <PlaceList items={DUMMY_PLACES}/>
    )
}

export default UserPlaces
