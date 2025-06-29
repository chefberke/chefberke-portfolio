import React from "react";

function Footer() {
  return (
    <footer className="mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Main content */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Designed and developed with ❤️
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
              © {new Date().getFullYear()} Berke Kanber. All rights reserved.
            </p>
          </div>

          {/* Minimal separator */}
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

          {/* Inspirational note */}
          <p className="text-gray-400 dark:text-gray-600 text-xs text-center max-w-md">
            Believe in yourself and magic happens ✨
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
