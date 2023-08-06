function Sidebar({ users, setRecipientUserId }) {
    return (
      <div className="sidebar">
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <Link to={`/chat/${user._id}`} onClick={() => setRecipientUserId(user._id)}>
                {user.username}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }