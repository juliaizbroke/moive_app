"use client";
import React from 'react';
import { useRouter } from "next/navigation";

const HomePage: React.FC = () => {
    const router = useRouter();


    React.useEffect(() => {
        router.push('/home');
    }, [router]);

    return null;
};

export default HomePage;