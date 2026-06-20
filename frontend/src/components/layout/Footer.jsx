import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 text-center text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800 mt-12 bg-transparent">
      <p>&copy; {new Date().getFullYear()} PlaceWise Platform. Built for Data Science & Predictive Analytics.</p>
    </footer>
  );
};

export default Footer;
