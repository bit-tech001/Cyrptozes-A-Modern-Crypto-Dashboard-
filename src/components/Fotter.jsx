import React from 'react';

const Footer = () => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8 mt-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center text-sm text-gray-400 space-y-2">
          <p className="text-lg font-semibold text-white">
            &copy; {new Date().getFullYear()} Cryptozes. All Rights Reserved.
          </p>
          <p className="text-sm sm:text-base">
            Built with <span className="text-emerald-400">❤️</span> and React
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://x.com/PathakBitu89550"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-400 transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="www.linkedin.com/in/bitu-pathak"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://mypro-adf-4qqx.vercel.app/" // Replace with your actual portfolio link
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-400 transition-colors"
            >
              Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
