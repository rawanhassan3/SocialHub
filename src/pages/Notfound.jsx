import React from 'react';
import { Button } from "@heroui/react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Notfound() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden relative">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center flex flex-col items-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative inline-block"
        >
          {/* Main 404 Text */}
          <h1 className="text-[120px] sm:text-[180px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-br from-blue-500 via-indigo-500 to-indigo-600 drop-shadow-sm select-none">
            404
          </h1>

          {/* Floating Illustration-style 404 overlay */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 2, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-4 -right-8 w-16 h-16 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl flex items-center justify-center border border-gray-100 dark:border-gray-800"
          >
            <span className="text-2xl">🔍</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mb-8 px-4">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable in SocialHub.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            as={Link}
            to="/"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-1"
            radius="full"
          >
            Back to Home
          </Button>

          <Button
            onClick={() => window.history.back()}
            size="lg"
            variant="bordered"
            className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-semibold px-8"
            radius="full"
          >
            Go Back
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-sm text-gray-400 dark:text-gray-600"
        >
          Think this is a mistake? <a href="#" className="underline hover:text-blue-500 transition-colors">Let us know</a>
        </motion.p>
      </div>
    </div>
  );
}

