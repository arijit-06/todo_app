import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const AuthLayout: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main>
      {isLogin ? (
        <LoginForm onSwitchToSignUp={() => setIsLogin(false)} />
      ) : (
        <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </main>
  );
};

export default AuthLayout;
