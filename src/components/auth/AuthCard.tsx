
import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type AuthMode = 'login' | 'signup' | 'forgotPassword';

interface AuthCardProps {
  children: ReactNode;
  mode: AuthMode;
}

const AuthCard = ({ children, mode }: AuthCardProps) => {
  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome back';
      case 'signup': return 'Create an account';
      case 'forgotPassword': return 'Reset your password';
    }
  };
  
  const getDescription = () => {
    switch (mode) {
      case 'login': return 'Enter your email and password to log in';
      case 'signup': return 'Enter your details to create a new account';
      case 'forgotPassword': return 'Enter your email and we\'ll send you a reset link';
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {getTitle()}
        </CardTitle>
        <CardDescription className="text-center">
          {getDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-5">
        <p className="text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline hover:text-primary">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
