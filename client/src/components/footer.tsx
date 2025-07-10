import { Button } from "@/components/ui/button";
import { FaCalendarCheck, FaPills, FaFlask, FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { useTheme } from "@/utils/themeProvider";

function Footer() {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Branding */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Housepital360</h3>
          <p className="text-sm">
            Your trusted partner for comprehensive, accessible, and AI-powered healthcare services.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold mb-3 uppercase">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Appointments</a></li>
            <li><a href="#" className="hover:underline">Pharmacy</a></li>
            <li><a href="#" className="hover:underline">AI Assistant</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-semibold mb-3 uppercase">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-600" /> Nairobi, Kenya
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-blue-600" /> support@housepital360.com
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-blue-600" /> +254 712 345678
            </li>
          </ul>
        </div>

        {/* Social & Newsletter */}
        <div>
          <h4 className="text-sm font-semibold mb-3 uppercase">Stay Connected</h4>
          <div className="flex items-center space-x-4 mb-4">
            <a href="#" aria-label="Facebook" className="hover:text-blue-500">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-500">
              <FaInstagram />
            </a>
          </div>
          <p className="text-xs mb-2">Subscribe to our newsletter</p>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              className="px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 text-sm"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">Subscribe</Button>
          </form>
        </div>
      </div>
      <div className="border-t mt-8 pt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
        © 2025 Housepital360. All rights reserved.
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const { theme } = useTheme();

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-inter">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-10 max-w-7xl mx-auto px-6 py-20">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Your Health, <span className="text-blue-600">Our Priority</span>
          </h1>
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-300">
            Experience comprehensive healthcare services with Housepital360. From appointments to pharmacy services,
            we’re here for your complete wellness journey.
          </p>
          <div className="flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">📅 Book Appointment</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>

        <div className="flex-1 relative">
          <img
            src="https://img.freepik.com/free-photo/doctor-team-walking-modern-hospital-corridor-medical-healthcare_1421-1901.jpg"
            alt="Doctors in corridor"
            className="rounded-lg shadow-lg w-full"
          />
          <div className="absolute bottom-4 left-4 bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-md flex items-center space-x-3">
            <span className="text-green-500 text-xl">🟢</span>
            <div>
              <p className="text-sm font-medium">24/7 Available</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Expert Care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-gray-50 dark:bg-zinc-800 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Healthcare Services</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-10">
            Comprehensive care designed around your needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-100 dark:bg-zinc-700 rounded-lg p-6 text-left">
              <FaCalendarCheck className="text-2xl mb-3 text-blue-500" />
              <h3 className="text-lg font-semibold">Appointments</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Easy online booking with your preferred doctors.
              </p>
              <a href="#" className="text-blue-600 font-medium mt-3 block text-sm">
                Book Now →
              </a>
            </div>

            <div className="bg-green-100 dark:bg-zinc-700 rounded-lg p-6 text-left">
              <FaPills className="text-2xl mb-3 text-green-500" />
              <h3 className="text-lg font-semibold">Pharmacy</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Order medications online with home delivery.
              </p>
              <a href="#" className="text-green-600 font-medium mt-3 block text-sm">
                Order Now →
              </a>
            </div>

            <div className="bg-purple-100 dark:bg-zinc-700 rounded-lg p-6 text-left">
              <FaFlask className="text-2xl mb-3 text-purple-500" />
              <h3 className="text-lg font-semibold">Lab Tests</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Quick diagnostic services and home sample collection.
              </p>
              <a href="#" className="text-purple-600 font-medium mt-3 block text-sm">
                Schedule Test →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant */}
      <section className="bg-white dark:bg-zinc-900 py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-10 items-center">
          <img
            src="https://img.freepik.com/premium-photo/doctor-futuristic-interface-virtual-screen-hologram-hospital-technology-concept_488220-42009.jpg"
            alt="AI Assistant"
            className="rounded-lg shadow-lg w-full md:w-1/2"
          />
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">AI-Powered Health Guidance</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Get instant health insights and personalized recommendations with our advanced AI assistant. Available
              24/7 to help you make informed health decisions.
            </p>
            <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1 pl-4 list-disc">
              <li>Symptom assessment and guidance</li>
              <li>Medication reminders and tracking</li>
              <li>Health tips and wellness plans</li>
            </ul>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">🤖 Try AI Assistant</Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export { Footer };
