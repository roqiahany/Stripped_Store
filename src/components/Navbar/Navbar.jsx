import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import MenuLinks from './MenuLinks';
import Icons from './Icons';
import { useState } from 'react';
import AnnouncementBar from './AnnouncementBar';
import { motion, AnimatePresence } from 'framer-motion';
import UserIcon from './UserIcon';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const sidebarVariants = {
    hidden: { x: '100%' }, // بدل -100% عشان يطلع من اليمين
    visible: { x: 0 },
    exit: { x: '100%' },
  };

  return (
    <>
      <AnnouncementBar />

      <header className="sticky top-0 z-50 shadow-sm bg-white">
        <div className="flex items-center justify-between px-4 md:px-16 py-4 md:flex-row-reverse">
          {/* Hamburger - Mobile */}
          <button
            className="md:hidden z-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <MenuLinks variant="desktop" />
          </div>

          {/* Icons - Desktop only */}
          <div className="hidden md:flex">
            <Icons />
          </div>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Sidebar */}
              <motion.div
                className="md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 border-l" // بدل left-0 استخدم right-0 و border-l
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sidebarVariants}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {/* Close Button */}
                <button
                  className="absolute top-4 left-4" // بدل right-4 خلي الزر على الشمال
                  onClick={() => setIsOpen(false)}
                >
                  <X size={28} />
                </button>

                {/* Sidebar Content */}
                <div className="flex flex-col mt-20 p-5 gap-6">
                  <MenuLinks
                    variant="sidebar"
                    onLinkClick={() => setIsOpen(false)}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
