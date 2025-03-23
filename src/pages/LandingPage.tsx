
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, IndianRupee, Camera, Check, AlertTriangle, Zap, Lock } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { useLanguage } from '@/providers/LanguageProvider';

const LandingPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      {/* Hero Section with 3D Effect */}
      <section className="relative overflow-hidden py-20 md:py-32 perspective-1000">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4 transform-style-3d rotate-y-1 transition-transform duration-500 hover:rotate-y-0">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none drop-shadow-md">
                  {t('authenticatePrecision')}
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl shadow-sm">
                  {t('currencyGuardDesc')}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="gap-1 shadow-lg hover:shadow-primary/50 transform transition-all hover:-translate-y-1">
                  <Link to="/currency-auth">
                    <Shield className="h-5 w-5" />
                    {t('startAuth')}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end perspective-1000">
              <div className="relative h-[350px] w-[350px] md:h-[450px] md:w-[450px] bg-gradient-to-b from-primary/20 to-primary/5 rounded-full flex items-center justify-center transform-style-3d rotate-y-12 hover:rotate-y-0 transition-transform duration-700 shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 to-transparent"></div>
                <IndianRupee className="h-32 w-32 md:h-40 md:w-40 text-primary transform translate-z-20 hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
        
        {/* 3D Background Elements */}
        <div className="absolute -top-20 -left-20 h-64 w-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 h-96 w-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </section>
      
      {/* Security Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl drop-shadow-sm">{t('advancedSecurity')}</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t('hybraidDesc')}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-card/70 rounded-xl shadow-lg transform transition-transform hover:-translate-y-2 hover:shadow-xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-inner">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{t('multiPoint')}</h3>
                <p className="text-muted-foreground">
                  {t('multiPointDesc')}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-card/70 rounded-xl shadow-lg transform transition-transform hover:-translate-y-2 hover:shadow-xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-inner">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{t('hybridSystem')}</h3>
                <p className="text-muted-foreground">
                  {t('hybridSystemDesc')}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-card/70 rounded-xl shadow-lg transform transition-transform hover:-translate-y-2 hover:shadow-xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-inner">
                <Check className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{t('confidenceScoring')}</h3>
                <p className="text-muted-foreground">
                  {t('confidenceScoringDesc')}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-card/70 rounded-xl shadow-lg transform transition-transform hover:-translate-y-2 hover:shadow-xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-inner">
                <AlertTriangle className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{t('counterfeitDetection')}</h3>
                <p className="text-muted-foreground">
                  {t('counterfeitDetectionDesc')}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-card/70 rounded-xl shadow-lg transform transition-transform hover:-translate-y-2 hover:shadow-xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-inner">
                <Lock className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{t('securityVerification')}</h3>
                <p className="text-muted-foreground">
                  {t('securityVerificationDesc')}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-card/70 rounded-xl shadow-lg transform transition-transform hover:-translate-y-2 hover:shadow-xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-inner">
                <IndianRupee className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{t('currencyExpertise')}</h3>
                <p className="text-muted-foreground">
                  {t('currencyExpertiseDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Technology Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t('hybridDecisionTech')}</h2>
              <p className="text-muted-foreground md:text-lg">
                {t('hybridTechDesc')}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span>Computer vision pattern recognition for microprinting analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span>Multi-point security feature correlation for enhanced verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span>Specialized algorithms for detecting color-shifting ink authenticity</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span>Watermark intensity analysis with proprietary detection techniques</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span>Serial number format verification with probabilistic matching</span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 perspective-1000">
              <div className="relative aspect-video bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-2xl shadow-lg overflow-hidden transform-style-3d rotate-y-6 hover:rotate-y-0 transition-transform duration-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4/5 h-4/5 border-2 border-primary/30 rounded-lg flex items-center justify-center transform translate-z-12">
                    <div className="text-center space-y-2">
                      <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full">
                        <Shield className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="font-bold text-xl">99.8% Accuracy</h3>
                      <p className="text-sm text-muted-foreground">Based on analysis of 10,000+ genuine and counterfeit samples</p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t('readyToVerify')}</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                {t('startUsingDesc')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button asChild size="lg" className="gap-1 shadow-lg hover:shadow-primary/50 transform transition-all hover:-translate-y-1">
                <Link to="/currency-auth">
                  <Shield className="h-5 w-5" />
                  {t('authNow')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>CurrencyGuard &copy; {new Date().getFullYear()} - Protecting you from counterfeit currency with 99.8% accuracy</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
