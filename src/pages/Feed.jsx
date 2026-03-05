import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { authContext } from "../contexts/Authcontext";
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import { Link } from 'react-router-dom';

// ── Left Sidebar ───────────────────────────────────────────────
function LeftSidebar({ userName, userPhoto, postsCount }) {
  const avatar = userPhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'U')}&background=6366f1&color=fff&size=96`;

  const navItems = [
    {
      label: 'Feed', to: '/', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      label: 'Profile', to: '/Profile', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
  ];

  return (
    <div className="space-y-4">
      {/* User mini-card */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm dark:shadow-black/20 border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Mini cover */}
        <div className="h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500" />
        <div className="px-4 pb-4 -mt-8">
          <img
            src={avatar}
            alt={userName}
            className="w-14 h-14 rounded-full border-3 border-white dark:border-[#1e1e1e] shadow-md object-cover"
            onError={e => { e.target.src = avatar; }}
          />
          <p className="mt-2 font-bold text-gray-900 dark:text-white text-sm">{userName || 'User'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{postsCount} posts</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm dark:shadow-black/20 border border-gray-200 dark:border-gray-800 p-3">
        <nav className="space-y-1">
          {navItems.map(item => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
            >
              <span className="text-blue-500">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Stats card */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm dark:shadow-black/20 border border-gray-200 dark:border-gray-800 p-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Your Activity</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Posts</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{postsCount}</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min((postsCount / 20) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">Keep sharing with your network!</p>
        </div>
      </div>
    </div>
  );
}

// ── Right Sidebar ──────────────────────────────────────────────
function RightSidebar({ totalPosts }) {
  const tips = [
    { icon: '📸', text: 'Add a photo to get more engagement' },
    { icon: '💬', text: 'Reply to comments to boost reach' },
    { icon: '🔁', text: 'Share interesting posts with others' },
    { icon: '⭐', text: 'Explore trending posts daily' },
  ];

  return (
    <div className="space-y-4">
      {/* Feed summary */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm dark:shadow-black/20 border border-gray-200 dark:border-gray-800 p-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Feed Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{totalPosts}</p>
            <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5">Total Posts</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">🔥</p>
            <p className="text-xs text-purple-500 dark:text-purple-400 mt-0.5">Trending</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm dark:shadow-black/20 border border-gray-200 dark:border-gray-800 p-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">💡 Tips for you</h3>
        <ul className="space-y-2.5">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-400">
              <span className="text-base leading-none mt-0.5">{tip.icon}</span>
              <span>{tip.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer links */}
      <div className="px-1">
        <p className="text-[11px] text-gray-400 dark:text-gray-600 leading-relaxed">
          SocialHub · Privacy · Terms · Advertising · Cookies ·{' '}
          <span className="text-gray-400 dark:text-gray-500">© 2025 SocialHub</span>
        </p>
      </div>
    </div>
  );
}

// ── Feed Page ──────────────────────────────────────────────────
export default function Feed() {
  const { userToken, userName, userPhoto } = useContext(authContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getPosts() {
    try {
      const { data } = await axios.get("https://route-posts.routemisr.com/posts", {
        headers: { token: userToken }
      });
      setPosts(data.data.posts);
    } catch (e) {
      console.error('Failed to fetch posts', e);
    } finally {
      setLoading(false);
    }
  }

  function handlePostCreated(newPost) {
    setPosts(prev => [newPost, ...prev]);
  }

  function handlePostDeleted(postId) {
    setPosts(prev => prev.filter(p => p._id !== postId));
  }

  function handlePostUpdated(updatedPost) {
    setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f0f0f] pt-6 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start">

          {/* ── LEFT SIDEBAR ── */}
          <div className="hidden lg:block lg:col-span-1 sticky top-20">
            <LeftSidebar
              userName={userName}
              userPhoto={userPhoto}
              postsCount={posts.length}
            />
          </div>

          {/* ── CENTER FEED ── */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-4">
            <CreatePost onPostCreated={handlePostCreated} />

            {loading ? (
              <>
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-3 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="space-y-1.5">
                        <div className="w-28 h-3 rounded-full bg-gray-200 dark:bg-gray-700" />
                        <div className="w-20 h-2.5 rounded-full bg-gray-100 dark:bg-gray-800" />
                      </div>
                    </div>
                    <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="w-4/5 h-3 rounded-full bg-gray-100 dark:bg-gray-800" />
                    <div className="w-full h-40 rounded-xl bg-gray-200 dark:bg-gray-700" />
                  </div>
                ))}
              </>
            ) : posts.length > 0 ? (
              posts.map((post, idx) => (
                <Post
                  key={post._id || `post-${idx}`}
                  post={post}
                  commentsLimit={2}
                  onPostDeleted={handlePostDeleted}
                  onPostUpdated={handlePostUpdated}
                />
              ))
            ) : (
              <div className="text-center py-16 bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-[#2a2a2a] flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No posts yet. Be the first to share!</p>
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="hidden lg:block lg:col-span-1 sticky top-20">
            <RightSidebar totalPosts={posts.length} />
          </div>

        </div>
      </div>
    </div>
  );
}