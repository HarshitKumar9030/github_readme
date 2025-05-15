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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 w-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Connect Your Socials</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="e.g. harshitkumar9030"
            value={localSocials.github}
            onChange={e => handleChange("github", e.target.value)}
          />
        </div>        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="e.g. your_twitter"
            value={localSocials.twitter}
            onChange={e => handleChange("twitter", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="e.g. your_insta"
            value={localSocials.instagram}
            onChange={e => handleChange("instagram", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="e.g. your_linkedin"
            value={localSocials.linkedin}
            onChange={e => handleChange("linkedin", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
