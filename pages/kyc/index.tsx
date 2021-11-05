import type { NextPage } from 'next'
import supabase from '../../supabase.js'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import Image from "next/image";

let kyc : any | null = null;
let user : any | null = null;
let imageElement : any = null;

const Kyc: NextPage = () => {

    const router = useRouter();

    useEffect(() => {
        getUserAndKyc();
    });

    async function getUserAndKyc() : Promise<void> {
        user = await supabase.auth.user();
        if(user == null) router.push('/');

        const { data } = await supabase.from("kyc")
        .select().match({ id : user.id });
        kyc = data?.length ? data[0] : null;

        if(kyc) ["phone", "first_name", "last_name", "country", "city"].forEach((id : string) => {
            const input : any = document.getElementById(id); 
            if(input) input.value = kyc[id];
        });

        if(kyc.doc_url){
            const { publicURL } = supabase.storage.from('kyc').getPublicUrl("images/"+kyc.doc_url);
            let image : any = document.getElementById("output");
            if(image) image.src = publicURL;
            imageElement = null;
        }
    }

    async function save(e: any){
        e.preventDefault();
        const id = user.id;
        const phone = e.target[0].value;
        const first_name = e.target[1].value;
        const last_name = e.target[2].value;
        const country = e.target[3].value;
        const city = e.target[4].value;
        
        const obj = {phone, first_name, last_name, country, city};
        await supabase.from("kyc").upsert([ { id, ...obj } ]);

        if(imageElement){
            const ex = imageElement.name.split('.').pop();
            const name = `${user.id}.${ex}`;
            await supabase.storage.from("kyc").remove(["images/"+kyc.doc_url]);
            await supabase.storage.from('kyc').upload("images/"+name, imageElement, { upsert: true });
            await supabase.from("kyc").update({ doc_url: name }).match({ id: user.id });
        }
        alert("Success!");
    }


    async function upload(e : any) {   
        let image : any = document.getElementById("output");
        imageElement = e.target.files[0];
        if(image) image.src = URL.createObjectURL(e.target.files[0]);  
    }

    return (
        <div>
            <div className="flex flex-col items-center justify-center w-screen mt-40  ">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={save}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone number</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="text" placeholder="Phone number" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">First name</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="first_name" type="text" placeholder="First name" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">Last name</label>
                        <input className="shadow appearance-none w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="last_name" type="text" placeholder="Last name" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">Country</label>
                        <input className="shadow appearance-none w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="country" type="text" placeholder="Country" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">City</label>
                        <input className="shadow appearance-none w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="city" type="text" placeholder="City" />
                    </div>
                    <div className="flex w-full items-center justify-center bg-grey-lighter mb-6">
                        <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white">
                            <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                            </svg>
                            <span className="mt-2 text-base leading-normal">Select a file</span>
                            <input type='file' className="hidden" onChange={upload} accept="image/*"/>
                        </label>
                    </div>
                    <div className="mt-6 mb-6 w-full text-center">
                        <img id="output" width="200px" />	
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Save</button>
                    </div>                
                </form>
            </div>    
        </div>
    );
}

export default Kyc;