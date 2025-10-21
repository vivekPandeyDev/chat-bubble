import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useGenerateToken } from '@/hooks/use-generate-token';
import { AuthContext } from '@/context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const mutation = useGenerateToken();
  const { login } = useContext(AuthContext);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password }, {
      onSuccess: (data) => {
        const {token,username,expiresAt,issuer} = data.data;
        console.group("Login Success");
        console.info("Username:", username);
        console.info("Expires At:", new Date(expiresAt * 1000).toLocaleString());
        console.info("Issuer:", issuer);
        console.groupEnd();
        login(token, username, expiresAt);
        navigate("/chat");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] mb-4 shadow-[var(--shadow-glow)]">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">Sign in to continue your conversations</p>
        </div>

        <Card className="border-border shadow-[var(--shadow-md)]">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] hover:opacity-90 transition-opacity shadow-[var(--shadow-md)]"
              >
                Sign In
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-primary"
                  onClick={() => navigate('/signup')}
                >
                  Sign up
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
