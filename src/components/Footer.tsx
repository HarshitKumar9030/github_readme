"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const fadeInUpVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  const navigationLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features", icon: "⚡" },
        { name: "Templates", href: "/templates", icon: "🎨" },
        { name: "Create README", href: "/create", icon: "✨" },
        { name: "Examples", href: "/examples", icon: "📋" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "About", href: "/about", icon: "ℹ️" },
        { name: "Documentation", href: "/documentation", icon: "📚" },
        {
          name: "GitHub",
          href: "https://github.com/harshitkumar9030/github_readme",
          icon: "🔗",
          external: true,
        },
        { name: "Support", href: "#", icon: "🛟", disabled: true },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "Discord", href: "#", icon: "💬", disabled: true },
        { name: "Blog", href: "#", icon: "📝", disabled: true },
        { name: "Newsletter", href: "#", icon: "📧", disabled: true },
        { name: "Feedback", href: "/feedback", icon: "💡" },
      ],
    },
  ];
  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/harshitkumar9030",
      icon: (
        <svg
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "hover:text-gray-900 dark:hover:text-white",
    },
    {
      name: "Twitter",
      href: "https://twitter.com/OhHarshit",
      icon: (
        <svg
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
      color: "hover:text-blue-500",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/_harshit.xd",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="currentColor"
          aria-hidden="true"
          viewBox="0 0 48 48"
        >
          <path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"></path>
        </svg>
      ),
      color: "hover:text-pink-500",
    },
    {
      name: "Discord",
      href: "#",
      disabled: true,
      icon: (
        <svg
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
        </svg>
      ),
      color: "hover:text-indigo-500",
    },
  ];
  return (
    <footer className="relative bg-gradient-to-t from-gray-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 border-t border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-10 -left-20 w-72 h-72 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-10 -right-20 w-96 h-96 bg-gradient-to-r from-purple-500/4 via-pink-500/4 to-orange-500/4 rounded-full blur-3xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            rotate: [360, 180, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <motion.div
          className="flex flex-col"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
        >
          <motion.div
            className="flex flex-col items-center mb-16 relative group"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

            <div className="flex items-center mb-6 relative z-10">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="mr-4"
              >
                <Image
                  src="/file.svg"
                  alt="GitHub README Generator"
                  width={40}
                  height={40}
                  className="drop-shadow-lg"
                />
              </motion.div>
              <span className="text-gray-900 dark:text-white font-bold text-2xl">
                README{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Generator
                </span>
              </span>
            </div>            <motion.p
              className="text-gray-600 dark:text-gray-400 text-center max-w-md text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Made for HackClub&apos;s Shipwrecked - Create stunning GitHub profiles for your hackathon projects.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {navigationLinks.map((section, sectionIdx) => (
              <motion.div
                key={section.title}
                className="text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * sectionIdx, duration: 0.5 }}
              >
                <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-6 relative">
                  {section.title}
                  <motion.div
                    className="absolute -bottom-2 left-0 md:left-0 right-0 md:right-auto h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{
                      delay: 0.3 + sectionIdx * 0.1,
                      duration: 0.8,
                    }}
                  />
                </h3>
                <ul className="space-y-4">
                  {" "}
                  {section.links.map((link, linkIdx) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.4 + sectionIdx * 0.1 + linkIdx * 0.05,
                        duration: 0.4,
                      }}
                    >
                      {link.disabled ? (
                        <span className="group inline-flex items-center text-gray-400 dark:text-gray-600 cursor-not-allowed transition-all duration-300 text-lg opacity-50">
                          <span className="mr-3 text-base transition-transform group-hover:scale-110">
                            {link.icon}
                          </span>
                          <span className="relative">
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
                          </span>
                        </span>
                      ) : link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 text-lg"
                        >
                          <span className="mr-3 text-base transition-transform group-hover:scale-110">
                            {link.icon}
                          </span>
                          <span className="relative">
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                          </span>
                          <motion.span
                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            animate={{ x: [0, 3, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5,
                              ease: "easeInOut",
                            }}
                          >
                            ↗
                          </motion.span>
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="group inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 text-lg"
                        >
                          <span className="mr-3 text-base transition-transform group-hover:scale-110">
                            {link.icon}
                          </span>
                          <span className="relative">
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                          </span>
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="flex justify-center mb-12"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {" "}
            <div className="flex space-x-8">
              {socialLinks.map((social, idx) =>
                social.disabled ? (
                  <motion.div
                    key={social.name}
                    className="relative group p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 0.5, scale: 1 }}
                    transition={{
                      delay: 0.6 + idx * 0.1,
                      duration: 0.4,
                      type: "spring",
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-500/0 via-gray-500/0 to-gray-500/0 group-hover:from-gray-500/5 group-hover:via-gray-500/5 group-hover:to-gray-500/5 transition-all duration-300"></div>
                    <div className="relative z-10">{social.icon}</div>
                    <span className="sr-only">{social.name} (Coming Soon)</span>
                  </motion.div>
                ) : (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative group p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.6 + idx * 0.1,
                      duration: 0.4,
                      type: "spring",
                    }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
                    <div className="relative z-10">{social.icon}</div>
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                )
              )}
            </div>
          </motion.div>

          <motion.div
            className="text-center relative"
            variants={fadeInUpVariants}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div
              className="flex items-center justify-center mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <motion.div
                className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 1 }}
              />
            </motion.div>

            <div className="space-y-4">
              <motion.p
                className="text-gray-600 dark:text-gray-400 text-lg font-medium"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                © {currentYear} README Generator. All rights reserved.
              </motion.p>

              <motion.p
                className="text-gray-600 dark:text-gray-400 text-base flex items-center justify-center flex-wrap gap-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <span>Made with</span>
                <motion.span
                  className="text-red-500 text-xl"
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ❤️
                </motion.span>
                <span>by</span>
                <motion.span
                  className="font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Harshit Singh
                </motion.span>
              </motion.p>

              <motion.div
                className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <Link
                  href="/privacy"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link
                  href="/terms"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
                <span>•</span>
                <Link
                  href="/contact"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60"></div>
    </footer>
  );
};

export default Footer;
