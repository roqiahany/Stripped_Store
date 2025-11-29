<style>
  {`
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      animation: marquee 15s linear infinite;
    }
  `}
</style>;

const AnnouncementBar = () => {
  return (
    <div className="relative overflow-hidden bg-pink-600 text-white py-2 tracking-wide">
      <div className="flex whitespace-nowrap animate-marquee text-xs sm:text-sm md:text-base font-semibold uppercase">
        <span className="mr-8">
          ✨ Free Shipping on Orders Above 2000 LE ✨
        </span>
        <span className="mr-8">
          ✨ Free Shipping on Orders Above 2000 LE ✨
        </span>

        <span className="mr-8">
          ✨ Free Shipping on Orders Above 2000 LE ✨
        </span>
        <span className="mr-8">
          ✨ Free Shipping on Orders Above 2000 LE ✨
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
