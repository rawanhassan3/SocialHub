import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Switch } from "@heroui/react";
import bg from '../images/signinandupimage.jpg'

export const MoonIcon = (props) => (
  <svg aria-hidden="true" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" {...props}>
    <path d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z" fill="currentColor" />
  </svg>
);

export const SunIcon = (props) => (
  <svg aria-hidden="true" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" {...props}>
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
      <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
    </g>
  </svg>
);

export default function Authlayout() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">

      {/* ── Left Side (Marketing Split) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 lg:p-16 overflow-hidden bg-[#0a0a0a]">

        {/* Abstract Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[20%] -right-[20%] w-[60%] h-[80%] rounded-full bg-indigo-600/20 mix-blend-screen filter blur-[130px] animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute -bottom-[20%] left-[20%] w-[80%] h-[60%] rounded-full bg-purple-600/20 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
        </div>

        {/* Top left Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-xl shadow-[0_0_30px_rgba(79,70,229,0.3)] border border-white/10">
            S
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">Social<span className="text-blue-500 ps-1">Hub</span></span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-xl mt-12">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md w-fit mb-8 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-blue-200 tracking-wide uppercase">New Features Available</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-indigo-200 leading-[1.1] tracking-tight mb-6 drop-shadow-sm">
            Discover a new<br />way to connect.
          </h1>

          <p className="text-lg text-blue-100/60 leading-relaxed max-w-md font-light mb-16">
            Experience the next generation of social interaction. Fast, secure, and beautifully designed for your everyday moments.
          </p>

          {/* Aesthetic Floating Elements */}
          <div className="relative h-40 w-full">
            {/* Card 1 */}
            <div className="absolute z-20 left-0 top-0 w-72 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform -rotate-3 transition-transform hover:rotate-0 duration-500 hover:scale-105 group cursor-default">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-inner group-hover:shadow-[0_0_20px_rgba(96,165,250,0.5)] transition-shadow">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Real-time Sync</h4>
                  <p className="text-blue-200/60 text-xs mt-0.5">Zero latency messaging</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="absolute z-10 left-16 top-14 w-72 bg-white/5 backdrop-blur-3xl border border-white/5 rounded-2xl p-4 shadow-[0_30px_60px_rgba(0,0,0,0.6)] transform rotate-6 transition-transform hover:rotate-0 hover:z-30 duration-500 hover:scale-105 group cursor-default">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center shadow-inner group-hover:shadow-[0_0_20px_rgba(192,132,252,0.5)] transition-shadow">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Rich Media</h4>
                  <p className="text-pink-200/60 text-xs mt-0.5">4K Photo & Video support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metrics/Trust */}
        <div className="relative z-10 flex justify-center items-center gap-10 border-t border-white/10 pt-8 mt-4">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight">1M+</h3>
            <p className="text-sm text-blue-200/50 font-medium mt-1">Active Users</p>

          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight">10M+</h3>
            <p className="text-sm text-blue-200/50 font-medium mt-1">Posts Shared</p>

          </div>
          
          
          <div className="w-px h-10 bg-white/10"></div>
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight">4.9</h3>
            <div className="flex text-amber-400 text-xs gap-1 mt-2">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
          </div>
        </div>

      </div>


      {/* ── Right Side (Auth Form) ── */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-gray-50 dark:bg-[#121212] overflow-hidden">

        {/* Subtle background decoration for mobile */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/5 blur-[100px] rounded-full pointer-events-none lg:hidden" />

        {/* Header (Mobile Brand + Theme Switch) */}
        <div className="flex justify-between items-center p-6 lg:p-8 relative z-20">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-lg shadow-md border border-white/10">
              S
            </div>
            <span className="text-gray-900 dark:text-white text-xl font-bold tracking-tight">Social<span className="text-blue-500 ps-1">Hub</span></span>
          </div>
          <div className="ml-auto">
            <Switch
              isSelected={isDark}
              onValueChange={setIsDark}
              color="primary"
              size="md"
              thumbIcon={({ className, isSelected }) =>
                isSelected ? <SunIcon className={className} /> : <MoonIcon className={className} />
              }
            />
          </div>
        </div>

        {/* Outlet Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

      </div>

    </div>
  );
}