import { useState } from 'react';
import { useLocation } from 'react-router-dom'; // لو بتستخدمي React Router

const MenuLinks = () => {
  const location = useLocation(); // عشان نعرف الـ current path

  const links = [
    { name: 'Home', path: '/' },
    // { name: "About", path: "/about" },
    // { name: "Services", path: "/services" },
    // { name: "Contact", path: "/contact" },
  ];

  return (
    <ul className="md:flex space-x-8">
      {links.map((link) => (
        <li key={link.name}>
          <a
            href={link.path}
            className={`
              relative 
              text-gray-800 
              hover:text-pink-700 
              transition-colors 
              duration-300
               text-sm sm:text-base md:text-lg  
              ${
                location.pathname === link.path
                  ? 'font-semibold'
                  : 'font-normal'
              }
            `}
          >
            {link.name}
            {/* خط أسفل للنشط */}
            <span
              className={`
                absolute left-0 -bottom-1 h-0.5 bg-pink-700 transition-all duration-300
                ${location.pathname === link.path ? 'w-full' : 'w-0'}
                hover:w-full
              `}
            ></span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default MenuLinks;
