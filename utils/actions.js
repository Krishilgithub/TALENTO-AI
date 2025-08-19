'use server';

import { createClientForServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const getSiteUrl = () => {
    const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (explicitSiteUrl && explicitSiteUrl.length > 0) return explicitSiteUrl.replace(/\/$/, '');
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl && vercelUrl.length > 0) return `https://${vercelUrl}`;
    return 'http://localhost:3000';
};

const signInWith = (provider) => async () => {
    const supabase = await createClientForServer();

    const siteUrl = getSiteUrl();
    // Ensure the callback URL is properly formatted with the next parameter
    const auth_callback_url = `${siteUrl}/auth/callback?next=/dashboard`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: auth_callback_url,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    });

    if (error) {
        console.log('OAuth error:', error);
        return { error: error.message };
    }

    if (!data?.url) {
        console.log('No OAuth URL returned');
        return { error: 'Failed to get authentication URL' };
    }

    return { url: data.url };
};
const signinWithGoogle = signInWith('google');
const signinWithGithub = signInWith('github');


const signOut = async () => {
    const supabase = await createClientForServer();
    await supabase.auth.signOut();
};

const signupWithEmailPassword = async (prev, formData) => {
    const supabase = await createClientForServer();

    const { error } = await supabase.auth.signUp({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (error) {
        console.log('error', error);
        return { success: null, error: error.message };
    }

    return { success: 'Please check your email', error: null };
};

const signinWithEmailPassword = async (formData) => {
    const supabase = await createClientForServer();

    const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
    });

    if (error) {
        console.log('error', error);
        return { error: error.message };
    }

    // Return user to allow client to decide next route (verify-otp / onboarding / dashboard)
    return { success: true, user: data?.user ?? null };
};

const sendResetPasswordEmail = async (prev, formData) => {
    const supabase = await createClientForServer();

    const siteUrl = getSiteUrl();
    const { error } = await supabase.auth.resetPasswordForEmail(
        formData.get('email'),
        { redirectTo: `${siteUrl}/reset/update-password` }
    );

    if (error) {
        console.log('error', error);
        return { success: '', error: error.message };
    }

    return { success: 'Please check your email', error: '' };
};

const updatePassword = async (prev, formData) => {
    const supabase = await createClientForServer();

    const { error } = await supabase.auth.updateUser({
        password: formData.get('password'),
    });

    if (error) {
        console.log('error', error);
        return { success: '', error: error.message };
    }

    return { success: 'Password updated', error: '' };
};

const signinWithMagicLink = async (prev, formData) => {
    const supabase = await createClientForServer();

    const { error } = await supabase.auth.signInWithOtp({
        email: formData.get('email'),
    });

    if (error) {
        console.log('error', error);
        return { success: null, error: error.message };
    }

    return { success: 'Please check your email', error: null };
};

const signinWithOtp = async (prev, formData) => {
    const supabase = await createClientForServer();

    const email = formData.get('email');

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
        console.log('error', error);
        return { success: null, error: error.message };
    }

    redirect(`/verify-otp?email=${email}`);
};

const verifyOtp = async (prev, formData) => {
    const supabase = await createClientForServer();

    const { error } = await supabase.auth.verifyOtp({
        token: formData.get('token'),
        email: prev.email,
        type: 'email',
    });

    if (error) {
        console.log('error', error);
        return { success: null, error: error.message };
    }

    redirect('/dashboard');
};

const sendResetOtp = async ({ email }) => {
    const supabase = await createClientForServer();
    // Send OTP to email
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
        console.log('error', error);
        return { error: error.message };
    }
    return { error: null };
};

const updatePasswordWithOtp = async ({ email, password, otp }) => {
    const supabase = await createClientForServer();
    // First, verify OTP
    const { error: otpError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
    });
    if (otpError) {
        console.log('otp error', otpError);
        return { error: 'Invalid or expired OTP.' };
    }
    // If OTP is valid, update password
    const { error: pwError } = await supabase.auth.updateUser({
        password,
    });
    if (pwError) {
        console.log('pw error', pwError);
        return { error: pwError.message };
    }
    return { error: null };
};

export {
    signinWithGoogle,
    signinWithGithub,
    signOut,
    signupWithEmailPassword,
    signinWithEmailPassword,
    sendResetPasswordEmail,
    updatePassword,
    signinWithMagicLink,
    signinWithOtp,
    verifyOtp,
    sendResetOtp,
    updatePasswordWithOtp,
};
