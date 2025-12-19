import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
                setPosts(response.data.items || []);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="text-center py-20 text-xl">Loading posts...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-indigo-900">Latest Posts</h1>
            <div className="grid gap-8">
                {posts.map((post) => (
                    <article key={post.postId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <Link to={`/post/${post.slug}`}>
                            <h2 className="text-2xl font-semibold mb-2 text-gray-800 hover:text-indigo-600 cursor-pointer">{post.title}</h2>
                        </Link>
                        <p className="text-gray-500 text-sm mb-4">By {post.author} • {new Date(post.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-600 line-clamp-3 mb-4">{post.content.substring(0, 200)}...</p>
                        <Link to={`/post/${post.slug}`} className="text-indigo-600 font-medium hover:underline">Read more →</Link>
                    </article>
                ))}
                {posts.length === 0 && <p className="text-gray-500">No posts found.</p>}
            </div>
        </div>
    );
};

export default Home;
