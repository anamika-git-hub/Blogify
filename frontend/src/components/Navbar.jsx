import { Link } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-xl font-bold">
        📝 Blogify
      </Link>
      <div className="space-x-4">
        {token ? (
          <>
            <Link to="/create" className="hover:text-blue-400 transition duration-200">
              Create Post
            </Link>
            <Link to="/profile" className="hover:text-yellow-400 transition duration-200">
              My Profile
            </Link>
            <button onClick={handleLogout} className="hover:text-red-400 transition duration-200">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-green-400 transition duration-200">
              Login
            </Link>
            <Link to="/register" className="hover:text-blue-400 transition duration-200">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
