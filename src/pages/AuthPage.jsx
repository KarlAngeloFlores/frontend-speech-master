import { useState } from 'react'
import SignUpForm from '../components/auth/SignUpForm'
import SignInForm from '../components/auth/SignInForm'
import VerificationForm from '../components/auth/VerificationForm'
import authService from '../services/auth.service'


const AuthPage = () => {

    const [currentAuth, setCurrentAuth] = useState('signin');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    const handleVerification = async (code) => {

        console.log(email, password, token, code);

        try {
            await authService.registerAndVerify(token, password, code);
        } catch (error) {
            throw error;
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8'>
        {currentAuth === 'signin' && <SignInForm 
        setCurrentAuth={setCurrentAuth} 
        />}

        {currentAuth === 'signup' && <SignUpForm 
        setCurrentAuth={setCurrentAuth} 
        setEmail={setEmail} 
        setPassword={setPassword} 
        setToken={setToken} 
        />}

        {currentAuth === 'verify' && <VerificationForm 
        type="verify_account"
        setCurrentAuth={setCurrentAuth} 
        handleVerification={handleVerification} 
        email={email} 
        />}
    </div>
  )
}

export default AuthPage