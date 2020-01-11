import React from 'react';
import { useParams } from 'react-router-dom'

import PlaceList from '../components/PlaceList';

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
        imageUrl: 'https://www.voyageway.com/wp-content/uploads/2018/04/empire-state-building-ou-top-of-the-rock-740x447.jpg',
        address: '20 W 34th St, New York, NT, 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
]

const UserPlaces = () => {
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId)

    return (
        <PlaceList items={loadedPlaces}/>
    )
}

export default UserPlaces
