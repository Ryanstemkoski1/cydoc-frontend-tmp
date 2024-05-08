import React from 'react';
import { useRouter } from 'next/navigation';
import SignUpForm from './Account/SignUpForm';

export default function SignUp() {
    const router = useRouter();

    return <SignUpForm modalOpen closeModal={router.back} />;
}
