import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { Save, Image as ImageIcon, Trash2 } from 'lucide-react';

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

const AdminDashboard = () => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [selectedTab, setSelectedTab] = useState("write");
    const [uploading, setUploading] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
            setPosts(res.data.items || []);
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const session = await fetchAuthSession();
            const token = session.tokens.idToken.toString();

            // 1. Get Pre-signed URL
            const urlRes = await axios.get(`${import.meta.env.VITE_API_URL}/upload-url`, {
                params: { contentType: file.type },
                headers: { Authorization: token }
            });

            const { uploadUrl, fileUrl } = urlRes.data;

            // 2. Upload to S3
            await axios.put(uploadUrl, file, {
                headers: { 'Content-Type': file.type }
            });

            // 3. Insert into content
            setContent(prev => `${prev}\n![image](${fileUrl})`);
        } catch (err) {
            console.error('Upload error:', err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const savePost = async () => {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens.idToken.toString();

            await axios.post(`${import.meta.env.VITE_API_URL}/posts`, {
                title, slug, content, status: 'PUBLISHED'
            }, {
                headers: { Authorization: token }
            });

            alert('Post published!');
            setTitle(''); setSlug(''); setContent('');
            fetchPosts();
        } catch (err) {
            console.error('Save error:', err);
            alert('Failed to save post');
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex gap-8">
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
                <div className="space-y-4 mb-6">
                    <input
                        type="text"
                        placeholder="Post Title"
                        className="w-full text-3xl font-bold border-b focus:border-indigo-500 outline-none py-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="url-slug"
                        className="w-full text-gray-500 border-b focus:border-indigo-500 outline-none py-1"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                    />
                </div>

                <div className="mb-4 flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                        <ImageIcon size={18} />
                        <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                        <input type="file" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                </div>

                <div className="container" style={{ minHeight: "400px" }}>
                    <ReactMde
                        value={content}
                        onChange={setContent}
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        generateMarkdownPreview={markdown =>
                            Promise.resolve(converter.makeHtml(markdown))
                        }
                    />
                </div>

                <button
                    onClick={savePost}
                    className="mt-8 flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                    <Save size={20} />
                    Publish Post
                </button>
            </div>

            <div className="w-80 bg-white p-6 rounded-2xl shadow-sm h-fit sticky top-24">
                <h3 className="font-bold mb-4 text-gray-400 uppercase text-xs tracking-widest">Your Posts</h3>
                <div className="space-y-4">
                    {posts.map(p => (
                        <div key={p.postId} className="group border-b pb-2 flex justify-between items-center">
                            <span className="truncate pr-2 font-medium text-sm">{p.title}</span>
                            <button className="text-gray-300 group-hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
