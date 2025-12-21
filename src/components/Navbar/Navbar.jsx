import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import MenuLinks from './MenuLinks';
import Icons from './Icons';
import { useState } from 'react';
import AnnouncementBar from './AnnouncementBar';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0 },
    exit: { x: '-100%' },
  };

  return (
    <>
      <AnnouncementBar />

      <header className="sticky top-0 z-50 shadow-sm bg-white">
        <div
          className="flex items-center justify-between px-4 md:px-16 py-4"
          dir="ltr"
        >
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
            <MenuLinks />
          </div>

          {/* Icons */}
          <Icons />
        </div>

        {/* Mobile Menu with animation */}
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
                transition={{ duration: 0.3 }}
              />

              {/* Sidebar */}
              <motion.div
                className="md:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 border-r flex flex-col"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sidebarVariants}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {/* Close button inside sidebar */}
                <button
                  className="absolute top-4 right-4 z-50"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={28} />
                </button>

                <div className="flex flex-col gap-6 mt-20 p-5 text-left">
                  {[
                    { name: 'Home', path: '/' },
                    { name: 'Our Products', path: '/all-products' },
                    { name: 'Contact Us', path: '/contact' },
                  ].map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="relative text-gray-700 font-medium transition-colors duration-300 hover:text-pink-700 group"
                    >
                      {link.name}
                      {/* خط التحريك تحت النص */}
                      <span className="absolute left-0 -bottom-1 h-0.5 bg-pink-700 w-0 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  ))}
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
