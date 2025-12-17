import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckSquare, Kanban, Calendar, BarChart3, Zap, Shield } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 py-20 relative">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold font-mono tracking-tight">TaskForge</span>
            </div>
            <Link to="/auth">
              <Button variant="outline" className="font-mono">
                Sign In
              </Button>
            </Link>
          </nav>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Task Management
              <br />
              <span className="text-foreground">Built for Engineers</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-mono">
              A minimalist, keyboard-first task manager designed for developers who value efficiency and clean interfaces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="font-mono text-lg px-8">
                  Get Started
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="font-mono text-lg px-8">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Kanban className="w-8 h-8" />}
            title="Kanban Board"
            description="Visualize your workflow with drag-and-drop columns. Move tasks seamlessly between stages."
          />
          <FeatureCard
            icon={<Calendar className="w-8 h-8" />}
            title="Calendar View"
            description="See your tasks on a timeline. Never miss a deadline with date-based organization."
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Analytics Dashboard"
            description="Track your productivity with completion charts and overdue task insights."
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Keyboard Shortcuts"
            description="Navigate and manage tasks without touching your mouse. Built for speed."
          />
          <FeatureCard
            icon={<CheckSquare className="w-8 h-8" />}
            title="Projects & Tags"
            description="Organize tasks with color-coded projects and flexible tagging system."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Secure & Private"
            description="Your data is encrypted and only accessible to you. No tracking, no ads."
          />
        </div>
      </div>

      {/* Keyboard Shortcuts Preview */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-center font-mono">Keyboard-First Design</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <KeyboardShortcut keys={["N"]} description="New task" />
            <KeyboardShortcut keys={["Ctrl", "K"]} description="Command palette" />
            <KeyboardShortcut keys={["1", "2", "3"]} description="Switch views" />
            <KeyboardShortcut keys={["Esc"]} description="Close dialogs" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground font-mono text-sm">
          <p>Built with precision. Designed for engineers.</p>
        </div>
      </footer>
    </div>
  );
};

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 group">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 font-mono">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function KeyboardShortcut({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <div className="flex gap-1">
        {keys.map((key, i) => (
          <kbd
            key={i}
            className="px-2 py-1 text-xs font-mono bg-background border border-border rounded shadow-sm"
          >
            {key}
          </kbd>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">{description}</span>
    </div>
  );
}

export default Index;
