import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import {
  GraduationCap,
  Shuffle,
  Shield,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: Shuffle,
    title: 'Smart Shuffle Algorithm',
    description: 'Fisher-Yates based randomization ensures fair and unpredictable seat allocation.',
  },
  {
    icon: Shield,
    title: 'Anti-Cheating Measures',
    description: 'Prevents students from same class/department from sitting together.',
  },
  {
    icon: Users,
    title: 'Multi-Institution Support',
    description: 'Manage schools and colleges with different student data structures.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track allocation statistics and generate comprehensive reports.',
  },
];

const steps = [
  { step: '01', title: 'Add Institutions', description: 'Register schools or colleges in the system' },
  { step: '02', title: 'Upload Students', description: 'Import student data with class/department info' },
  { step: '03', title: 'Create Exams', description: 'Schedule exams with date and session details' },
  { step: '04', title: 'Generate Allocations', description: 'Let the algorithm create optimal seating' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero px-4 py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        </div>
        
        <div className="container relative mx-auto text-center">
          <div className="mx-auto max-w-4xl animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <GraduationCap className="h-4 w-4" />
              Exam Management Made Simple
            </div>
            
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Smart Exam Hall
              <span className="text-gradient block">Allocation System</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Automate seat allocation with intelligent shuffle algorithms. Reduce cheating, 
              save time, and ensure fair distribution across exam halls.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="hero" size="xl" asChild>
                <Link to="/login">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/student-lookup">
                  Student Hall Lookup
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Floating Cards */}
          <div className="relative mt-16 hidden lg:block">
            <div className="absolute left-10 top-0 animate-float rounded-2xl bg-card p-4 shadow-card-hover">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold">1,234 Students</p>
                  <p className="text-xs text-muted-foreground">Allocated today</p>
                </div>
              </div>
            </div>
            
            <div className="absolute right-10 top-10 animate-float rounded-2xl bg-card p-4 shadow-card-hover" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shuffle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Smart Shuffle</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="border-t border-border bg-card px-4 py-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Powerful Features for Modern Institutions
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to manage exam seating efficiently and fairly.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground">
              Get started in minutes with our simple four-step process.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-transparent lg:block" />
                )}
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-2xl font-bold text-primary-foreground shadow-primary">
                    {item.step}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="border-t border-border bg-card px-4 py-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl rounded-3xl gradient-primary p-8 text-center shadow-primary md:p-12">
            <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Streamline Your Exam Management?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Join institutions that trust our system for fair and efficient exam hall allocation.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="xl"
                className="bg-background text-primary hover:bg-background/90"
                asChild
              >
                <Link to="/login">
                  Start Free Trial
                </Link>
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border bg-background px-4 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">ExamAlloc</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 ExamAlloc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
