
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import AuthCard from './AuthCard';

type AuthMode = 'login' | 'signup' | 'forgotPassword';

const AuthFormController = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const renderForm = () => {
    switch (mode) {
      case 'signup':
        return <SignupForm setMode={setMode} />;
      case 'forgotPassword':
        return <ForgotPasswordForm setMode={setMode} />;
      case 'login':
      default:
        return <LoginForm setMode={setMode} />;
    }
  };

  return (
    <AuthCard mode={mode}>
      {renderForm()}
    </AuthCard>
  );
};

export default AuthFormController;
