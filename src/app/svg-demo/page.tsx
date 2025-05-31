'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SVGDemoPage() {
  const [baseUrl, setBaseUrl] = useState('');
  
  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SVG API Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our dynamic SVG APIs that make GitHub README files stand out. 
            Each API generates customizable, animated SVG graphics perfect for showcasing 
            your projects and skills.
          </p>
        </div>

        <div className="space-y-16">
          {/* Typing Animation */}
          <section className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Typing Animation SVG
            </h2>
            <p className="text-gray-600 mb-6">
              Create animated typing effects perfect for displaying skills, titles, or welcome messages.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Default Theme</h3>
                <Image 
                  src={`${baseUrl}/api/typing-animation?text=Welcome to my GitHub Profile&theme=default`}
                  alt="Typing Animation Default"
                  width={600}
                  height={100}
                  className="border rounded"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Neon Theme</h3>
                <Image 
                  src={`${baseUrl}/api/typing-animation?text=Full Stack Developer&theme=neon&speed=1.2`}
                  alt="Typing Animation Neon"
                  width={600}
                  height={100}
                  className="border rounded"
                />
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded">
              <code className="text-sm">
                {`![Typing SVG](${baseUrl}/api/typing-animation?text=Your+Text+Here&theme=neon)`}
              </code>
            </div>
          </section>

          {/* Wave Animation */}
          <section className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Wave Animation SVG
            </h2>
            <p className="text-gray-600 mb-6">
              Beautiful animated wave patterns for section dividers and decorative elements.
            </p>
              <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Ocean Theme</h3>
                <Image 
                  src={`${baseUrl}/api/wave-animation?theme=ocean&waves=3&height=100&width=600`}
                  alt="Wave Animation Ocean"
                  width={600}
                  height={100}
                  className="border rounded w-full"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Sunset Theme</h3>
                <Image 
                  src={`${baseUrl}/api/wave-animation?theme=sunset&waves=4&height=80&width=600`}
                  alt="Wave Animation Sunset"
                  width={600}
                  height={80}
                  className="border rounded w-full"
                />
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded">
              <code className="text-sm">
                {`![Wave](${baseUrl}/api/wave-animation?theme=ocean&waves=3)`}
              </code>
            </div>
          </section>

          {/* Language Chart */}
          <section className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Language Distribution Chart
            </h2>
            <p className="text-gray-600 mb-6">
              Visual representation of programming language usage across your repositories.
            </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">GitHub Theme</h3>
                <Image 
                  src={`${baseUrl}/api/language-chart?username=octocat&theme=github&size=250`}
                  alt="Language Chart GitHub Theme"
                  width={250}
                  height={250}
                  className="border rounded mx-auto"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Dark Theme</h3>
                <Image 
                  src={`${baseUrl}/api/language-chart?username=octocat&theme=dark&size=250`}
                  alt="Language Chart Dark Theme"
                  width={250}
                  height={250}
                  className="border rounded mx-auto"
                />
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded">
              <code className="text-sm">
                {`![Languages](${baseUrl}/api/language-chart?username=yourusername&theme=github)`}
              </code>
            </div>
          </section>

          {/* Repository Showcase */}
          <section className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Repository Showcase
            </h2>
            <p className="text-gray-600 mb-6">
              Professional repository cards displaying stats, description, and metadata.
            </p>
              <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">GitHub Theme</h3>
                <Image 
                  src={`${baseUrl}/api/repo-showcase?username=octocat&repo=Hello-World&theme=github&width=500&height=180`}
                  alt="Repository Showcase GitHub"
                  width={500}
                  height={180}
                  className="border rounded"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Dark Theme</h3>
                <Image 
                  src={`${baseUrl}/api/repo-showcase?username=octocat&repo=Hello-World&theme=dark&width=500&height=180`}
                  alt="Repository Showcase Dark"
                  width={500}
                  height={180}
                  className="border rounded"
                />
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded">
              <code className="text-sm">
                {`![Repo](${baseUrl}/api/repo-showcase?username=yourusername&repo=your-repo&theme=github)`}
              </code>
            </div>
          </section>

          {/* API Parameters */}
          <section className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Customization Options
            </h2>
            <p className="text-gray-600 mb-6">
              All APIs support extensive customization through URL parameters:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Common Parameters</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">theme</code> - Visual theme (default, dark, github, neon, etc.)</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">width</code> - SVG width in pixels</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">height</code> - SVG height in pixels</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">color</code> - Primary color (hex code)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Specific Parameters</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">text</code> - Text content (typing animation)</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">speed</code> - Animation speed multiplier</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">username</code> - GitHub username (charts & showcase)</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">waves</code> - Number of wave layers</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Getting Started
            </h2>
            <p className="text-gray-600 mb-4">
              Ready to enhance your GitHub README? Simply copy the URLs above and replace the parameters with your own values.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="/create" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create Your README
              </a>
              <a 
                href="/SVG_API_DOCS.md" 
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Full Documentation
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
