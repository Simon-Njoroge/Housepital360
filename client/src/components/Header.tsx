import {
  FaHospitalSymbol,
  FaMoon,
  FaSun,
  FaHome,
  FaInfoCircle,
  FaConciergeBell,
  FaEnvelope,
} from 'react-icons/fa';
import { IoMenu, IoClose } from 'react-icons/io5';
import { useTheme } from '@/utils/themeProvider';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LoginSheet from '@/auth/login';
import SignInSheet from '@/auth/signin';
import { Link } from '@tanstack/react-router';
const navLinks = [
  { name: 'Home', icon: <FaHome />, path: '/' },
  { name: 'About', icon: <FaInfoCircle />, path: '/about-us' },
  { name: 'Services', icon: <FaConciergeBell />, path: '/our-services' },
  { name: 'Contact', icon: <FaEnvelope />, path: '/contact-us' },
];

export default function Header() {
  const [active, setActive] = useState('Home');
  const [menuOpen, setMenuOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 shadow-sm w-full px-4 md:px-8 py-2 font-inter border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <FaHospitalSymbol className="text-blue-700 dark:text-blue-400 text-xl" />
          <span className="text-lg font-semibold text-zinc-800 dark:text-white">
            Housepital360
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setActive(link.name)}
              className={`relative flex items-center gap-1 text-sm font-medium transition ${
                active === link.name
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.name}
              {active === link.name && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-[3px] bg-pink-500 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="text-lg text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            aria-label="Toggle Theme"
          >
            {mounted && (theme === 'dark' ? <FaSun /> : <FaMoon />)}
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <button className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition">
                Register
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md z-[9999]">
              <SignInSheet />
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition">
                Login
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md z-[9999]">
              <LoginSheet />
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <IoClose className="text-xl text-zinc-800 dark:text-white" />
            ) : (
              <IoMenu className="text-xl text-zinc-800 dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-zinc-900 shadow-md dark:shadow-lg flex flex-col space-y-4 px-4 py-4 z-50">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => {
                setActive(link.name);
                setMenuOpen(false);
              }}
              className={`flex items-center gap-2 text-sm font-medium transition ${
                active === link.name
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <span>{link.icon}</span> {link.name}
            </Link>
          ))}

          <div className="flex flex-col space-y-2 pt-2">
            <button
              onClick={toggleTheme}
              className="text-sm text-left text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {mounted && (theme === 'dark' ? '☀ Light Mode' : '🌙 Dark Mode')}
            </button>

            {/* Register */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition">
                  Register
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md z-[9999]">
                <SignInSheet />
              </SheetContent>
            </Sheet>

            {/* Login */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition w-full text-left">
                  Login
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md z-[9999]">
                <LoginSheet />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}
    </header>
  );
}