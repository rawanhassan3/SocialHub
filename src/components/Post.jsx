import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { authContext } from '../contexts/Authcontext';

export default function Post({ post, commentsLimit, onPostDeleted, onPostUpdated }) {
    const { userToken, userId, userPhoto, userName } = useContext(authContext);

    const isOwner = userId && post.user?._id === userId;


    const sharedData = post.post || post.sharedPost || post.shareFrom;
    const isShare = !!sharedData;

    // ── Post edit state ──────────────────────────────────
    const [showPostMenu, setShowPostMenu] = useState(false);
    const [editingPost, setEditingPost] = useState(false);
    const [editBody, setEditBody] = useState(post.body);
    const [savingPost, setSavingPost] = useState(false);
    const [deletingPost, setDeletingPost] = useState(false);
    const [postError, setPostError] = useState('');
    const [currentBody, setCurrentBody] = useState(post.body);
    const [likesCount, setLikesCount] = useState(post.likesCount || 0);
    const [isSharing, setIsSharing] = useState(false);
    const [shareSuccess, setShareSuccess] = useState(false);

    // Some APIs return whether the current user liked the post (e.g., in a likes array)
    // If not, we fall back to false initially.
    const hasUserLiked = post.likes && post.likes.some(like => like === userId || like._id === userId);
    const [isLiked, setIsLiked] = useState(hasUserLiked || false);

    // ── Comments state ───────────────────────────────────
    const initialComments = post.comments
        ? post.comments
        : Array.isArray(post.topComment)
            ? post.topComment
            : post.topComment
                ? [post.topComment]
                : [];

    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const [postingComment, setPostingComment] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [commentError, setCommentError] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [postingReply, setPostingReply] = useState(false);
    const [loadingReplies, setLoadingReplies] = useState({});
    const [showCommentEmoji, setShowCommentEmoji] = useState(false);
    const [showReplyEmoji, setShowReplyEmoji] = useState(null);

    const commonEmojis = ["😊", "😂", "🥰", "😍", "🤩", "🔥", "✨", "🙌", "👍", "❤️", "💯", "🎉"];

    function addEmojiToComment(emoji) {
        setNewComment(prev => prev + emoji);
        setShowCommentEmoji(false);
    }

    function addEmojiToReply(emoji) {
        setReplyContent(prev => prev + emoji);
        setShowReplyEmoji(null);
    }

    const commentsToRender = commentsLimit ? comments.slice(0, commentsLimit) : comments;

    // ── Edit Post ────────────────────────────────────────
    async function handleEditPost() {
        if (!editBody.trim()) return;
        setSavingPost(true);
        setPostError('');
        try {
            const { data } = await axios.put(
                `https://route-posts.routemisr.com/posts/${post._id}`,
                { body: editBody.trim() },
                { headers: { token: userToken } }
            );
            const updatedBody = data.data?.post?.body ?? editBody.trim();
            setCurrentBody(updatedBody);
            setEditingPost(false);
            setShowPostMenu(false);
            if (onPostUpdated) onPostUpdated({ ...post, body: updatedBody });
        } catch (err) {
            setPostError(err?.response?.data?.message || 'Failed to update post.');
        } finally {
            setSavingPost(false);
        }
    }

    // ── Delete Post ──
    async function handleDeletePost() {
        setDeletingPost(true);
        setShowPostMenu(false);
        try {
            await axios.delete(
                `https://route-posts.routemisr.com/posts/${post._id}`,
                { headers: { token: userToken } }
            );
            if (onPostDeleted) onPostDeleted(post._id);
        } catch (err) {
            setPostError(err?.response?.data?.message || 'Failed to delete post.');
            setDeletingPost(false);
        }
    }

    // ── Create Comment ───
    async function handleAddComment(e) {
        e.preventDefault();
        if (!newComment.trim()) return;
        setPostingComment(true);
        setCommentError('');
        try {
            const { data } = await axios.post(
                `https://route-posts.routemisr.com/posts/${post._id}/comments`,
                { content: newComment.trim() },
                { headers: { token: userToken } }
            );
            const created = data.data?.comment || data.data || data.comment;
            if (created) setComments(prev => [created, ...prev]);
            setNewComment('');
        } catch (err) {
            setCommentError(err?.response?.data?.message || 'Failed to post comment.');
        } finally {
            setPostingComment(false);
        }
    }

    // ── Edit Comment ───
    function startEdit(comment) {
        setEditingId(comment._id);
        setEditContent(comment.content);
        setOpenMenuId(null);
    }

    async function handleEditComment(commentId) {
        if (!editContent.trim()) return;
        try {
            const { data } = await axios.put(
                `https://route-posts.routemisr.com/posts/${post._id}/comments/${commentId}`,
                { content: editContent.trim() },
                { headers: { token: userToken } }
            );
            const updated = data.data?.comment || data.data || data.comment;
            setComments(prev =>
                prev.map(c =>
                    c._id === commentId
                        ? { ...c, content: updated?.content ?? editContent.trim() }
                        : c
                )
            );
            setEditingId(null);
            setEditContent('');
        } catch (err) {
            setCommentError(err?.response?.data?.message || 'Failed to update comment.');
        }
    }

    // ── Delete Comment ───
    async function handleDeleteComment(commentId) {
        setDeletingId(commentId);
        setOpenMenuId(null);
        try {
            await axios.delete(
                `https://route-posts.routemisr.com/posts/${post._id}/comments/${commentId}`,
                { headers: { token: userToken } }
            );
            setComments(prev => prev.filter(c => c._id !== commentId));
        } catch (err) {
            setCommentError(err?.response?.data?.message || 'Failed to delete comment.');
        } finally {
            setDeletingId(null);
        }
    }

    // ── Toggle Like ──────────────────────────────────────
    async function handleToggleLike() {
        const wasLiked = isLiked;
        const currentCount = likesCount;

        
        setIsLiked(!wasLiked);
        setLikesCount(wasLiked ? Math.max(0, currentCount - 1) : currentCount + 1);

        try {
            const { data } = await axios.put(
                `https://route-posts.routemisr.com/posts/${post._id}/like`,
                {},
                { headers: { token: userToken } }
            );

            
            if (onPostUpdated) {
                onPostUpdated(data.data?.post || data.post || {
                    ...post,
                    likesCount: wasLiked ? Math.max(0, currentCount - 1) : currentCount + 1,
                    likes: wasLiked ? (post.likes || []).filter(l => l !== userId && l._id !== userId) : [...(post.likes || []), userId]
                });
            }
        } catch (err) {
            
            setIsLiked(wasLiked);
            setLikesCount(currentCount);
        }
    }

    // ── Share Post ───────────────────────────────────────
    async function handleShare() {
        if (isSharing) return;
        setIsSharing(true);
        setShareSuccess(false);
        try {
            await axios.post(
                `https://route-posts.routemisr.com/posts/${post._id}/share`,
                {},
                { headers: { token: userToken } }
            );
            setShareSuccess(true);
            setTimeout(() => setShareSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to share post", err);
            setPostError(err?.response?.data?.message || 'Failed to share post.');
        } finally {
            setIsSharing(false);
        }
    }

    // Keep Local state in sync with Parent Feed re-renders,
    // only update local state if the prop's likesCount is strictly different and we aren't currently toggling.
    React.useEffect(() => {
        setLikesCount(post.likesCount || 0);
        const hasUserLiked = post.likes && post.likes.some(like => like === userId || like._id === userId);
        setIsLiked(hasUserLiked || false);
    }, [post.likesCount, post.likes, userId]);

    // ── Toggle Comment Like ──────────────────────────────
    async function handleToggleCommentLike(commentId) {
        setComments(prev => prev.map(c => {
            if (c._id === commentId) {
                const wasLiked = c.isLiked || false;
                const currentLikes = c.likesCount || 0;
                return {
                    ...c,
                    isLiked: !wasLiked,
                    likesCount: wasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1
                };
            }
            return c;
        }));

        try {
            await axios.put(
                `https://route-posts.routemisr.com/posts/${post._id}/comments/${commentId}/like`,
                {},
                { headers: { token: userToken } }
            );
        } catch (err) {
            // Revert locally on error
            setComments(prev => prev.map(c => {
                if (c._id === commentId) {
                    const wasLiked = c.isLiked || false; // this is the *new* failed state
                    const currentLikes = c.likesCount || 0;
                    return {
                        ...c,
                        isLiked: !wasLiked,
                        // If it failed while trying to like (wasLiked is true in state), revert to -1
                        likesCount: wasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1
                    };
                }
                return c;
            }));
        }
    }

    // ── Create Reply ────────────────────────────────────
    async function handleAddReply(commentId) {
        if (!replyContent.trim()) return;
        setPostingReply(true);
        try {
            const { data } = await axios.post(
                `https://route-posts.routemisr.com/posts/${post._id}/comments/${commentId}/replies`,
                { content: replyContent.trim() },
                { headers: { token: userToken } }
            );

            const newReply = data.data || data.reply || data;

    
            const localReply = {
                ...newReply,
                user: newReply.user || { name: userName, photo: userPhoto },
                content: newReply.content || replyContent.trim(),
                body: newReply.body || replyContent.trim()
            };

            setComments(prev => prev.map(c => {
                if (c._id === commentId) {
                    
                    const existingReplies = Array.isArray(c.replies) ? c.replies : [];
                    return {
                        ...c,
                        replies: [...existingReplies, localReply],
                        hasLoadedReplies: true
                    };
                }
                return c;
            }));

            setReplyContent('');
            setReplyingTo(null);
        } catch (err) {
            setCommentError(err?.response?.data?.message || 'Failed to post reply.');
        } finally {
            setPostingReply(false);
        }
    }

    // ── Get Replies ─────────────────────────────────────
    async function getReplies(commentId) {
        if (loadingReplies[commentId]) return;

        setLoadingReplies(prev => ({ ...prev, [commentId]: true }));
        try {
            const { data } = await axios.get(
                `https://route-posts.routemisr.com/posts/${post._id}/comments/${commentId}/replies`,
                { headers: { token: userToken } }
            );

            const fetchedReplies = data.data || data.replies || [];

            setComments(prev => prev.map(c => {
                if (c._id === commentId) {
                    return {
                        ...c,
                        replies: fetchedReplies,
                        hasLoadedReplies: true
                    };
                }
                return c;
            }));
        } catch (err) {
            console.error("Failed to fetch replies", err);
        } finally {
            setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
        }
    }

    // Synchronize comments state with props when feed updates
    useEffect(() => {
        const updatedInitial = post.comments
            ? post.comments
            : Array.isArray(post.topComment)
                ? post.topComment
                : post.topComment
                    ? [post.topComment]
                    : [];
        setComments(updatedInitial);
    }, [post.comments, post.topComment]);

    // Auto-load replies for comments
    useEffect(() => {
        commentsToRender.forEach(comment => {
            if (!comment.hasLoadedReplies && !loadingReplies[comment._id]) {
                getReplies(comment._id);
            }
        });
    }, [commentsToRender]);

    return (
        <div className={`transition-opacity duration-300 ${deletingPost ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex justify-center">
                <div className="w-full bg-white dark:bg-[#1e1e1e] sm:rounded-2xl shadow-sm dark:shadow-none
                        border-b sm:border border-gray-100 dark:border-gray-800 overflow-hidden mb-4">

                    {/* ── Post Header ── */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={post.user.photo}
                                className="w-11 h-11 rounded-full object-cover"
                                alt={post.user.name}
                            />
                            <div>
                                <p className="font-semibold dark:text-white text-gray-900 leading-none flex items-center gap-1.5">
                                    {post.user?.name || 'Anonymous'}
                                    {isShare && (
                                        <span className="text-[10px] font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            shared a post
                                        </span>
                                    )}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(post.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* ⋯ Post Menu — only for post owner */}
                        {isOwner && (
                            <div className="relative">
                                <button
                                    onClick={() => { setShowPostMenu(p => !p); setEditingPost(false); setPostError(''); }}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                >
                                    <svg width="20" height="20" fill="currentColor" className="text-gray-500 dark:text-gray-400">
                                        <circle cx="10" cy="4" r="1.5" />
                                        <circle cx="10" cy="10" r="1.5" />
                                        <circle cx="10" cy="16" r="1.5" />
                                    </svg>
                                </button>
                                {showPostMenu && (
                                    <div className="absolute right-0 top-10 z-30 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden min-w-[140px]">
                                        <button
                                            onClick={() => { setEditBody(currentBody); setEditingPost(true); setShowPostMenu(false); }}
                                            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit Post
                                        </button>
                                        <div className="border-t border-gray-100 dark:border-gray-700" />
                                        <button
                                            onClick={handleDeletePost}
                                            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete Post
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Post Caption or Edit Mode ── */}
                    <div className="px-4 pb-3">
                        {editingPost ? (
                            <div className="flex flex-col gap-2">
                                <textarea
                                    value={editBody}
                                    onChange={e => setEditBody(e.target.value)}
                                    rows={3}
                                    className="w-full resize-none bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-100 px-4 py-3 text-sm rounded-2xl border border-blue-400 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all leading-relaxed"
                                    autoFocus
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => { setEditingPost(false); setPostError(''); }}
                                        className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEditPost}
                                        disabled={savingPost || !editBody.trim()}
                                        className={`px-4 py-1.5 text-sm font-semibold rounded-xl transition ${savingPost || !editBody.trim()
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                    >
                                        {savingPost ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {/* Sharer's Caption */}
                                {(currentBody || !isShare) && (
                                    <p className="dark:text-white text-gray-700 text-sm leading-relaxed">
                                        {currentBody || (isShare ? "" : "No content")}
                                    </p>
                                )}

                                {/* Original Post (if it's a share) */}
                                {isShare && (
                                    <div className="mt-1 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/40 dark:bg-[#252525]/30">
                                        <div className="p-3.5">
                                            <div className="flex items-center gap-2.5 mb-2.5">
                                                <img
                                                    src={sharedData.user?.photo || sharedData.user?.image || 'https://via.placeholder.com/150'}
                                                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                                                    alt={sharedData.user?.name || 'User'}
                                                />
                                                <div>
                                                    <p className="text-sm font-bold dark:text-white text-gray-800 leading-none">
                                                        {sharedData.user?.name || 'Original Author'}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 mt-1">
                                                        {sharedData.createdAt ? new Date(sharedData.createdAt).toLocaleDateString() : 'Original Post'}
                                                    </p>
                                                </div>
                                            </div>
                                            {sharedData.body && (
                                                <p className="dark:text-gray-300 text-gray-700 text-sm leading-relaxed italic">
                                                    "{sharedData.body}"
                                                </p>
                                            )}
                                        </div>
                                        {(sharedData.image || sharedData.photo) && (
                                            <img
                                                src={sharedData.image || sharedData.photo}
                                                className="w-full h-52 object-cover border-t border-gray-100 dark:border-gray-800"
                                                alt="shared post content"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        {postError && (
                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">⚠️ {postError}</p>
                        )}
                    </div>

                    {/* ── Image (Only for regular posts) ── */}
                    {!isShare && post.image?.trim() && (
                        <div className="relative">
                            <img src={post.image} className="w-full h-72 object-cover" alt="post" />
                        </div>
                    )}

                    {/* ── Stats ── */}
                    <div className="flex items-center justify-between px-4 py-3 text-sm border-t border-gray-50 dark:border-gray-800/50 mt-2">
                        <button
                            onClick={handleToggleLike}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition font-medium group ${isLiked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500' : 'group-hover:fill-red-500'}`} fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{likesCount}</span>
                        </button>

                        <button
                            onClick={handleShare}
                            disabled={isSharing}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition font-medium group ${shareSuccess ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-gray-500 dark:text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'}`}>
                            {isSharing ? (
                                <svg className="w-5 h-5 animate-spin text-green-500" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-colors ${shareSuccess ? 'fill-green-500' : 'group-hover:fill-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            )}
                            <span>{shareSuccess ? 'Shared!' : 'Share'}</span>
                        </button>

                        <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-full transition font-medium group">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:fill-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{comments.length}</span>
                        </button>
                    </div>

                    {/* ── Comments Section ── */}
                    <div className="bg-gray-50/50 dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-gray-800">

                        {/* Add Comment */}
                        <form onSubmit={handleAddComment} className="flex items-center gap-2 p-4">
                            <img src={userPhoto || post.user.photo} className="w-8 h-8 rounded-full flex-shrink-0" alt="avatar" />
                            <div className="flex-1 relative flex items-center">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="w-full bg-white dark:bg-[#2a2a2a] pl-4 pr-10 py-2 rounded-full border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-sm dark:text-white dark:placeholder-gray-400 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCommentEmoji(!showCommentEmoji)}
                                    className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                        <line x1="9" y1="9" x2="9.01" y2="9" />
                                        <line x1="15" y1="9" x2="15.01" y2="9" />
                                    </svg>
                                </button>

                                {showCommentEmoji && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowCommentEmoji(false)} />
                                        <div className="absolute bottom-full right-0 mb-2 z-50 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-2 w-48 animate-in fade-in zoom-in duration-200">
                                            <div className="grid grid-cols-4 gap-1">
                                                {commonEmojis.map(emoji => (
                                                    <button
                                                        key={emoji}
                                                        type="button"
                                                        onClick={() => addEmojiToComment(emoji)}
                                                        className="text-lg hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-lg transition-colors"
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={postingComment || !newComment.trim()}
                                className={`text-sm font-semibold transition px-3 py-1.5 rounded-full ${postingComment || !newComment.trim()
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                    }`}
                            >
                                {postingComment ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                ) : 'Post'}
                            </button>
                        </form>

                        {commentError && (
                            <p className="px-4 pb-2 text-xs text-red-500">{commentError}</p>
                        )}

                        {commentsToRender.map((comment, idx) => (
                            <div className="px-4 pb-4" key={comment._id || `comment-${idx}`}>
                                <div className="flex gap-3 items-start relative group">
                                    <img
                                        src={comment.commentCreator.photo}
                                        alt={comment.commentCreator.name}
                                        className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
                                    />

                                    {editingId === comment._id ? (
                                        <div className="flex-1 flex gap-2 items-center">
                                            <input
                                                value={editContent}
                                                onChange={e => setEditContent(e.target.value)}
                                                className="flex-1 bg-white dark:bg-[#1e1e1e] px-3 py-2 rounded-2xl text-sm border border-blue-400 outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleEditComment(comment._id)}
                                                className="text-xs font-semibold text-blue-600 hover:underline px-2 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                                            >Save</button>
                                            <button
                                                onClick={() => { setEditingId(null); setEditContent(''); }}
                                                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                            >Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex-1 min-w-0">
                                            <div className="bg-white dark:bg-[#1e1e1e] px-3 py-2 rounded-2xl text-sm border border-gray-100 dark:border-gray-700 shadow-sm inline-block max-w-full">
                                                <span className="font-semibold mr-2 text-gray-900 dark:text-white">
                                                    {comment.commentCreator.name}
                                                </span>
                                                <span className="text-gray-700 dark:text-gray-300 break-words">
                                                    {deletingId === comment._id
                                                        ? <span className="text-gray-400 italic">Deleting...</span>
                                                        : comment.content}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 px-2 mt-1">
                                                <button
                                                    onClick={() => handleToggleCommentLike(comment._id)}
                                                    className={`text-[11px] font-bold transition-colors ${comment.isLiked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
                                                >
                                                    Like
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setReplyingTo(replyingTo === comment._id ? null : comment._id);
                                                        setReplyContent('');
                                                    }}
                                                    className="text-[11px] font-bold text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                                >
                                                    Reply
                                                </button>

                                                {/* Load Replies Button */}
                                                {!comment.hasLoadedReplies && (
                                                    <button
                                                        onClick={() => getReplies(comment._id)}
                                                        className="text-[11px] font-bold text-blue-500 hover:text-blue-600"
                                                        disabled={loadingReplies[comment._id]}
                                                    >
                                                        {loadingReplies[comment._id] ? 'Loading...' : 'View Replies'}
                                                    </button>
                                                )}

                                                {(comment.likesCount > 0) && (
                                                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                                        👍 {comment.likesCount}
                                                    </span>
                                                )}
                                            </div>

                                            {comment.replies && comment.replies.length > 0 && (
                                                <div className="mt-2 ml-2 pl-3 border-l-2 border-gray-100 dark:border-gray-800 space-y-3">
                                                    {comment.replies.map((reply, ridx) => (
                                                        <div key={reply._id || `reply-${ridx}`} className="flex gap-2 items-start">
                                                            <img
                                                                src={reply.user?.photo || reply.user?.image || 'https://via.placeholder.com/150'}
                                                                className="w-6 h-6 rounded-full object-cover"
                                                                alt="reply creator"
                                                            />
                                                            <div className="bg-gray-100/50 dark:bg-[#252525] px-2.5 py-1.5 rounded-xl text-xs border border-gray-50 dark:border-gray-700">
                                                                <span className="font-bold mr-1.5 dark:text-white">
                                                                    {reply.user?.name || 'User'}
                                                                </span>
                                                                <span className="text-gray-700 dark:text-gray-300">
                                                                    {reply.content || reply.body || "No text"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Reply Input */}
                                            {replyingTo === comment._id && (
                                                <div className="mt-2 ml-2 flex items-center gap-2 relative">
                                                    <div className="flex-1 relative flex items-center">
                                                        <input
                                                            value={replyContent}
                                                            onChange={e => setReplyContent(e.target.value)}
                                                            placeholder="Write a reply..."
                                                            className="w-full bg-white dark:bg-[#1e1e1e] pl-3 pr-8 py-1.5 rounded-full text-xs border border-blue-200 dark:border-gray-700 outline-none focus:ring-1 focus:ring-blue-400 dark:text-white"
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                                    e.preventDefault();
                                                                    handleAddReply(comment._id);
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowReplyEmoji(showReplyEmoji === comment._id ? null : comment._id)}
                                                            className="absolute right-2 text-gray-400 hover:text-gray-600"
                                                        >
                                                            <span className="text-sm">😊</span>
                                                        </button>

                                                        {showReplyEmoji === comment._id && (
                                                            <>
                                                                <div className="fixed inset-0 z-40" onClick={() => setShowReplyEmoji(null)} />
                                                                <div className="absolute bottom-full right-0 mb-2 z-50 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-1.5 w-40">
                                                                    <div className="grid grid-cols-5 gap-0.5">
                                                                        {commonEmojis.slice(0, 10).map(emoji => (
                                                                            <button
                                                                                key={emoji}
                                                                                type="button"
                                                                                onClick={() => addEmojiToReply(emoji)}
                                                                                className="text-base hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded transition-colors"
                                                                            >
                                                                                {emoji}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddReply(comment._id)}
                                                        disabled={postingReply || !replyContent.trim()}
                                                        className="text-xs font-bold text-blue-600 disabled:text-gray-400"
                                                    >
                                                        {postingReply ? '...' : 'Post'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}


                                    {/* Comment ⋯ menu */}
                                    {editingId !== comment._id && comment.commentCreator._id === userId && (
                                        <div className="relative flex-shrink-0">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === comment._id ? null : comment._id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"
                                            >
                                                <svg width="14" height="14" fill="currentColor">
                                                    <circle cx="7" cy="2" r="1.2" />
                                                    <circle cx="7" cy="7" r="1.2" />
                                                    <circle cx="7" cy="12" r="1.2" />
                                                </svg>
                                            </button>
                                            {openMenuId === comment._id && (
                                                <div className="absolute right-0 top-5 z-60 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden min-w-[120px]">
                                                    <button
                                                        onClick={() => startEdit(comment)}
                                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <div className="border-t border-gray-100 dark:border-gray-700" />
                                                    <button
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Show all comments link */}
                        {commentsLimit && post.commentsCount > commentsToRender.length && (
                            <div className="flex justify-center mb-3">
                                <Link
                                    to={"/post/" + post._id}
                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                                >
                                    Show all comments
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
