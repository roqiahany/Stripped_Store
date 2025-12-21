import { useLocation } from 'react-router-dom';

const MenuLinks = () => {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Our Products', path: '/all-products' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <ul className="md:flex space-x-8">
      {links.map((link) => {
        const isActive = location.pathname === link.path;

        return (
          <li key={link.name}>
            <a
              href={link.path}
              className={`relative text-gray-800 text-sm sm:text-base md:text-lg transition-all duration-300 font-medium group
                ${
                  isActive
                    ? 'text-pink-700 scale-105'
                    : 'hover:text-pink-700 hover:scale-105'
                }
              `}
            >
              {link.name}
              {/* خط أسفل للنشط والهوفر */}
              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-pink-700 transition-all duration-300
                  ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
                `}
              ></span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default MenuLinks;
