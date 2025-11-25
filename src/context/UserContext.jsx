import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // معلومات المستخدم
  const [loading, setLoading] = useState(true); // لتأخير الظهور (Skeleton)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const ADMIN_EMAIL = 'strippedstore42@gmail.com';
        let role = currentUser.email === ADMIN_EMAIL ? 'admin' : 'user';

        // جلب بيانات إضافية من Firestore لو مستخدم عادي
        if (role === 'user') {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            role = userDoc.data().role || 'user';
          }
        }

        setUser({
          id: currentUser.uid,
          email: currentUser.email,
          fullName: currentUser.displayName,
          profileImage: currentUser.photoURL,
          role,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
