import React, { useContext, useState, useRef } from 'react';
import axios from 'axios';
import { authContext, saveUserId } from '../contexts/Authcontext';

export default function CreatePost({ onPostCreated }) {
    const { userToken, setUserId, userPhoto, userName } = useContext(authContext);
    const [body, setBody] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    const commonEmojis = ["😊", "😂", "🥰", "😍", "🤩", "🤔", "🙄", "🔥", "✨", "🙌", "👍", "❤️", "🌹", "🎉", "😎", "💡", "📍"];

    function addEmoji(emoji) {
        setBody(prev => prev + emoji);
        setShowEmojiPicker(false);
        if (textareaRef.current) textareaRef.current.focus();
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    }

    function removeImage() {
        setImageFile(null);
        setPreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!body.trim()) {
            setError("Post content can't be empty.");
            return;
        }
        setError('');
        setLoading(true);
        try {
            let payload;
            let headers = { token: userToken };

            if (imageFile) {
                payload = new FormData();
                payload.append('body', body);
                payload.append('image', imageFile);
                headers['Content-Type'] = 'multipart/form-data';
            } else {
                payload = { body };
            }

            const { data } = await axios.post(
                'https://route-posts.routemisr.com/posts',
                payload,
                { headers }
            );
            const createdPost = data.data.post;
            setBody('');
            removeImage();

            const creatorId = createdPost?.user?._id;
            if (creatorId) {
                saveUserId(creatorId);
                setUserId(creatorId);
            }
            if (onPostCreated) onPostCreated(createdPost);
        } catch (err) {
            setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function autoResize() {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        }
    }

    return (
        <div className="w-full bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-lg dark:shadow-black/40 border border-gray-200 dark:border-gray-800 overflow-hidden mb-2">

            <div className="px-5 pt-5 pb-3 flex items-center gap-3">
                {userPhoto ? (
                    <img
                        src={userPhoto}
                        alt={userName || 'You'}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow-md ring-2 ring-gray-100 dark:ring-gray-700"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                        {userName?.[0]?.toUpperCase() || '✦'}
                    </div>
                )}
                <div className="flex-1">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={body}
                        onChange={(e) => { setBody(e.target.value); autoResize(); }}
                        placeholder="What's on your mind?"
                        className="w-full resize-none bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all leading-relaxed overflow-hidden"
                        style={{ minHeight: '48px', maxHeight: '200px' }}
                    />
                </div>
            </div>


            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />


            {preview && (
                <div className="px-5 pb-3">
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full max-h-64 object-cover"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs transition backdrop-blur-sm"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mx-5 mb-3 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-800/30 flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-gray-800 mx-5" />

            {/* Actions Row */}
            <div className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-1">
                    {/* File picker trigger */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${imageFile
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span className="hidden sm:inline">Photo</span>
                    </button>

                    {/* Emoji / Feeling trigger */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${showEmojiPicker
                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                <line x1="9" y1="9" x2="9.01" y2="9" />
                                <line x1="15" y1="9" x2="15.01" y2="9" />
                            </svg>
                            <span className="hidden sm:inline">Emoji</span>
                        </button>

                        {showEmojiPicker && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowEmojiPicker(false)}
                                />
                                <div className="absolute bottom-full mb-2 left-0 z-50 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-3 w-64 animate-in fade-in zoom-in duration-200">
                                    <div className="grid grid-cols-6 gap-2">
                                        {commonEmojis.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => addEmoji(emoji)}
                                                className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-lg transition-colors flex items-center justify-center"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-[10px] text-gray-400 text-center">
                                        Quick Emojis
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading || !body.trim()}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm ${loading || !body.trim()
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-200 dark:shadow-blue-900/30 hover:shadow-md'
                        }`}
                >
                    {loading ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Posting...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                            Post
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
