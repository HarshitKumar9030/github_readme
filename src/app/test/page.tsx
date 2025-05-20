'use client';

import { useState } from 'react'
import React from 'react'
import { getGithubStats } from '@/services/socialStats'
import Image from 'next/image';

const Test = () => {
    const [ username, setUsername ] = useState<string>('');
    const [ stats, setStats ] = useState<any>(null);
    const getStats  = async () => {
        const stats = await getGithubStats(username);
        setStats(stats);
        console.log(stats);
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }


  return (
    <>
        <div className="h-screen w-screen text-neutral-900 bg-blue-100">
            <div className="flex items-center justify-center flex-col">
                <label htmlFor="username">Enter the username for getting github stats: </label>
                <input onChange={handleChange} type="text" id="username" className="border-2 border-gray-300 rounded-md p-2 m-2" />
                <button onClick={getStats} className="bg-blue-500 text-white p-2 rounded-md" >Get Stats</button>
            </div>
            <div className="flex items-center justify-center flex-col">
                {stats && (
                    <div className="bg-white shadow-md rounded-md p-4 m-4">
                        <Image src={stats.avatar_url} alt="Avatar" className="rounded-full w-24 h-24" width={96} height={96} />
                        <h2 className="text-xl font-bold">{stats.name}</h2>
                        <p>{stats.bio}</p>
                        <p>Followers: {stats.followers}</p>
                        <p>Following: {stats.following}</p>
                        <p>Public Repos: {stats.public_repos}</p>
                        <p>Public Gists: {stats.public_gists}</p>
                    </div>
                )}
        </div>
    </div>
    </>
  )
}

export default Test