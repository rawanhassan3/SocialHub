import React, { useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { authContext, saveUserPhoto } from '../contexts/Authcontext';
import Post from '../components/Post';
import ChangePassword from '../components/ChangePassword';
import { Link, useLocation } from 'react-router-dom';

export default function Profile() {
  const { userToken, setUserToken, userPhoto, setUserPhoto, userName, userId } = useContext(authContext);
  const location = useLocation();

  function logout() {
    localStorage.removeItem("token");
    setUserToken(null);
  }

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Sync Tab with Navigation State ───────────────────
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // ── Fetch profile ─────────────────────────────────────
  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await axios.get(
          'https://route-posts.routemisr.com/users/profile-data',
          { headers: { token: userToken } }
        );
        const u = data?.data?.user || data?.data || data?.user || null;
        if (u) setUser(u);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    async function fetchUserPosts() {
      if (!userId) return;
      try {
        const { data } = await axios.get(
          `https://route-posts.routemisr.com/users/${userId}/posts`,
          { headers: { token: userToken } }
        );
        setUserPosts(data?.posts || data?.data?.posts || data?.data || []);
      } catch (error) {
        try {
          const { data } = await axios.get("https://route-posts.routemisr.com/posts", {
            headers: { token: userToken }
          });
          const allPosts = data?.posts || data?.data?.posts || data?.data || [];
          setUserPosts(allPosts.filter(p => p.user._id === userId));
        } catch (e) {
          console.error("Failed to fetch user posts", e);
        }
      } finally {
        setLoadingPosts(false);
      }
    }
    fetchUserPosts();
  }, [userId, userToken]);

  function handlePostDeleted(postId) {
    setUserPosts(prev => prev.filter(p => p._id !== postId));
  }

  function handlePostUpdated(updatedPost) {
    setUserPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
  }

  async function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewPhoto(localPreview);
    setUploadError('');
    setUploadSuccess('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const { data } = await axios.put(
        'https://route-posts.routemisr.com/users/upload-photo',
        formData,
        { headers: { token: userToken } }
      );

      const newPhoto =
        data?.data?.user?.photo ||
        data?.data?.photo ||
        data?.photo ||
        localPreview;

      setUserPhoto(newPhoto);
      saveUserPhoto(newPhoto);
      setUser(prev => prev ? { ...prev, photo: newPhoto } : prev);
      setPreviewPhoto(null);
      setUploadSuccess('Profile photo updated successfully! ✓');
    } catch (err) {
      setUploadError(err?.response?.data?.message || 'Failed to upload photo. Please try again.');
      setPreviewPhoto(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function triggerUpload() { fileInputRef.current?.click(); }

  const displayPhoto =
    previewPhoto ||
    user?.photo ||
    userPhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || userName || 'U')}&background=6366f1&color=fff&size=128`;

  // ── Loading skeleton ──────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="w-36 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="w-24 h-3 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
    );
  }

  const displayName = user?.name || userName || 'User';
  const displayUsername = user?.username || user?.email || '';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f0f0f]">

      {/* ── Main Content ── */}
      <div className="max-w-5xl  mx-auto px-4">

        {/* ── Cover + Profile Header (stuck together) ── */}
        <div className="rounded-2xl overflow-hidden shadow-sm dark:shadow-black/30 border border-gray-200 dark:border-gray-800">

          {/* Cover Photo */}
          <div className="h-28 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }}
            />
          </div>

          {/* Profile Header Bar */}
          <div className="bg-white dark:bg-[#1e1e1e] relative">
            <div className="px-4   md:px-8 pb-4">
              {/* Avatar Row */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                {/* Avatar */}
                <div className="flex items-end gap-4 -mt-16 sm:-mt-20">
                  <div className="relative group cursor-pointer" onClick={triggerUpload}>
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-[#1e1e1e] shadow-xl overflow-hidden bg-gray-200">
                      <img
                        src={displayPhoto}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        onError={e => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff&size=160`;
                        }}
                      />
                      <div className={`absolute inset-0 flex items-center justify-center rounded-full transition-opacity
                      ${uploading ? 'bg-black/60 opacity-100' : 'bg-black/50 opacity-0 group-hover:opacity-100'}`}>
                        {uploading ? (
                          <svg className="w-7 h-7 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Name + username (shown next to avatar on desktop) */}
                  <div className="mb-2 hidden sm:block">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
                    {displayUsername && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">@{displayUsername}</p>
                    )}
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                      {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pb-2">
                  <button
                    onClick={triggerUpload}
                    disabled={uploading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all shadow-sm ${uploading
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                      : 'bg-white dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                  >
                    {uploading ? (
                      <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Uploading...</>
                    ) : (
                      <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> Change Photo</>
                    )}
                  </button>
                </div>
              </div>

              {/* Name under avatar - mobile only */}
              <div className="mt-3 sm:hidden">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
                    {displayUsername && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">@{displayUsername}</p>
                    )}
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                      {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'}
                    </p>
                  </div>
                  {/* Mobile toggle button — opens top panel */}
                  <button
                    onClick={() => setSidebarOpen(prev => !prev)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all mt-1 ${sidebarOpen
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:text-blue-600'
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      {sidebarOpen
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      }
                    </svg>
                    {sidebarOpen ? 'Close' : 'Info'}
                  </button>
                </div>
              </div>

              {/* Feedback messages */}
              {uploadSuccess && (
                <div className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-xl border border-green-100 dark:border-green-800/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {uploadSuccess}
                </div>
              )}
              {uploadError && (
                <div className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-800/30">
                  ⚠️ {uploadError}
                </div>
              )}
            </div>

            {/* ── Tabs ── */}
            <div className="flex border-t border-gray-100 dark:border-gray-800 px-4 md:px-8">
              <button
                onClick={() => setActiveTab('posts')}
                className={`pb-3 pt-3 px-5 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Posts
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">{userPosts.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-3 pt-3 px-5 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            </div>
          </div>
        </div>{/* end cover+header wrapper */}

        {/* ── Mobile Top Panel Overlay ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Mobile Top-Sliding Panel ── */}
        <div
          className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a] shadow-2xl lg:hidden transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Profile Info</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Panel Body */}
          <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* About Card */}
            <div className="bg-gray-50 dark:bg-[#252525] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">About</h2>
              <ul className="space-y-3 text-sm">
                {user?.email && (
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span className="truncate">{user.email}</span>
                  </li>
                )}
                {displayUsername && displayUsername !== user?.email && (
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <span className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    @{displayUsername}
                  </li>
                )}
                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'} published
                </li>
              </ul>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gray-50 dark:bg-[#252525] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 mb-2">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() => { triggerUpload(); setSidebarOpen(false); }}
                  disabled={uploading}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#2a2a2a] transition-colors text-left"
                >
                  <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  Update Profile Photo
                </button>
                <button
                  onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#2a2a2a] transition-colors text-left"
                >
                  <span className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  Change Password
                </button>
                <Link to="/Signin"
                  onClick={() => { logout(); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                >
                  <span className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                  Log Out
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-column Grid Layout ── */}
        <div className="py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ── LEFT SIDEBAR — hidden on mobile, visible on desktop ── */}
          <div className="hidden lg:block lg:col-span-1 space-y-4 self-start sticky top-20">

            {/* About Card */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm dark:shadow-black/20 border border-gray-200 dark:border-gray-800 p-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">About</h2>
              <ul className="space-y-3 text-sm">
                {user?.email && (
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span className="truncate">{user.email}</span>
                  </li>
                )}
                {displayUsername && displayUsername !== user?.email && (
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <span className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    @{displayUsername}
                  </li>
                )}
                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'} published
                </li>
              </ul>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm dark:shadow-black/20 border border-gray-200 dark:border-gray-800 p-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={triggerUpload}
                  disabled={uploading}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors text-left"
                >
                  <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  Update Profile Photo
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors text-left"
                >
                  <span className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  Change Password
                </button>

                <Link to="/Signin"
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                >
                  <span className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                  Log Out
                </Link>
              </div>
            </div>

          </div>

          {/* ── RIGHT / MAIN CONTENT ── */}
          <div className="lg:col-span-2">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />

            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <ChangePassword />
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
                {loadingPosts ? (
                  <>
                    {[1, 2].map(i => (
                      <div key={i} className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
                    ))}
                  </>
                ) : userPosts.length > 0 ? (
                  <>
                    {userPosts.map((post, idx) => (
                      <Post
                        key={post._id || `post-${idx}`}
                        post={post}
                        commentsLimit={2}
                        onPostDeleted={handlePostDeleted}
                        onPostUpdated={handlePostUpdated}
                      />
                    ))}
                  </>
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-400 font-medium">You haven't created any posts yet.</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Share something with your network!</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
