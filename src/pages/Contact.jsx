import { FaInstagram, FaFacebook, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/footer';

const Contact = () => {
  return (
    <> 
    <Navbar />
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-16" dir='ltr'>
      <div className="grid md:grid-cols-2 gap-12">
        {/* ===== Left: Contact Form ===== */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-left">Get in touch</h2>

          <form className="space-y-5">
            <div>
              <label className="block text-sm mb-1 text-left">Name</label>
              <input
              id="contact-name"
                type="text"
                placeholder="Name"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-left">Email *</label>
              <input
              id="contact-email"
                type="email"
                placeholder="Email"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-left">Phone number</label>
              <input
                  id="contact-phone"
                type="text"
                placeholder="Phone number"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-left">Comment</label>
              <textarea id="contact-comment"
                rows="4"
                placeholder="Comment"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
<div className='flex'> 
           <button
  type="button"
  onClick={() => {
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    const comment = document.getElementById('contact-comment').value;

    if (!name || !email || !comment) {
      alert('يرجى ملء الحقول المطلوبة (Name, Email, Comment)');
      return;
    }

    const message = `New Contact Form Message:%0A
Name: ${name}%0A
Email: ${email}%0A
Phone: ${phone}%0A
Comment: ${comment}`;

    // رقم الواتساب بصيغة دولية بدون +
    const whatsappNumber = '201117194095';

    // فتح واتساب ويب/موبايل
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  }}
  className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
>
  Send message
</button>

            </div>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-left">
            This site is protected by hCaptcha and the hCaptcha Privacy Policy
            and Terms of Service apply.
          </p>
        </div>

        {/* ===== Right: Contact Info ===== */}
        <div className="space-y-8" dir="ltr"> 
          <div className="text-left">
            <h3 className="text-xl font-semibold mb-3 text-left">WhatsApp</h3>
            <a
              href="https://wa.me/201117194095"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-pink-700 font-medium hover:underline text-left"
            >
              01117194095
            </a>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-left">Follow us</h3>

            <ul className="flex gap-6">
              <li>
                <a
                  href="https://www.instagram.com/stri.pped_eg?igsh=MWRucXB3YWZmbDNoZQ%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-700 hover:text-pink-500 transition"
                >
                  <FaInstagram size={28} />
                </a>
              </li>

              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61584095992479"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-700 hover:text-pink-500 transition"
                >
                  <FaFacebook size={28} />
                </a>
              </li>

              <li>
                <a
                  href="https://wa.me/201117194095"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-700 hover:text-pink-500 transition"
                >
                  <FaWhatsapp size={28} />
                </a>
              </li>

              <li>
                <a
                  href="https://www.tiktok.com/@stripped_eg?_r=1&_t=ZS-91hbYTaR1kO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-700 hover:text-pink-500 transition"
                >
                  <FaTiktok size={28} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Contact;
