'use client';

import React from 'react';
import UnderConstruction from '@/components/UnderConstruction';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function TemplatesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main content */}
      <main className="flex-grow">
        {/* Title section with animation */}
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 text-center relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
              README Templates
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Choose from our professionally designed templates to jumpstart your GitHub profile.
            </p>
          </motion.div>

          {/* Background gradient animation */}
          <motion.div 
            className="absolute inset-0 z-0"
            animate={{ 
              background: [
                'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 50%)',
                'radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 50%)',
                'radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 50%)',
                'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 50%)'
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        </section>

        {/* Under construction component */}
        <UnderConstruction 
          title="Templates Coming Soon"
          message="We're working on a collection of beautifully designed templates for your GitHub profile. Stay tuned for the release!"
          showHomeLink={false}
        />

        {/* Preview section */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Template Categories
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              We&apos;re building templates for every type of GitHub profile and project
            </p>
          </div>

          {/* Template categories - animated on scroll */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Personal Profiles', count: 12, color: 'blue' },
              { title: 'Developer Portfolios', count: 8, color: 'purple' },
              { title: 'Project READMEs', count: 15, color: 'green' },
              { title: 'Organization Profiles', count: 6, color: 'red' },
              { title: 'Minimal Designs', count: 10, color: 'gray' },
              { title: 'Animated Showcases', count: 7, color: 'yellow' }
            ].map((category, index) => (
              <motion.div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border-t-4 border-${category.color}-500`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {category.count}+ templates
                  </p>
                  <p className="mt-4 text-blue-600 dark:text-blue-400">
                    Coming soon
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Want to be notified when templates are available?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join our waitlist to be the first to know when our templates are released.
            </p>
            
            <Link 
              href="/create"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Start Creating Now
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
