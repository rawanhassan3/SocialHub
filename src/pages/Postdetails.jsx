import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { authContext } from '../contexts/Authcontext';
import Post from '../components/Post';

// ── Left Sidebar (replicated from Feed) ─────────────────────────
function LeftSidebar({ userName, userPhoto }) {
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
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm dark:shadow-black/20 border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500" />
        <div className="px-4 pb-4 -mt-8">
          <img
            src={avatar}
            alt={userName}
            className="w-14 h-14 rounded-full border-3 border-white dark:border-[#1e1e1e] shadow-md object-cover"
          />
          <p className="mt-2 font-bold text-gray-900 dark:text-white text-sm">{userName || 'User'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Post Details View</p>
        </div>
      </div>

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
    </div>
  );
}

// ── Right Sidebar (replicated from Feed) ────────────────────────
function RightSidebar() {
  const tips = [
    { icon: '📸', text: 'Viewing full conversation and details' },
    { icon: '💬', text: 'Reply to comments to boost reach' },
    { icon: '🔁', text: 'Share interesting posts with others' },
    { icon: '⭐', text: 'Explore trending posts daily' },
  ];

  return (
    <div className="space-y-4">
      

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

      <div className="px-1 text-center">
        <Link to="/" className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors">
          ← Back to full feed
        </Link>
      </div>
    </div>
  );
}

export default function Postdetails() {
  const { userToken, userName, userPhoto } = useContext(authContext);
  let { postId } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  async function getpostDetails() {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/posts/${postId}`,
        {
          headers: { token: userToken }
        }
      );

      let fetchedPost = data.data.post || data.data || data;

      try {
        const { data: commentsData } = await axios.get(
          `https://route-posts.routemisr.com/posts/${postId}/comments`,
          {
            headers: { token: userToken }
          }
        );

        let allComments = [];
        if (Array.isArray(commentsData.data)) {
          allComments = commentsData.data;
        } else if (commentsData.comments && Array.isArray(commentsData.comments)) {
          allComments = commentsData.comments;
        } else if (commentsData.data && Array.isArray(commentsData.data.comments)) {
          allComments = commentsData.data.comments;
        }

        fetchedPost.comments = allComments;
      } catch (err) {
        console.error("Error fetching comments:", err);
      }

      setPost(fetchedPost);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getpostDetails()
  }, [postId])


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f0f0f] pt-6 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start">

          {/* LEFT SIDEBAR */}
          <div className="hidden lg:block lg:col-span-1 sticky top-20">
            <LeftSidebar userName={userName} userPhoto={userPhoto} />
          </div>

          {/* CENTER CONTENT */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-4">
            {loading ? (
              <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-1.5">
                    <div className="w-28 h-3 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="w-20 h-2.5 rounded-full bg-gray-100 dark:bg-gray-800" />
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="w-full h-40 rounded-xl bg-gray-200 dark:bg-gray-700" />
              </div>
            ) : post ? (
              <>
                <div className="mb-4">
                  <Link to="/" className="text-sm font-bold text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Feed
                  </Link>
                </div>
                <Post post={post} />
              </>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400">Post not found or has been deleted.</p>
                <Link to="/" className="mt-4 inline-block text-blue-500 font-bold hover:underline">Return to Feed</Link>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden lg:block lg:col-span-1 sticky top-20">
            <RightSidebar />
          </div>

        </div>
      </div>
    </div>
  )
}
