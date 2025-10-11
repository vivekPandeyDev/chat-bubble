import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Shield, Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))]/10 via-transparent to-[hsl(var(--accent))]/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] mb-8 shadow-[var(--shadow-glow)] animate-pulse">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary-glow))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
                Connect & Chat
              </span>
              <br />
              <span className="text-foreground">In Real-Time</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Experience seamless communication with instant messaging, group chats, 
              and real-time updates. Stay connected with what matters most.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup')}
                className="text-lg px-8 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] hover:opacity-90 transition-opacity shadow-[var(--shadow-md)]"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/login')}
                className="text-lg px-8 border-2"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-card border border-border hover:shadow-[var(--shadow-md)] transition-all duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--primary-glow))]/20 mb-4">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Real-Time Messaging</h3>
            <p className="text-muted-foreground">
              Send and receive messages instantly with WebSocket technology for seamless communication.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-card border border-border hover:shadow-[var(--shadow-md)] transition-all duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--accent))]/20 to-[hsl(var(--primary))]/20 mb-4">
              <Users className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Group Chats</h3>
            <p className="text-muted-foreground">
              Create permanent or temporary group chats to collaborate with teams and friends.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-card border border-border hover:shadow-[var(--shadow-md)] transition-all duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary-glow))]/20 to-[hsl(var(--accent))]/20 mb-4">
              <Shield className="h-7 w-7 text-primary-glow" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your conversations are protected with end-to-end encryption and secure authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
