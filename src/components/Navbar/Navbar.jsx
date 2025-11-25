import { Menu } from 'lucide-react';
import Logo from './Logo';
import MenuLinks from './MenuLinks';
import Icons from './Icons';
import { useState } from 'react';
import AnnouncementBar from './AnnouncementBar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnnouncementBar />

      <header className="sticky top-0 z-50 shadow-sm bg-white">
        <div className="flex items-center justify-between px-4 md:px-16 py-4 flex-row-reverse">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <MenuLinks />

          {/* Icons */}
          <Icons />
        </div>
      </header>
    </>
  );
};

export default Navbar;
