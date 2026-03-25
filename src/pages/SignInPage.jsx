import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [showResendLink, setShowResendLink] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (isSignUp && !name) {
      setError('Please enter your name');
      return;
    }

    setError('');
    setSuccessMessage('');
    setShowResendLink(false);
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password, name);
      } else {
        result = await signIn(email, password);
      }

      if (result.success) {
        if (isSignUp) {
          setSuccessMessage(result.message || 'Signup successful. Please verify your email.');
          // Clear form and switch to login mode after a delay
          setTimeout(() => {
            setIsSignUp(false);
            setSuccessMessage('');
            setPassword(''); // clear password field
            // Keep the email field populated so they don't have to re-type it
          }, 4000);
        } else {
          navigate('/profile');
        }
      } else {
        setError(result.error || 'Authentication failed');
        // Show resend link if email needs verification
        if (result.needsVerification) {
          setShowResendLink(true);
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMessage('');
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        navigate('/profile');
      } else {
        setError(result.error || 'Google sign-in failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email || !password) {
      setError('Please enter your email and password to resend the verification link.');
      return;
    }
    setResendLoading(true);
    setError('');
    try {
      const result = await resendVerificationEmail(email, password);
      if (result.success) {
        setSuccessMessage(result.message);
        setShowResendLink(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in py-12">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold text-text-primary">
              Bluecare <span className="text-primary">Pharma</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mt-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {isSignUp ? 'Sign up to get started' : 'Sign in to your account to continue'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? 'Signing in...' : `Sign ${isSignUp ? 'up' : 'in'} with Google`}
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-text-secondary">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-danger/10 text-danger text-sm px-4 py-2.5 rounded-lg">{error}</div>
            )}
            {successMessage && (
              <div className="bg-green-50 text-success text-sm px-4 py-2.5 rounded-lg border border-green-100">{successMessage}</div>
            )}

            {showResendLink && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="w-full text-sm font-medium text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {resendLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Resend Verification Link'
                )}
              </button>
            )}

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
                  <span className="text-sm text-text-secondary">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button variant="primary" size="lg" className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-border text-center">
            <p className="text-sm text-text-secondary">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMessage(''); setShowResendLink(false); }}
                className="text-primary font-medium hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 mt-8">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Shield size={12} className="text-primary" />
            <span>Your data is protected with 256-bit encryption</span>
          </div>
          <Link
            to="/admin"
            className="text-[11px] font-bold text-slate-400 hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-1.5"
          >
            <Lock size={10} />
            Administrator Access
          </Link>
        </div>
      </div>
    </div>
  );
}
