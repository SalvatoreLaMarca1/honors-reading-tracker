import { useEffect, useState } from 'react'

import "../styles/YearlyProgress.css"
import { getData, User } from '../firebase'

function YearlyProgress() {

  const numberOfElements = 5
  
  // Create an array of elements (could be any JSX elements)
  const elements = Array.from({ length: numberOfElements }, (_, i) => (
    <div className='circle' key={i}>{i + 1}</div>
    
  ));

  return <div className="container">{elements}</div>;
}
export function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getData();
      setUsers(users)
    }
    fetchUsers()
  }, [])

  const userH1s = users.map((user, index) => {
    return (
      <h1 key={index}>
        {user.email} , {user.password}
      </h1>
    );
  })
  
  return <div className="container">{userH1s}</div>
}

export default YearlyProgress