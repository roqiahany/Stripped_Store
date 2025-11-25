import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-hot-toast';
import { auth } from '../firebaseConfig';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Icon } from '@iconify/react';

export default function AdminLogin() {
  // const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // 🛡️ UID الخاص بحساب الأدمن من Firebase Authentication
  const ADMIN_UID = 'qssBrDBIQbZuIk1badgDza4a9EC2';

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validate = () => {
    if (!email) {
      toast.error('من فضلك أدخل البريد الإلكتروني');
      return false;
    }
    if (!validateEmail(email)) {
      toast.error('البريد الإلكتروني غير صحيح');
      return false;
    }
    if (!password) {
      toast.error('من فضلك أدخل كلمة المرور');
      return false;
    }
    return true;
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   if (!validate()) return;

  //   setLoading(true);
  //   try {
  //     const userCred = await signInWithEmailAndPassword(auth, email, password);
  //     const user = userCred.user;

  //     if (user.uid !== ADMIN_UID) {
  //       toast.error('ليس لديك صلاحية الدخول');
  //       return;
  //     }

  //     toast.success('تم تسجيل الدخول بنجاح');
  //     navigate('/admin');
  //   } catch (error) {
  //     toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // 🛡️ تحقق من UID الأدمن أولاً
      if (user.uid === ADMIN_UID) {
        toast.success('تم تسجيل الدخول كأدمن');
        navigate('/admin'); // أو /dashboard حسب نظامك
        return;
      }

      // ✅ تحقق من دور المستخدم العادي
      const userDoc = await firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .get();
      if (!userDoc.exists) {
        toast.error('المستخدم غير موجود');
        setLoading(false);
        return;
      }

      const role = userDoc.data().role;
      if (role === 'admin') {
        navigate('/dashboard'); // أدمن من Firestore
      } else {
        navigate('/shop'); // مستخدم عادي
      }

      toast.success('تم تسجيل الدخول بنجاح');
    } catch (error) {
      toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          px: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            bgcolor: 'background.paper',
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            boxShadow: 3,
            width: '100%',
            maxWidth: 420,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            color="secondary.main"
            sx={{
              fontWeight: '',
              fontSize: { xs: '1.8rem', md: '2rem' },
              mb: 1,
            }}
          >
            Tarhty Store
          </Typography>
          <Typography
            variant="h6"
            textAlign="end"
            color="secondary.main"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.8rem', md: '2rem' },
              mb: 1,
            }}
          >
            Sign in
          </Typography>

          {/* البريد */}
          <TextField
            fullWidth
            label="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            inputProps={{
              dir: 'rtl',
              style: { textAlign: 'right', fontSize: '1rem' },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon
                    icon="mdi:email-outline"
                    fontSize={24}
                    color="#be185d"
                  />
                </InputAdornment>
              ),
            }}
          />

          {/* كلمة المرور */}
          <TextField
            type={showPassword ? 'text' : 'password'}
            label="كلمة المرور"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            inputProps={{
              dir: 'rtl',
              style: { textAlign: 'right', fontSize: '1rem' },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    <Icon
                      icon={
                        showPassword
                          ? 'solar:eye-bold'
                          : 'solar:eye-closed-bold'
                      }
                      fontSize={22}
                      color="#db2777"
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* زر الدخول */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: 'primary.main',
              py: { xs: 1.5, md: 2 },
              fontWeight: 'bold',
              fontSize: { xs: '1rem', md: '1.1rem' },
              borderRadius: 3,
              boxShadow: '0 4px 10px rgba(236,72,153,0.3)',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </Button>
        </Box>
      </Box>
    </>
  );
}
