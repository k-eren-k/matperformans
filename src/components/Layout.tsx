import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, School, ChevronDown, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Function to close all dropdowns and the mobile menu
  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsAboutDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };


  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({ email: user.email!, id: user.id! });
      } else {
        setUser(null);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser({ email: session.user.email!, id: session.user.id });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


    // Improved click-outside handling, correctly handling both dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check for clicks outside the "Hakkımızda" dropdown
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsAboutDropdownOpen(false);
            }

            // Check for clicks outside the user dropdown AND its button
            if (isUserDropdownOpen &&
                event.target instanceof Node &&
                !event.target.closest('.user-dropdown-container') // Assuming a container class
               ) {
                setIsUserDropdownOpen(false);
            }

              //Close mobile menu if click is out side the nav
             if(isMenuOpen && event.target instanceof Node && !event.target.closest('nav'))
            {
                setIsMenuOpen(false)
            }
        };


        document.addEventListener('mousedown', handleClickOutside);


        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAboutDropdownOpen, isUserDropdownOpen, isMenuOpen]); // Correct dependencies



  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      setUser(null);
      closeAllMenus(); // Close menus on logout
      navigate("/");
    }
  };

  const generateAvatar = (email: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    const initial = email.charAt(0).toUpperCase();
    const hash = email.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const color = colors[hash % colors.length];

    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
        <span className="text-white font-semibold">{initial}</span>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2" onClick={closeAllMenus}>
                <School className="h-7 w-7 text-blue-600" />
                <span className="font-semibold text-xl text-gray-900 tracking-wider">
                  MKÇPAL
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/"
                className={`text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors duration-200 ${location.pathname === '/' ? 'text-blue-600 bg-blue-50 font-semibold' : ''
                  }`}
                onClick={closeAllMenus}
              >
                Ana Sayfa
              </Link>

              {/* Hakkımızda Dropdown */}
              <div className="relative inline-block text-left" ref={dropdownRef}>
                <button
                  type="button"
                  className={`inline-flex justify-center items-center w-full rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none ${isAboutDropdownOpen ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                    }`}
                  id="options-menu"
                  aria-expanded={isAboutDropdownOpen}
                  aria-haspopup="true"
                  onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}

                >
                  Hakkımızda
                  <ChevronDown className={`ml-1 h-5 w-5 transition-transform ${isAboutDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {isAboutDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <div className="py-1" role="none">
                      <Link to="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={closeAllMenus}>Genel Bakış</Link>
                      <Link to="/teachers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={closeAllMenus}>Öğretmenler</Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/contact"
                className={`text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors duration-200 ${location.pathname === '/contact' ? 'text-blue-600 bg-blue-50 font-semibold' : ''
                  }`}
                onClick={closeAllMenus}
              >
                İletişim
              </Link>

              {/* User Dropdown and Login/Register - Wrapped in a container for click-outside */}
              {user ? (
                <div className="relative inline-block text-left user-dropdown-container">
                  <button
                    type="button"
                    className="inline-flex justify-center items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  >
                    {generateAvatar(user.email)}
                    <span className='hidden sm:inline'>{user.email}</span>
                    <ChevronDown className={`ml-1 h-5 w-5 transition-transform ${isUserDropdownOpen ? "rotate-180" : ""}`} />

                  </button>
                  {isUserDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu">
                      <div className="py-1" role="none">
                        <Link to="/whiteboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={closeAllMenus}>Beyaz Tahta</Link>
                        <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem">
                          <LogOut className="h-4 w-4 mr-2 inline-block" /> Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2"
                    onClick={closeAllMenus}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Giriş</span>
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                    onClick={closeAllMenus}
                  >
                    <User className="h-4 w-4" />
                    <span>Kayıt</span>
                  </Link>
                </>
              )}
            </div>

            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={closeAllMenus}
              >
                Ana Sayfa
              </Link>

              {/* Mobile Hakkımızda Dropdown */}
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  className="inline-flex justify-start items-center w-full rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
                  onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                >
                  Hakkımızda
                  <ChevronDown className={`ml-1 h-5 w-5 transition-transform ${isAboutDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {isAboutDropdownOpen && (
                  <div className="origin-top-right absolute left-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu">
                    <div className="py-1" role="none">
                      <Link to="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={closeAllMenus}>Genel Bakış</Link>
                      <Link to="/teachers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={closeAllMenus}>Öğretmenler</Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={closeAllMenus}
              >
                İletişim
              </Link>

              {/* Mobile User Dropdown and Login/Register */}
              {user ? (
                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    className="inline-flex justify-start items-center w-full rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  >
                    {generateAvatar(user.email)}
                    <span className='ml-2'>{user.email}</span>
                    <ChevronDown className={`ml-1 h-5 w-5 transition-transform ${isUserDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="origin-top-right absolute left-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu">
                      <div className="py-1" role="none">
                        <Link to="/whiteboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={closeAllMenus}>Beyaz Tahta</Link>
                        <button onClick={handleLogout}  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem">
                          <LogOut className="h-4 w-4 mr-2 inline-block" /> Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center"
                    onClick={closeAllMenus}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    <span>Giriş</span>
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    onClick={closeAllMenus}
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>Kayıt</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main>{children}</main>
    </div>
  );
}

export default Layout;
