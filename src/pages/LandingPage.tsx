
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, IndianRupee, Camera, Check, AlertTriangle } from 'lucide-react';
import NavBar from '@/components/NavBar';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Authenticate ₹500 Notes with Confidence
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  CurrencyGuard helps you verify the authenticity of Indian ₹500 notes through advanced security feature recognition.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="gap-1">
                  <Link to="/currency-auth">
                    <Shield className="h-5 w-5" />
                    Start Authentication
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative h-[350px] w-[350px] md:h-[450px] md:w-[450px] bg-gradient-to-b from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                <IndianRupee className="h-32 w-32 md:h-40 md:w-40 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                CurrencyGuard provides comprehensive tools to verify ₹500 notes
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Visual Verification</h3>
                <p className="text-muted-foreground">
                  Learn to visually identify authentic security features on ₹500 notes
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Security Checklist</h3>
                <p className="text-muted-foreground">
                  Step-by-step guidance on verifying each security element
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <AlertTriangle className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Counterfeit Detection</h3>
                <p className="text-muted-foreground">
                  Learn about common counterfeiting techniques and how to spot them
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Verify Your Currency?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start using our authentication tools to protect yourself from counterfeit notes.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="gap-1">
                <Link to="/currency-auth">
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>CurrencyGuard &copy; {new Date().getFullYear()} - Protecting you from counterfeit currency</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
