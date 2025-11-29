import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { auth, db } from './../../firebaseConfig';
import { Skeleton } from '@mui/material';
import { useCart } from '../../context/CartContext';
import { UserRound } from 'lucide-react';

export default function UserIcon() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const navigate = useNavigate();
  const { resetCart } = useCart();

  const ADMIN_EMAIL = 'strippedstore42@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        let role = 'user';
        if (currentUser.email === ADMIN_EMAIL) {
          role = 'admin';
        } else if (userSnap.exists() && userSnap.data().role) {
          role = userSnap.data().role;
        }

        if (!userSnap.exists()) {
          await setDoc(
            userRef,
            {
              role,
              email: currentUser.email,
              fullName: currentUser.displayName || '',
            },
            { merge: true }
          );
        }

        setUser({
          id: currentUser.uid,
          email: currentUser.email,
          fullName: currentUser.displayName || '',
          profileImage: currentUser.photoURL || null,
          role,
        });
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    resetCart();
    setUser(null);
    setMenuOpen(false);
    localStorage.removeItem('cart');
    localStorage.removeItem('emailForSignIn');
  };

  if (loadingAuth) {
    return (
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <Skeleton variant="circular" width={40} height={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative group">
        <button
          onClick={() => navigate('/login')}
          className="w-11 h-11 flex items-center justify-center rounded-full border border-pink-600 text-pink-600
                    hover:text-white transition-all duration-200 shadow-sm"
        >
          <UserRound
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-700"
            strokeWidth={1.2}
          />
        </button>

        {/* Tooltip */}
        <span className="absolute left-1/2 -translate-x-1/2 mt-2 text-xs bg-black text-white py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">
          Login
        </span>
      </div>
    );
  }

  const menuItems =
    user.role === 'admin'
      ? [
          {
            label: 'Admin Dashboard',
            onClick: () => {
              navigate('/admin');
              setMenuOpen(false);
            },
          },
          { label: 'Logout', onClick: handleLogout, red: true },
        ]
      : [
          {
            label: 'My Cart',
            onClick: () => {
              navigate('/cart');
              setMenuOpen(false);
            },
          },
          { label: 'Logout', onClick: handleLogout, red: true },
        ];

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2"
      >
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.fullName}
            className="w-10 h-10 rounded-full border-2 border-pink-600 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold border-2 border-pink-400">
            {user.fullName
              ? user.fullName.slice(0, 2).toUpperCase()
              : user.email.slice(0, 2).toUpperCase()}
          </div>
        )}
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-44 z-50 border border-gray-100">
          <ul className="text-gray-700 text-sm">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`px-4 py-2 hover:bg-pink-50 cursor-pointer ${
                  item.red ? 'text-pink-700 flex items-center gap-2' : ''
                }`}
                onClick={item.onClick}
              >
                {item.red && <LogOut className="w-4 h-4" />}
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
