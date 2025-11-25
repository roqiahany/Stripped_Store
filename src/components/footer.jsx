import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-100 via-white to-pink-100 text-gray-700 mt-10">
      {/* القسم العلوي */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-center items-center border-b border-gray-300 pb-6">
          {/* الاسم أو اللوجو */}

          {/* أيقونات السوشيال */}
          <ul className="flex gap-6">
            <li>
              <a
                href="https://www.instagram.com/stri.pped_eg?igsh=MWRucXB3YWZmbDNoZQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-700 hover:text-pink-500 transition-colors duration-300"
              >
                <FaInstagram size={28} />
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/profile.php?id=61584095992479"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-700 hover:text-pink-500 transition-colors duration-300"
              >
                <FaFacebook size={28} />
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@stripped_eg?_r=1&_t=ZS-91hbYTaR1kO"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-700 hover:text-pink-500 transition-colors duration-300"
              >
                <FaTiktok size={28} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* القسم السفلي */}
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-600">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* حقوق النشر */}
          <div className="text-center md:text-left">
            <small>
              © 2025,{' '}
              <a href="/" className="text-pink-700 hover:underline">
                Stripped Store
              </a>
            </small>
            <span className="mx-2 text-gray-400">|</span>
            <small>
              <a
                href="https://www.facebook.com/roqia.hani.2025"
                target="_blank"
                rel="nofollow"
                className="hover:underline"
              >
                Powered by Eng:Roqia Hany
              </a>
            </small>
          </div>

          {/* روابط السياسات */}
          <ul className="flex flex-wrap justify-center md:justify-end gap-4">
            <li>
              <a
                href="/policies/privacy-policy"
                className="hover:text-pink-600 transition-colors"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/policies/refund-policy"
                className="hover:text-pink-600 transition-colors"
              >
                Refund Policy
              </a>
            </li>
            <li>
              <a
                href="/policies/terms-of-service"
                className="hover:text-pink-600 transition-colors"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="/policies/contact-information"
                className="hover:text-pink-600 transition-colors"
              >
                Contact Information
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
