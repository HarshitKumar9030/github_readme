"use client";
import React, { useState } from "react";

interface IntegrationMenuProps {
  socials: Socials;
  onChange: (socials: Socials) => void;
}

export interface Socials {
  github: string;
  instagram: string;
  twitter: string;
  linkedin: string;
}

const defaultSocials: Socials = {
  github: "",
  instagram: "",
  twitter: "",
  linkedin: "",
};

export default function IntegrationMenu({ socials, onChange }: IntegrationMenuProps) {
  const [localSocials, setLocalSocials] = useState<Socials>(socials || defaultSocials);

  const handleChange = (key: keyof Socials, value: string) => {
    const updated = { ...localSocials, [key]: value };
    setLocalSocials(updated);
    onChange(updated);
  };
  
  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* GitHub Input with special styling */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 mt-6 text-gray-400 group-hover:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </div>
          <label htmlFor="github-social" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub</label>
          <input
            id="github-social"
            type="text"
            className="w-full focus:outline-none pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            placeholder="e.g. harshitkumar9030"
            value={localSocials.github}
            onChange={e => handleChange("github", e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {localSocials.github && (
              <span className="text-xs text-green-500 font-medium mt-5">Connected</span>
            )}
          </div>
        </div>
        
        {/* Twitter Input */}
        <div className="relative group">
          <div className="absolute mt-6 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-blue-400 group-hover:text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
          <label htmlFor="twitter-social" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter</label>
          <input
            id="twitter-social"
            type="text"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            placeholder="e.g. your_twitter"
            value={localSocials.twitter}
            onChange={e => handleChange("twitter", e.target.value)}
            disabled
          />
        </div>

        {/* Instagram Input */}
        <div className="relative group">
          <div className="absolute mt-6 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-pink-500 group-hover:text-pink-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </div>
          <label htmlFor="instagram-social" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram</label>
          <input
            id="instagram-social"
            type="text"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            placeholder="e.g. your_instagram"
            value={localSocials.instagram}
            onChange={e => handleChange("instagram", e.target.value)}
            disabled
          />
        </div>

        {/* LinkedIn Input */}
        <div className="relative group">
          <div className="absolute mt-6 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-blue-600 group-hover:text-blue-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </div>
          <label htmlFor="linkedin-social" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn</label>
          <input
            id="linkedin-social"
            type="text"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            placeholder="e.g. your_linkedin"
            value={localSocials.linkedin}
            onChange={e => handleChange("linkedin", e.target.value)}
            disabled
          />
        </div>
        
        <div className="pt-4 pb-2">
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
            <div className="flex-shrink-0 mr-3">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Connected social accounts</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">These accounts will be displayed in your README profile</p>
            </div>
          </div>
        </div>
        <div className="pt-2 mt-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            For the time being, only GitHub is supported. Other platforms will be added soon.
          </div>
        </div>
      </div>
    </div>
  );
}
