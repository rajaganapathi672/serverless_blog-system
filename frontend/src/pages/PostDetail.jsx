import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const PostDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const postRes = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
                setPost(postRes.data);

                const commentsRes = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${postRes.data.postId}/comments`);
                setComments(commentsRes.data || []);
            } catch (error) {
                console.error('Error fetching post detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPostData();
    }, [slug]);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!post) return <div className="text-center py-20 text-red-500">Post not found.</div>;

    return (
        <article className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
                <div className="flex items-center text-gray-500 text-sm">
                    <span>{post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </header>

            <div className="prose prose-indigo max-w-none mb-12">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <section className="border-t pt-8">
                <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.commentId} className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold text-gray-800 mb-1">{comment.user}</p>
                            <p className="text-gray-600">{comment.content}</p>
                            <p className="text-xs text-gray-400 mt-2">{new Date(comment.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                    {comments.length === 0 && <p className="text-gray-400 italic">No comments yet.</p>}
                </div>
            </section>
        </article>
    );
};

export default PostDetail;
