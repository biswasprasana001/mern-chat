// src\components\UserList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserList({ onSelectUser }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/users');
                setUsers(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            {users.map((user) => (
                <div key={user._id} onClick={() => onSelectUser(user)}>
                    {user.username}
                </div>
            ))}
        </div>
    );
}

export default UserList;