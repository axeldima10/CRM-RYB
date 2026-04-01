import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { UserPlus } from 'lucide-react';
import type { UserRole } from '../../types/database';

export function SignupPage() {
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('bd');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signup(email, password, fullName, role);
      navigate('/dashboard');
    } catch {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-slate-900 mb-4">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Join RYB</h1>
          <p className="text-slate-500 mt-1">Create your account</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Sign up</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <Input
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Role</label>
                <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                  <option value="bd">Business Developer</option>
                  <option value="client">Client</option>
                </Select>
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                <UserPlus className="h-4 w-4" />
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-slate-900 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
