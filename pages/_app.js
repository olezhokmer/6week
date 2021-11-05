import supabase from '../supabase'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'


function MyApp({ Component, pageProps }) {
    const router = useRouter();
    
    const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            onAuthStateChange(event)
        });
        getUser();
        return () => authListener.unsubscribe();
    });

    function onAuthStateChange(event){
        if(event === 'SIGNED_IN'){
            setIsAuthenticatedState(true);
            router.push('/kyc');
        } else {
            setIsAuthenticatedState(false);
        }
    }
    async function getUser(){
        const user = await supabase.auth.user();
        if (user) setIsAuthenticatedState(true);
    }

    function signOut() {
        supabase.auth.signOut();
        router.push('/');
    }

    return (
        <div>
            <Head>
                <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet"></link>
            </Head>
            <nav className="shadow-lg flex items-center justify-between flex-wrap bg-blue-300 p-6">
                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-sm lg:flex-grow">
                        <Link href="/">
                            <a className="block inline-block mt-0 text-teal-200 hover:text-white mr-4">Home</a>
                        </Link>
                        {
                            isAuthenticatedState == true && (
                                <Link href="/kyc">
                                    <a className="block inline-block mt-0 text-teal-200 hover:text-white mr-4">Kyc</a>
                                </Link>
                            )
                        }
                    </div>
                    <div>
                        {
                            isAuthenticatedState == false && (
                                <Link href="/login">
                                    <a className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white mt-0">Sign In</a>
                                </Link>
                            )
                        }
                        {
                            isAuthenticatedState == true && (
                                <Link href="/">
                                    <a onClick={signOut} className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white mt-0">Sign Out</a>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </nav>
            <Component {...pageProps} />
        </div>
    );
}

export default MyApp