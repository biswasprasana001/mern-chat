import { Link } from "react-router-dom";

function Sidebar({ users, setRecipientUserId, setRecipientUsername }) {
  return (
    <div className="sidebar">
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <Link to={{ pathname: `/chat/${user._id}` }} onClick={() => {
              setRecipientUserId(user._id);
              setRecipientUsername(user.username);
            }}>
              {user.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;

