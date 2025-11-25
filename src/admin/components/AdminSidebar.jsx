// src/admin/components/AdminSidebar.jsx
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  WebcamIcon,
  LogOut,
} from 'lucide-react';

export default function AdminSidebar({ children }) {
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (auth.currentUser) {
      setProfileImage(auth.currentUser.photoURL || null);
      setDisplayName(auth.currentUser.displayName || '');
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    {
      label: 'لوحة التحكم',
      icon: <LayoutDashboard size={20} />,
      path: '/admin',
    },
    {
      label: ' موقعى',
      icon: <WebcamIcon size={20} />,
      path: '/',
    },
    {
      label: 'الملف الشخصي',
      icon: <User size={20} />,
      path: '/admin/profile',
    },
  ];

  return (
    <div className="flex min-h-screen relative">
      {/* السايدبار */}
      <div
        className={`fixed md:static top-0 right-0 h-full md:h-screen w-64 bg-pink-700 text-white flex flex-col
        ${
          open ? 'block' : 'hidden'
        } md:block transition-transform ease-in-out duration-300 z-50 shadow-lg`}
      >
        {/* الهيدر */}
        <div className="p-4 flex items-center justify-between border-b border-pink-500 ">
          {/* زر الإغلاق في الموبايل */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden  bg-pink-600 text-white p-2 rounded-lg shadow-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* البروفايل */}
        <div className="flex flex-col items-center p-6 border-b border-pink-500">
          <div className="relative w-16 h-16">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-pink-400 shadow-md"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 text-pink-700 rounded-full flex items-center justify-center font-semibold shadow-md text-lg">
                {displayName ? displayName.slice(0, 2).toUpperCase() : '??'}
              </div>
            )}
          </div>

          <p className="mt-3 text-lg font-bold md:text-xl opacity-90">
            أدمن الموقع
          </p>
        </div>

        {/* روابط التنقل */}
        <nav className="mt-4 flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                className={` text-lg flex items-center w-full gap-3 px-4 py-2 rounded-lg text-right transition-colors
                  ${
                    isActive
                      ? 'bg-white text-pink-700 font-bold'
                      : 'hover:bg-pink-600'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* تسجيل الخروج */}

        <div className="p-4 border-t border-pink-500">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-pink-600 w-full text-right"
          >
            <LogOut size={20} />
            <span className="text-lg">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {/* التوب بار في الموبايل */}
        <div className="md:hidden flex items-center flex-row justify-between p-4   rounded-md shadow ">
          {' '}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden  top-4 left-4 bg-pink-600 text-white p-2 rounded-lg shadow-lg"
          >
            <Menu size={24} />
          </button>
          <h1 className="font-bold text-pink-700 text-2xl md:text-lg">
            لوحة الأدمن
          </h1>
        </div>

        {/* محتوى الصفحات */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
