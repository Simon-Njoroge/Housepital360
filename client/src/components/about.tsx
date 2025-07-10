import { FaHospitalSymbol, FaHeartbeat, FaUserMd, FaHandsHelping } from 'react-icons/fa';
import { Footer } from './footer'
import Header from './Header'
export default function AboutUs() {
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
            About <span className="text-blue-500">Housepital360</span>
          </h1>
          <p className="text-lg text-white mt-4">
            Your trusted partner in healthcare excellence.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50 dark:bg-zinc-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-10">
            At Housepital360, we aim to provide accessible, affordable, and high-quality healthcare services to everyone. 
            Our team of dedicated professionals is committed to ensuring your health and wellness through innovative solutions and compassionate care.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-100 dark:bg-zinc-700 rounded-lg p-6 text-center">
              <FaHeartbeat className="text-4xl text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold">Patient-Centered Care</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                We prioritize your needs and ensure personalized healthcare solutions.
              </p>
            </div>
            <div className="bg-green-100 dark:bg-zinc-700 rounded-lg p-6 text-center">
              <FaUserMd className="text-4xl text-green-500 mb-4" />
              <h3 className="text-lg font-semibold">Expert Team</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Our team of experienced doctors and specialists is here to provide the best care.
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-zinc-700 rounded-lg p-6 text-center">
              <FaHandsHelping className="text-4xl text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold">Community Support</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                We believe in giving back to the community and supporting health initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-10">
            Our dedicated team of healthcare professionals is here to serve you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Dr. Linda Kimani', role: 'Cardiologist', image: 'https://via.placeholder.com/150' },
              { name: 'Dr. Alex Mwangi', role: 'Neurologist', image: 'https://via.placeholder.com/150' },
              { name: 'Dr. Zainab Yusuf', role: 'Pediatrician', image: 'https://via.placeholder.com/150' },
              { name: 'Dr. Joseph Otieno', role: 'Surgeon', image: 'https://via.placeholder.com/150' },
            ].map((member, i) => (
              <div key={i} className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg shadow-md text-center">
                <img src={member.image} alt={member.name} className="rounded-full mx-auto mb-4 w-24 h-24" />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    <Footer/>
    </main>
  );
}