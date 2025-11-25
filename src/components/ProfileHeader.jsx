import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ProfileHeader = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        backgroundColor: '#ffffff',
        color: 'text.primary',
        borderRadius: '12px',
        mb: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* سهم الرجوع */}
        <Tooltip title="العودة إلى لوحة التحكم">
          <IconButton
            edge="start"
            onClick={() => navigate('/admin')}
            sx={{
              bgcolor: '#fce4ec', // pink-100 تقريبًا
              color: '#d81b60', // pink-600
              '&:hover': { bgcolor: '#f8bbd0' }, // pink-200
              transition: '0.3s',
              ml: 1,
            }}
          >
            <ArrowRight sx={{ fontSize: 26 }} />
          </IconButton>
        </Tooltip>

        {/* عنوان الصفحة */}
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            color: '#ad1457', // pink-700
          }}
        >
          الملف الشخصي
        </Typography>

        {/* عنصر فارغ للموازنة */}
        <Box sx={{ width: 48 }} />
      </Toolbar>
    </AppBar>
  );
};

export default ProfileHeader;
