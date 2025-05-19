import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { School, Mail, Lock, User, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'; // CheckCircle'ı kaldırdık

type AuthMode = 'login' | 'register';

export function AuthForm({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  //const [showSuccess, setShowSuccess] = useState(false); // Artık success mesajı yok

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);


  const debounce = useCallback((func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }, []);


  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateEmail = debounce(() => {
    setEmailTouched(true);
  }, 300);
  const isEmailInvalid = emailTouched && !isValidEmail(email);

  const isValidPassword = (password: string) => password.length >= 6;
  const validatePassword = debounce(() => {
    setPasswordTouched(true);
  }, 300);
  const isPasswordInvalid = passwordTouched && !isValidPassword(password);


  const isValidUsername = (username: string) => username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
  const validateUsername = debounce(() => {
    setUsernameTouched(true);
  }, 300);
  const isUsernameInvalid = usernameTouched && !isValidUsername(username);


  const focusNextInput = (currentInput: HTMLInputElement | null) => {
    if (!currentInput) return;

    if (currentInput === usernameRef.current && emailRef.current) {
      emailRef.current.focus();
    } else if (currentInput === emailRef.current && passwordRef.current) {
      passwordRef.current.focus();
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setFormSubmitted(true);

    setEmailTouched(true);
    setPasswordTouched(true);
    if (mode === "register") setUsernameTouched(true);

    if (mode === 'register' && (!isValidUsername(username) || !isValidEmail(email) || !isValidPassword(password))) {
      setError("Lütfen tüm alanları doğru şekilde doldurun.");
      setLoading(false);

      if (!isValidUsername(username) && usernameRef.current) {
        usernameRef.current.focus();
      } else if (!isValidEmail(email) && emailRef.current) {
        emailRef.current.focus();
      } else if (!isValidPassword(password) && passwordRef.current) {
        passwordRef.current.focus();
      }
      return;
    }

    if (mode === 'login' && (!isValidEmail(email) || !isValidPassword(password))) {
      setError("Lütfen geçerli bir e-posta ve şifre girin.");
      setLoading(false);

      if (!isValidEmail(email) && emailRef.current) {
        emailRef.current.focus();
      } else if (!isValidPassword(password) && passwordRef.current) {
        passwordRef.current.focus();
      }
      return;
    }

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });
        if (error) throw error;
        //setShowSuccess(true); // Artık success mesajı göstermiyoruz.
        //setLoading(false);  // Doğrudan navigate yaptığımız için burada false yapmaya gerek yok.
        navigate('/whiteboard'); // Kayıt başarılıysa doğrudan whiteboard'a yönlendir.

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/whiteboard');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };


  const handleBlur = (field: 'email' | 'password' | 'username') => {
    if (field === 'email') setEmailTouched(true);
    if (field === 'password') setPasswordTouched(true);
    if (field === 'username') setUsernameTouched(true);
  };

  // useEffect(() => { // useEffect'e de gerek kalmadı
  //   if (showSuccess) {
  //     const timer = setTimeout(() => {
  //       setShowSuccess(false);
  //       navigate('/login');
  //     }, 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [showSuccess, navigate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <School className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {mode === 'login' ? 'Hesabınıza giriş yapın' : 'Yeni bir hesap oluşturun'}
              </p>
            </div>

            {/* {showSuccess && ( // Başarılı mesajı göstermiyoruz
              <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md flex items-center" role="alert">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">Kayıt başarılı!  giriş yapın.</span>
              </div>
            )} */}

            {error && (
              <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-center" role="alert">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div>
                  <label htmlFor="username" className="sr-only">Kullanıcı Adı</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      required
                      value={username}
                      ref={usernameRef}
                      onChange={(e) => { setUsername(e.target.value); validateUsername(); }}
                      onBlur={() => { handleBlur('username'); focusNextInput(usernameRef.current) }}
                      onKeyDown={(e) => { if (e.key === 'Enter') focusNextInput(usernameRef.current) }}
                      className={`appearance-none block w-full px-10 py-3 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:z-10 sm:text-sm ${formSubmitted && isUsernameInvalid ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      placeholder="Kullanıcı adınız"
                    />

                  </div>
                  {formSubmitted && isUsernameInvalid && (
                    <p className="mt-2 text-sm text-red-600">Kullanıcı adı en az 3 karakter olmalı ve sadece harf, rakam ve alt çizgi içerebilir.</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="email" className="sr-only">E-posta</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    ref={emailRef}
                    onChange={(e) => { setEmail(e.target.value); validateEmail(); }}
                    onBlur={() => { handleBlur('email'); if (mode === 'register') focusNextInput(emailRef.current) }}
                    onKeyDown={(e) => { if (e.key === "Enter" && mode === 'register') focusNextInput(emailRef.current); }}
                    className={`appearance-none block w-full px-10 py-3 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:z-10 sm:text-sm ${formSubmitted && isEmailInvalid ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                    placeholder="E-posta adresiniz"
                  />

                </div>
                {formSubmitted && isEmailInvalid && (
                  <p className="mt-2 text-sm text-red-600">Geçerli bir e-posta adresi girin.</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Şifre</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={passwordVisible ? 'text' : 'password'}
                    required
                    value={password}
                    ref={passwordRef}
                    onChange={(e) => { setPassword(e.target.value); validatePassword(); }}
                    onBlur={() => handleBlur('password')}
                    className={`appearance-none block w-full px-10 py-3 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:z-10 sm:text-sm ${formSubmitted && isPasswordInvalid ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                    placeholder="Şifreniz"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
                    {passwordVisible ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </div>
                </div>
                {formSubmitted && isPasswordInvalid && (
                  <p className="mt-2 text-sm text-red-600">Şifre en az 6 karakter olmalıdır.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {loading ? (
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  ) : (
                    <Lock className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                  )}
                </span>
                {loading ? 'İşleniyor...' : mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
              </button>
            </form>
          </div>

          {/* Alt Kısım (Giriş/Kayıt Linkleri) */}
          <div className="text-center py-4 border-t border-gray-200">
            {mode === 'login' ? (
              <p className="text-sm text-gray-600">
                Hesabın yok mu?{' '}
                <RouterLink to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Kayıt Ol
                </RouterLink>

              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Zaten hesabın var mı?{' '}
                <RouterLink to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Giriş Yap
                </RouterLink>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;