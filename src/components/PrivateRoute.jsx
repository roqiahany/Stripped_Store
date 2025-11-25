// src/components/PrivateRoute.jsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { auth } from '../firebaseConfig';

export default function PrivateRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // حالة التحميل
  if (user === undefined) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255,255,255,0.5)',
          // اختياري: خلفية شفافة خفيفة
        }}
      >
        <Box
          sx={{
            width: { xs: '40%', sm: '40%', md: '25%' },
          }}
        >
          <LinearProgress
            sx={{
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#db2777', // كود لون pink-700 من Tailwind
              },
              backgroundColor: '#fce7f3', // لون الخلفية الفاتح لو حبيتي
              borderRadius: 2,
            }}
          />
        </Box>
      </Box>
    );
  }

  // لو مفيش مستخدم => يروح لتسجيل الدخول
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // لو في مستخدم => اعرض الصفحة المطلوبة
  return children;
}
