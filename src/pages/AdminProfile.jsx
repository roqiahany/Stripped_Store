import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Stack,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import LockReset from '@mui/icons-material/LockReset';
import LockPerson from '@mui/icons-material/LockPerson';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Tooltip } from '@mui/material';

// ← دالة رفع الصورة اللي أنشأتها
import { auth } from '../firebaseConfig';
import { uploadToCloudinary } from './../utils/cloudinaryUpload';
import { toast } from 'react-hot-toast';
import Skeleton from '@mui/material/Skeleton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Icon } from '@iconify/react';
import ProfileHeader from './../components/ProfileHeader';

export default function AdminProfile() {
  const navigate = useNavigate();

  const user = auth.currentUser;

  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setProfileImage] = useState(user?.photoURL || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  ///////// img profile ///////
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      setUploading(true);
      // ✅ رفع الصورة إلى Cloudinary
      const uploadedURL = await uploadToCloudinary(file);

      // ✅ تحديث البروفايل في Firebase Auth
      await updateProfile(auth.currentUser, { photoURL: uploadedURL });

      // ✅ تحديث الصورة المعروضة في الصفحة فورًا
      setProfileImage(uploadedURL);

      toast.success('تم تحديث صورة البروفايل بنجاح');
    } catch (err) {
      console.error(err);
      toast.error(' فشل رفع الصورة، حاول مرة أخرى');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setLoading(true);

      let photoURL = profileImage;

      if (!selectedFile && !oldPassword && !newPassword && !confirmPassword) {
        toast.error('لا يوجد أي تعديل لحفظه');
        return;
      }

      // ✅ تحديث كلمة المرور (لو الحقول مش فاضية)
      if (oldPassword || newPassword || confirmPassword) {
        if (!oldPassword) {
          toast.error(' أدخل كلمة المرور الحالية');
          return;
        }
        if (!newPassword) {
          toast.error(' أدخل كلمة المرور الجديدة');
          return;
        }
        if (!confirmPassword) {
          toast.error(' أدخل تأكيد كلمة المرور الجديدة');
          return;
        }
        if (newPassword !== confirmPassword) {
          toast.error(' كلمة المرور الجديدة غير متطابقة');
          return;
        }

        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          oldPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);

        await updatePassword(auth.currentUser, newPassword);

        if (oldPassword && newPassword && confirmPassword) {
          toast.success('تم حفظ البيانات بنجاح');
        }

        // تصفير الحقول بعد النجاح
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      toast.error(' حدث خطأ أثناء حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxWidth="600px"
      mx="auto"
      mt={6}
      p={4}
      border="1px solid #f9a8d4" // وردي فاتح بدلاً من الرمادي
      borderRadius={3}
      boxShadow="0 4px 12px rgba(236,72,153,0.15)" // ظل وردي خفيف
      sx={{ backgroundColor: 'background.paper' }}
    >
      <ProfileHeader />

      {/* صورة البروفايل */}
      <Stack direction="column" alignItems="center" spacing={2} mb={4}>
        <Box position="relative" width={110} height={110}>
          {uploading ? (
            <Skeleton
              variant="circular"
              width={110}
              height={110}
              animation="wave"
              sx={{
                bgcolor: '#f9a8d4',
              }}
            />
          ) : (
            <Avatar
              src={profileImage}
              sx={{
                width: 110,
                height: 110,
                border: '3px solid #ec4899',
                boxShadow: '0 0 12px rgba(236,72,153,0.3)',
              }}
            />
          )}

          {/* أيقونة التغيير */}
          <IconButton
            component="label"
            color="primary"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              bgcolor: '#ffffff',
              border: '2px solid #f9a8d4',
              color: '#ec4899',
              boxShadow: '0 3px 6px rgba(236,72,153,0.25)',
              '&:hover': {
                bgcolor: '#fdf2f8',
                color: '#db2777',
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
              },
              width: 38,
              height: 38,
            }}
            disabled={uploading}
          >
            <Icon icon="mdi:camera-outline" fontSize={20} />
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
            />
          </IconButton>
        </Box>
      </Stack>

      {/* البريد الإلكتروني */}
      <TextField
        label="البريد الإلكتروني"
        fullWidth
        margin="normal"
        value={user?.email || ''}
        disabled
        inputProps={{
          dir: 'ltr',
          style: { textAlign: 'left' },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailOutlined sx={{ color: '#db2777' }} />
            </InputAdornment>
          ),
        }}
      />

      <Divider sx={{ my: 4, borderColor: '#f9a8d4' }} />

      {/* تغيير كلمة المرور */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: '#db2777',
          fontWeight: 'bold',
        }}
      >
        تغيير كلمة المرور
      </Typography>

      <Stack spacing={2}>
        <TextField
          type="password"
          label="كلمة المرور الحالية"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          inputProps={{
            dir: 'rtl',
            style: { textAlign: 'right' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined sx={{ color: '#ec4899' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          type="password"
          label="كلمة المرور الجديدة"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          inputProps={{
            dir: 'rtl',
            style: { textAlign: 'right' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockReset sx={{ color: '#ec4899' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          type="password"
          label="تأكيد كلمة المرور الجديدة"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          inputProps={{
            dir: 'rtl',
            style: { textAlign: 'right' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockPerson sx={{ color: '#ec4899' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSaveAll}
        disabled={loading}
        sx={{
          mt: 4,
          py: 1.5,
          fontSize: '16px',
          fontWeight: 'bold',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(236,72,153,0.3)',
          '&:hover': {
            bgcolor: '#db2777',
            boxShadow: '0 6px 14px rgba(219,39,119,0.35)',
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: '#fff' }} />
        ) : (
          'حفظ كلمة المرور الجديدة'
        )}
      </Button>
    </Box>
  );
}
