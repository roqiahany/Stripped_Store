import LogoImg from '../../assets/Stripped_Logo.png';

const Logo = () => (
  <a href="/" className="flex items-center">
    <img
      src={LogoImg}
      alt="Store Logo"
      className="w-16 h-auto md:w-20 lg:w-24"
    />
    {/*  className="w-32 h-auto md:w-40 lg:w-48"  */}
    {/* className="max-w-[150px] w-full h-auto sm:max-w-[180px] md:max-w-[200px] lg:max-w-[240px] */}
  </a>
);

export default Logo;
