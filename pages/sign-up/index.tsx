import type { NextPage } from 'next'
import supabase from '../../supabase'
import Link from 'next/link'

const SignUp: NextPage = () => {

    async function signUp(e: any) : Promise<void> {
        e.preventDefault();
        let email = e.target[0].value;
        let password = e.target[1].value;
        let passwordConfirm = e.target[2].value;
    
        if(password != passwordConfirm) return alert("Password is not confirmed.");
    
        const { data, error } = await supabase.auth.signUp({email,password});
        if(error){
            return alert(error.message);
        }
    }


    async function signInWithGoogle() {
        const { error } = await supabase.auth.signIn({ provider: "google"});
    }


    return (
        <div>
            <div className="flex flex-col items-center justify-center w-screen mt-40  ">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="flex items-center justify-center">
                        <button onClick={signInWithGoogle} className="flex items-center justify-center shadow-lg font-bold py-2 px-4 rounded" type="submit">
                            Sign In with Google
                        </button>
                    </div>
                    <form className="mt-6" onSubmit={signUp}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                            <input className="shadow appearance-none w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="password" />
                            
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passwordConfirm">Password Confirm</label>
                            <input className="shadow appearance-none w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="passwordConfirm" type="password" placeholder="password" />  
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Sign Up</button>
                        </div>   
                        <div>
                            Already have an account? 
                            <Link href="/login" >
                                <a className="align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Login</a>
                            </Link>
                        </div>             
                    </form>
                </div>
            </div>    
        </div>
    );
}

export default SignUp;