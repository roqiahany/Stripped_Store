import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserIcon from './UserIcon';

const MenuLinks = ({ variant = 'desktop', onLinkClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Our Products', path: '/all-products' },
    { name: 'Contact Us', path: '/contact' },
  ];

  /* =======================
     🖥️ DESKTOP DESIGN
  ======================== */
  if (variant === 'desktop') {
    return (
      <ul className="hidden md:flex space-x-8 text-left">
        {links
          .slice()
          .reverse()
          .map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`relative font-medium text-gray-800 transition-all duration-300 group text-left
            ${isActive ? 'text-pink-700' : 'hover:text-pink-700'}
          `}
                >
                  {link.name}

                  {/* underline */}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-pink-700 transition-all duration-300
              ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
            `}
                  />
                </Link>
              </li>
            );
          })}
      </ul>
    );
  }

  /* =======================
     📱 SIDEBAR / MOBILE DESIGN
  ======================== */
  return (
    <div className="flex flex-col gap-6  text-left">
      {/* 👤 Account Card */}
      <div className="bg-gray-50 rounded-xl p-4 shadow-sm border flex items-center gap-3">
        <UserIcon />
        <div>
          <p className="text-sm font-medium text-gray-800">My Account</p>
          <p className="text-xs text-gray-500">Login / Profile</p>
        </div>
      </div>

      {/* 🛒 Cart Card */}
      <div
        onClick={() => {
          onLinkClick?.();
          navigate('/cart');
        }}
        className="bg-gray-50 rounded-xl p-4 shadow-sm border flex items-center gap-3 cursor-pointer hover:bg-pink-50 transition"
      >
        <span className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center">
          🛒
        </span>
        <div>
          <p className="text-sm font-medium text-gray-800">My Cart</p>
          <p className="text-xs text-gray-500">View products</p>
        </div>
      </div>

      {/* 🔗 Links as Cards */}
      {links.map((link) => {
        const isActive = location.pathname === link.path;

        return (
          <Link
            key={link.name}
            to={link.path}
            onClick={onLinkClick}
            className={`bg-gray-50 rounded-xl p-4 shadow-sm border flex items-center justify-between
              hover:bg-pink-50 transition text-left
              ${isActive && 'border-pink-600 bg-pink-50'}
            `}
          >
            <span className="text-gray-800 font-medium">{link.name}</span>
            <span className="text-pink-600 text-lg">›</span>
          </Link>
        );
      })}
    </div>
  );
};

export default MenuLinks;
