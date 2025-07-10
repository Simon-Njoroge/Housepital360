import { FaCalendarCheck, FaPills, FaFlask, FaAmbulance, FaStethoscope } from 'react-icons/fa';
import { Footer } from './footer'
import Header from './Header';

export default function OurServices() {
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
            Our <span className="text-blue-500">Services</span>
          </h1>
          <p className="text-lg text-white mt-4">
            Comprehensive healthcare services tailored to your needs.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50 dark:bg-zinc-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">What We Offer</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-10">
            Explore the wide range of healthcare services we provide to ensure your health and wellness.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-100 dark:bg-zinc-700 rounded-lg p-6 text-center">
              <FaCalendarCheck className="text-4xl text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold">Appointments</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Easy online booking with your preferred doctors.
              </p>
              <a
                href="#"
                className="text-blue-600 font-medium mt-3 block text-sm"
              >
                Book Now →
              </a>
            </div>
            <div className="bg-green-100 dark:bg-zinc-700 rounded-lg p-6 text-center">
              <FaPills className="text-4xl text-green-500 mb-4" />
              <h3 className="text-lg font-semibold">Pharmacy</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Order medications online with home delivery.
              </p>
              <a
                href="#"
                className="text-green-600 font-medium mt-3 block text-sm"
              >
                Order Now →
              </a>
            </div>
            <div className="bg-purple-100 dark:bg-zinc-700 rounded-lg p-6 text-center">
              <FaFlask className="text-4xl text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold">Lab Tests</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Quick diagnostic services and home sample collection.
              </p>
              <a
                href="#"
                className="text-purple-600 font-medium mt-3 block text-sm"
              >
                Schedule Test →
              </a>
            </div>
            <div className="bg-red-100 dark:bg-zinc-700 rounded-lg p-6 text-center">
              <FaAmbulance className="text-4xl text-red-500 mb-4" />
              <h3 className="text-lg font-semibold">Emergency Services</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                24/7 emergency care for critical situations.
              </p>
              <a
                href="#"
                className="text-red-600 font-medium mt-3 block text-sm"
              >
                Learn More →
              </a>
            </div>
            <div className="bg-yellow-100 dark:bg-zinc-700 rounded-lg p-6 text-center">
              <FaStethoscope className="text-4xl text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold">Health Checkups</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Regular health checkups to keep you fit and healthy.
              </p>
              <a
                href="#"
                className="text-yellow-600 font-medium mt-3 block text-sm"
              >
                Schedule Now →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}