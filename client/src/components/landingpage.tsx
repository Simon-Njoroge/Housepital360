import { Button } from '@/components/ui/button'
import {
  FaCalendarCheck,
  FaPills,
  FaFlask,
  FaRobot,
  FaUserMd,
  FaStar,
} from 'react-icons/fa'
import { useTheme } from '@/utils/themeProvider'
import { Footer } from './footer'
import Header from './Header'
export default function LandingPage() {
  const { theme } = useTheme()

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-inter">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center"
        style={{
          backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hospital-de-Bellvitge.jpg/640px-Hospital-de-Bellvitge.jpg')`,
        }}
      >
        {/* Dark/light overlay */}
        <div className="absolute inset-0 bg-white/70 dark:bg-zinc-900/80"></div>
        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 max-w-7xl mx-auto px-6 w-full">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Your Health, <span className="text-blue-600">Our Priority</span>
            </h1>
            <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-300">
              Experience comprehensive healthcare services with Housepital360.
              From appointments to pharmacy services, we’re here for your
              complete wellness journey.
            </p>
            <div className="flex gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                📅 Book Appointment
              </Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>

          <div className="flex-1 relative">
            <img
              src="https://web-assets.bcg.com/71/52/147fa0a94684b7568266ecaa4763/ooking-ahead-the-outlook-for-australias-private-hospitals.jpg"
              alt="Doctors in corridor"
              className="rounded-lg shadow-lg w-full"
            />
            <div className="absolute bottom-4 left-4 bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-md flex items-center space-x-3">
              <span className="text-green-500 text-xl">🟢</span>
              <div>
                <p className="text-sm font-medium">24/7 Available</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Expert Care
                </p>
              </div>
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
              <a
                href="#"
                className="text-blue-600 font-medium mt-3 block text-sm"
              >
                Book Now →
              </a>
            </div>

            <div className="bg-green-100 dark:bg-zinc-700 rounded-lg p-6 text-left">
              <FaPills className="text-2xl mb-3 text-green-500" />
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

            <div className="bg-purple-100 dark:bg-zinc-700 rounded-lg p-6 text-left">
              <FaFlask className="text-2xl mb-3 text-purple-500" />
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
          </div>
        </div>
      </section>

      {/* Available Doctors */}
      <section className="bg-white dark:bg-zinc-900 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Available Doctors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              'Dr. Linda Kimani',
              'Dr. Alex Mwangi',
              'Dr. Zainab Yusuf',
              'Dr. Joseph Otieno',
            ].map((doc, i) => (
              <div
                key={i}
                className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg shadow-md text-center"
              >
                <FaUserMd className="text-4xl mx-auto mb-2 text-blue-600" />
                <p className="font-semibold text-sm md:text-base">{doc}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Specialist
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 dark:bg-zinc-800 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">What People Say About Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-zinc-700 p-6 rounded-lg shadow-md text-left"
              >
                <p className="text-sm italic">
                  "The doctors are very professional and caring. I got my
                  results quickly and everything was seamless."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-300 dark:bg-blue-700"></div>
                  <div>
                    <p className="text-sm font-semibold">Jane Doe</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, idx) => (
                        <FaStar key={idx} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="bg-gray-50 dark:bg-zinc-800 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Our Global Health Partners
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-10">
            We proudly collaborate with world-renowned organizations to bring
            you the highest quality care and innovation.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
            <div className="flex flex-col items-center space-y-3">
              <img
                src="https://www.jnjmedtech.com/sites/default/files/styles/crop_presets/public/news_image/hero_image/2024-04/JJ_Logo_Stacked_Red_RGB.png?itok=35bo67Sz"
                alt="Johnson & Johnson"
                className="h-12 object-contain"
              />
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                Johnson & Johnson
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/57/Pfizer_%282021%29.svg"
                alt="Pfizer"
                className="h-10 object-contain"
              />
              <p className="text-sm text-zinc-700 dark:text-zinc-300">Pfizer</p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <img
                src="https://www.unwater.org/sites/default/files/2022-08/220x120_members_who.png"
                alt="World Health Organization"
                className="h-12 object-contain"
              />
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                World Health Organization
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/M%C3%A9decins_Sans_Fronti%C3%A8res_%28logo%29.svg/1200px-M%C3%A9decins_Sans_Fronti%C3%A8res_%28logo%29.svg.png"
                alt="Doctors Without Borders"
                className="h-10 object-contain"
              />
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                Médecins Sans Frontières
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant */}
      <section className="bg-white dark:bg-zinc-900 py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-10 items-center">
          <img
            src="https://www.journee-mondiale.com/en/wp-content/uploads/2025/05/2025-05-18-12-05-19_.webp"
            alt="AI Assistant"
            className="rounded-lg shadow-lg w-full md:w-1/2"
          />
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              AI-Powered Health Guidance
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Get instant health insights and personalized recommendations with
              our advanced AI assistant. Available 24/7 to help you make
              informed health decisions.
            </p>
            <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1 pl-4 list-disc">
              <li>Symptom assessment and guidance</li>
              <li>Medication reminders and tracking</li>
              <li>Health tips and wellness plans</li>
            </ul>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              🤖 Try AI Assistant
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section>
        <Footer />
      </section>

      {/* Sticky AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          title="Ask AI Assistant"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition"
        >
          <FaRobot className="text-2xl" />
        </button>
      </div>
    </main>
  )
}
