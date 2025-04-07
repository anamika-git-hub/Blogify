import { useEffect, useState } from 'react';
import API from '../utils/api';
import { Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await API.get('/posts');
        console.log('Posts data:', res.data);
        setPosts(res.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <Link 
            to="/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out"
          >
            New Post
          </Link>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-lg text-gray-500">No posts yet. Be the first to create one!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <article key={post._id} className="bg-white rounded-lg shadow overflow-hidden">
                {post.image && (
                  <div className="w-full h-64 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-gray-500 mb-4 text-sm">
                    By <span className="font-medium">{post.author?.username || 'Unknown'}</span> • 
                    {post.createdAt && (
                      <time className="ml-1">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    )}
                  </p>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                  
                  <div className="flex justify-between items-center">
                    <Link 
                      to={`/post/${post._id}`} 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;