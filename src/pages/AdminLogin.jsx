import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { auth, db } from '../firebaseConfig';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Icon } from '@iconify/react';
import { useUser } from '../context/UserContext';

export default function LoginSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // لتبديل بين تسجيل الدخول / تسجيل حساب
  const navigate = useNavigate();
  const { setUser } = useUser();
  const ADMIN_EMAIL = 'strippedstore42@gmail.com';

  const validateEmail = (email) =>
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error('البريد الإلكتروني غير صحيح');
      return;
    }

    setLoading(true);
    try {
      let user;
      let role = 'user';

      if (isSignup) {
        // تسجيل حساب جديد
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        user = userCred.user;

        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role,
          cart: [],
        });

        setUser({
          id: user.uid,
          email: user.email,
          fullName: user.displayName,
          profileImage: user.photoURL,
          role,
        });

        toast.success('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        navigate('/');
      } else {
        // تسجيل الدخول
        const userCred = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        user = userCred.user;

        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) role = 'admin';

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, { email: user.email, role, cart: [] });
        } else if (role === 'admin') {
          await setDoc(userDocRef, { role }, { merge: true });
        }

        setUser({
          id: user.uid,
          email: user.email,
          fullName: user.displayName,
          profileImage: user.photoURL,
          role,
        });

        localStorage.setItem('userRole', role);

        toast.success(
          role === 'admin'
            ? 'تم تسجيل الدخول بنجاح كأدمن! يمكنك الآن إدارة المتجر.'
            : 'تم تسجيل الدخول بنجاح! استمتع بتجربتك.'
        );

        role === 'admin' ? navigate('/admin') : navigate('/');
      }
    } catch (err) {
      console.error(err);

      // هنا نوضح الخطأ للمستخدم بطريقة مفهومة
      let message = '';
      switch (err.code) {
        case 'auth/invalid-email':
          message = 'البريد الإلكتروني غير صحيح، حاول مرة أخرى.';
          break;
        case 'auth/user-not-found':
          message = 'البريد الإلكتروني غير موجود، حاول إنشاء حساب جديد.';
          break;
        case 'auth/wrong-password':
          message = 'كلمة المرور خاطئة، حاول مرة أخرى.';
          break;
        case 'auth/invalid-credential':
          message = 'هناك مشكلة في بيانات الدخول، تحقق منها.';
          break;
        default:
          message = 'حدث خطأ ما، يرجى المحاولة لاحقاً.';
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: { xs: 2, sm: 3, md: 5 }, // padding أفقي responsive
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          bgcolor: 'background.paper',
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: 3,
          boxShadow: 3,
          width: '100%',
          maxWidth: { xs: 350, sm: 420, md: 480 }, // responsive maxWidth
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          color="secondary.main"
          sx={{ fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' } }} // responsive fontSize
        >
          Stripped Store
        </Typography>

        <TextField
          fullWidth
          label="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon
                  icon="mdi:email-outline"
                  fontSize={22} // يمكنك تعديل حجم الأيقونة حسب الحاجة
                  color="var(--gold-500)"
                />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          type={showPassword ? 'text' : 'password'}
          label="كلمة المرور"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  <Icon
                    icon={
                      showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                    }
                    fontSize={22}
                    color="var(--gold-500)"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            py: { xs: 1.5, sm: 2 },
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          {loading
            ? 'جاري المعالجة...'
            : isSignup
            ? 'تسجيل حساب'
            : 'تسجيل الدخول'}
        </Button>

        <Button
          type="button"
          variant="text"
          onClick={() => setIsSignup(!isSignup)}
          sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
        >
          {isSignup ? 'لديك حساب؟ سجل الدخول' : 'إنشاء حساب جديد'}
        </Button>
      </Box>
    </Box>
  );
}
