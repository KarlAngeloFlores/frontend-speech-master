import React, { useState } from 'react'
import EmailForm from '../components/auth/EmailForm'
import ForgotForm from '../components/auth/ForgotForm'
import VerificationForm from '../components/auth/VerificationForm';

import authService from '../services/auth.service';



const ForgotPage = () => {

    const [currentForgot, setCurrentForgot] = useState('email'); // 'email' or 'reset'
    const [email, setEmail] = useState('');

    const handleEmailSend = async (email) => {
        try {
            setEmail(email);
            await authService.forgotPassword(email);
            setCurrentForgot('verification');
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }

    const handleVerification = async (code) => {
        try {
            await authService.verifyResetPassword(email,code);
            setCurrentForgot('reset');
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const handleChangePassword = async (newPassword, confirmPassword) => {
        try {
            const result = await authService.confirmNewPassword(email, newPassword, confirmPassword);
            console.log(result);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-green-50 px-4 sm:px-6 lg:px-8'>
        {currentForgot === 'email' && <EmailForm setCurrentForgot={setCurrentForgot} onSend={handleEmailSend} />}
        {currentForgot === 'verification' && <VerificationForm handleVerification={handleVerification} type="change_password" email={email} />}
        {currentForgot === 'reset' && <ForgotForm onSubmit={handleChangePassword} />}
    </div>
  )
}

export default ForgotPage