import { Link } from 'react-router-dom';

const PostCard = ({ post, showActions = false }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-4 text-white">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="mt-2 text-gray-300">{post.content}</p>

      <p className="text-sm text-gray-500 mt-2">
        Posted on {new Date(post.createdAt).toDateString()}
      </p>

      {showActions && (
        <div className="flex gap-4 mt-3">
          <Link to={`/edit/${post._id}`} className="text-blue-400 hover:underline">
            ✏️ Edit
          </Link>
          <button className="text-red-400 hover:underline" onClick={() => handleDelete(post._id)}>
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
