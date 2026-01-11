import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, User, Lock, ArrowLeft } from 'lucide-react';

type LoginType = 'admin' | 'student';

const Login = () => {
  const [loginType, setLoginType] = useState<LoginType>('admin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication (replace with actual API call)
    setTimeout(() => {
      if (loginType === 'admin') {
        if (identifier === 'admin' && password === 'admin123') {
          login({
            id: '1',
            name: 'Admin User',
            email: 'admin@examalloc.com',
            role: 'admin',
            identifier: 'admin',
          });
          toast({
            title: 'Welcome back!',
            description: 'Successfully logged in as Admin.',
          });
          navigate('/admin');
        } else {
          toast({
            title: 'Login Failed',
            description: 'Invalid credentials. Try admin/admin123',
            variant: 'destructive',
          });
        }
      } else {
        // Student login - just check if identifier exists
        login({
          id: identifier,
          name: 'Student User',
          role: 'student',
          identifier,
        });
        toast({
          title: 'Welcome!',
          description: 'Successfully logged in as Student.',
        });
        navigate('/student-lookup');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Login Card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card-hover animate-slide-up">
            {/* Logo */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-primary">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to access the exam allocation system
              </p>
            </div>

            {/* Login Type Toggle */}
            <div className="mb-6 flex rounded-lg bg-secondary p-1">
              <button
                type="button"
                onClick={() => setLoginType('admin')}
                className={`flex-1 rounded-md py-2.5 text-sm font-medium transition-all duration-200 ${
                  loginType === 'admin'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setLoginType('student')}
                className={`flex-1 rounded-md py-2.5 text-sm font-medium transition-all duration-200 ${
                  loginType === 'student'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Student
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">
                  {loginType === 'admin' ? 'Username or Email' : 'Roll / Register Number'}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder={
                      loginType === 'admin' ? 'Enter username' : 'Enter roll number'
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {loginType === 'admin' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            {loginType === 'admin' && (
              <div className="mt-6 rounded-lg bg-secondary/50 p-4">
                <p className="text-xs font-medium text-muted-foreground">Demo Credentials:</p>
                <p className="mt-1 text-sm text-foreground">
                  Username: <code className="rounded bg-secondary px-1">admin</code> | 
                  Password: <code className="rounded bg-secondary px-1">admin123</code>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
