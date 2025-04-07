import { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import API from '../utils/api';

const Profile = () => {
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await API.get('/posts/my-posts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setMyPosts(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchMyPosts();
  }, []);

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl mb-4">🧑‍💻 My Profile</h1>
      <p className="text-gray-400 mb-6">Posts you’ve written:</p>
      {myPosts.length > 0 ? (
        myPosts.map((post) => (
          <PostCard key={post._id} post={post} showActions={true} />
        ))
      ) : (
        <p className="text-gray-500">No posts yet.</p>
      )}
    </div>
  );
};

export default Profile;
