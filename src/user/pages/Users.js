import React from 'react'

import UsersList from '../components/UsersList'

const Users = () => {
    const USERS = [{id: 'u1', name: 'Julien', image:`https://www.ef.com/wwen/blog/wp-content/uploads/2018/05/Dublin_is_the_Silicon_Valley_of_Europe-and_the_hot_new_place_to_study_English_blog-hero_low.jpg`, places: 3}]

    return <UsersList items={USERS}/>
}

export default Users
