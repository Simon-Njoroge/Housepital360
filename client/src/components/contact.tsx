import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Footer } from './footer'
import Header from './Header'
export default function ContactUs() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-inter">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center" 
        style={{
          backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hospital-de-Bellvitge.jpg/640px-Hospital-de-Bellvitge.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Contact <span className="text-blue-500">Us</span>
          </h1>
          <p className="text-lg text-white mt-4">
            We're here to assist you with all your healthcare needs.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50 dark:bg-zinc-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-10">
            Reach out to us for inquiries, appointments, or support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-100 dark:bg-zinc-700 rounded-lg p-6 text-center">
              <FaPhoneAlt className="text-4xl text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold">Phone</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Call us at: <br />
                <span className="font-medium">+1 234 567 890</span>
              </p>
            </div>
            <div className="bg-green-100 dark:bg-zinc-700 rounded-lg p-6 text-center">
              <FaEnvelope className="text-4xl text-green-500 mb-4" />
              <h3 className="text-lg font-semibold">Email</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Email us at: <br />
                <span className="font-medium">support@housepital360.com</span>
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-zinc-700 rounded-lg p-6 text-center">
              <FaMapMarkerAlt className="text-4xl text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold">Address</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Visit us at: <br />
                <span className="font-medium">123 Health St, Wellness City</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-center">Send Us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition w-full md:w-auto"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
     <Footer/>
    </main>
  );
}