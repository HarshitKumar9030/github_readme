'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface AIEnhancementModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onApplyEnhancement: (enhancedContent: string) => void;
  username?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

type EnhancementType = 'structure' | 'content' | 'formatting' | 'comprehensive';

interface EnhancementOption {
  id: EnhancementType;
  title: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
}

const enhancementOptions: EnhancementOption[] = [
  {
    id: 'comprehensive',
    title: 'Comprehensive Enhancement',
    description: 'Complete makeover including structure, content quality, and formatting',
    icon: '🚀',
    color: 'from-purple-500 to-pink-600',
    examples: [
      'Reorganizes entire structure',
      'Enhances all content quality',
      'Optimizes formatting & visuals',
      'Adds missing sections',
      'Professional polish'
    ]
  },
  {
    id: 'structure',
    title: 'Structure & Organization',
    description: 'Improve heading hierarchy, section order, and overall organization',
    icon: '🏗️',
    color: 'from-blue-500 to-cyan-600',
    examples: [
      'Better heading hierarchy',
      'Logical section ordering',
      'Improved navigation',
      'Clear content flow'
    ]
  },
  {
    id: 'content',
    title: 'Content Enhancement',
    description: 'Make descriptions more engaging, clear, and professional',
    icon: '✨',
    color: 'from-green-500 to-emerald-600',
    examples: [
      'More engaging descriptions',
      'Clearer explanations',
      'Professional tone',
      'Added helpful details'
    ]
  },
  {
    id: 'formatting',
    title: 'Visual & Formatting',
    description: 'Optimize markdown formatting, spacing, and GitHub compatibility',
    icon: '🎨',
    color: 'from-orange-500 to-red-600',
    examples: [
      'Better visual hierarchy',
      'GitHub-optimized formatting',
      'Improved spacing',
      'Visual elements & badges'
    ]
  }
];

const AIEnhancementModal: React.FC<AIEnhancementModalProps> = ({
  isOpen,
  onClose,
  content,
  onApplyEnhancement,
  username,
  socials
}) => {  const [selectedType, setSelectedType] = useState<EnhancementType>('comprehensive');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'markdown' | 'rendered'>('rendered');
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [processingStatus, setProcessingStatus] = useState<string>('Initializing...');
  const [enhancementComplete, setEnhancementComplete] = useState(false);
  const [stats, setStats] = useState<{ originalLength: number; enhancedLength: number } | null>(null);

  // Add state for handling copy functionality
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied'>('idle');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'downloaded'>('downloaded');
  const [processingSteps] = useState<string[]>([
    'Analyzing content structure...',
    'Identifying improvement areas...',
    'Applying AI enhancements...',
    'Optimizing formatting...',
    'Finalizing content...'
  ]);
    // Refs for scroll management
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Create deterministic particle positions for hydration consistency
  const particlePositions = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      initialX: (i * 37) % 300,
      initialY: (i * 43) % 200,
      animateX: ((i * 37) % 300) + ((i % 3) - 1) * 50,
      animateY: ((i * 43) % 200) + ((i % 4) - 1.5) * 30,
      duration: 3 + (i % 3),
      delay: (i * 0.2) % 2
    }))
  , []);
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  // Reset scroll position when switching between views
  useEffect(() => {
    if (previewContainerRef.current) {
      previewContainerRef.current.scrollTop = 0;
    }
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [showPreview, previewMode]);  const handleEnhance = async () => {
    if (!content.trim()) {
      setError('No content to enhance. Please add some content to your README first.');
      return;
    }

    console.log('🚀 Starting AI enhancement process...');
    console.log('📋 Content length:', content.length, 'characters');
    console.log('🎯 Enhancement type:', selectedType);
    console.log('👤 Username:', username);
    console.log('🌐 Socials:', socials);
    
    setIsEnhancing(true);
    setError('');
    setStats(null);
    setEnhancementComplete(false);

    let progressInterval: NodeJS.Timeout | undefined;    try {
      setProcessingStatus(processingSteps[0]);
      setProcessingStep(0);
      setProcessingProgress(10);
      
      console.log('📡 Sending request to AI API endpoint: /api/ai-enhance');      // Comprehensive widgets information for AI enhancement
      const availableWidgets = {
        'GitHub Stats Widget': {
          description: 'Dynamic GitHub statistics widget that displays real-time profile metrics including stars, commits, pull requests, issues, and contribution data.',
          features: [
            'Real-time GitHub statistics display',
            'Repository stars, forks, and watchers count',
            'Total commits, PRs, and issues metrics',
            'Contribution streak tracking',
            'Profile views and follower count',
            'Language statistics integration',
            'Trophy and achievement system',
            'Customizable card layouts and themes'
          ],
          themes: ['default', 'dark', 'radical', 'merko', 'gruvbox', 'tokyonight', 'onedark', 'cobalt', 'synthwave', 'highcontrast', 'dracula'],
          layouts: ['default', 'compact', 'grid'],
          useCases: [
            'Showcasing GitHub activity and contributions',
            'Highlighting open source involvement',
            'Displaying coding consistency and streaks',
            'Professional portfolio statistics'
          ],
          markdownExample: `![GitHub Stats](https://github-readme-stats.vercel.app/api?username=USERNAME&show_icons=true&theme=radical&count_private=true)`,
          customization: {
            'show_icons': 'Display icons for each statistic',
            'count_private': 'Include private repository contributions',
            'theme': 'Visual theme selection from 11+ options',
            'hide': 'Hide specific stats (stars, commits, prs, issues)',
            'show_owner': 'Show repository owner in stats'
          }
        },
        'Top Languages Widget': {
          description: 'Visual representation of programming languages used across repositories with beautiful charts and customizable layouts.',
          features: [
            'Programming language distribution analysis',
            'Percentage-based language breakdown',
            'Repository language scanning',
            'Multiple chart layout options',
            'Custom color themes and styling',
            'Language filtering and exclusion',
            'Compact and detailed view modes'
          ],
          themes: ['default', 'dark', 'radical', 'merko', 'gruvbox', 'tokyonight', 'onedark', 'cobalt', 'synthwave', 'highcontrast', 'dracula'],
          layouts: ['compact', 'normal', 'donut', 'donut-vertical', 'pie'],
          useCases: [
            'Showcasing technical skill diversity',
            'Highlighting primary programming languages',
            'Demonstrating technology stack expertise',
            'Portfolio language proficiency display'
          ],
          markdownExample: `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=USERNAME&layout=compact&theme=radical&hide=html,css)`,
          customization: {
            'layout': 'Chart layout (compact, normal, donut, pie)',
            'langs_count': 'Number of languages to display (default: 5)',
            'hide': 'Exclude specific languages from display',
            'exclude_repo': 'Exclude specific repositories from analysis',
            'card_width': 'Customize card width in pixels'
          }
        },
        'Repository Showcase Widget': {
          description: 'Feature-rich repository cards that highlight your best projects with stats, descriptions, topics, and customizable layouts.',
          features: [
            'Repository information cards',
            'Star, fork, and issue count display',
            'Language and topic tag visualization',
            'Repository description preview',
            'Last update timestamp',
            'Multiple card layout options',
            'Custom sorting capabilities',
            'Repository filtering by criteria'
          ],
          layouts: ['default', 'compact', 'grid', 'horizontal', 'vertical'],
          sortOptions: ['stars', 'forks', 'updated', 'created', 'pushed', 'name', 'size'],
          useCases: [
            'Highlighting flagship projects',
            'Showcasing repository statistics',
            'Creating project portfolio sections',
            'Demonstrating coding activity and maintenance'
          ],
          markdownExample: `[![Repo Card](https://github-readme-stats.vercel.app/api/pin/?username=USERNAME&repo=REPO_NAME&theme=radical)](https://github.com/USERNAME/REPO_NAME)`,
          customization: {
            'show_owner': 'Display repository owner',
            'theme': 'Visual theme selection',
            'show_description': 'Show repository description',
            'show_language': 'Display primary language',
            'border_radius': 'Card border radius customization'
          }
        },
        'Contribution Graph Widget': {
          description: 'GitHub-style contribution activity visualization with customizable themes, multiple chart types, and detailed activity tracking.',
          features: [
            'GitHub contribution calendar visualization',
            'Activity heatmap display',
            'Commit frequency tracking',
            'Multiple visualization styles',
            'Custom theme support',
            'Year-over-year comparison',
            'Streak and consistency metrics',
            'Interactive hover details'
          ],
          themes: ['github', 'github_dark', 'radical', 'react', 'vue', 'dracula', 'tokyo_night', 'monokai', 'synthwave', 'cobalt', 'discord'],
          layouts: ['default', 'compact', 'grid'],
          useCases: [
            'Visualizing coding consistency',
            'Showcasing long-term commitment',
            'Highlighting contribution patterns',
            'Demonstrating development activity'
          ],
          markdownExample: `![Contribution Graph](https://github-readme-activity-graph.vercel.app/graph?username=USERNAME&theme=radical&area=true&hide_border=true)`,
          customization: {
            'theme': 'Color scheme selection',
            'area': 'Fill area under the graph',
            'hide_border': 'Remove border around graph',
            'bg_color': 'Custom background color',
            'color': 'Custom graph line color'
          }
        },
        'Social Stats Widget': {
          description: 'Professional social media integration with beautiful badges, platform links, and customizable styling for building online presence.',
          features: [
            'Social platform badge generation',
            'Professional profile linking',
            'Multiple badge style options',
            'Platform-specific icons and colors',
            'Grid and list layout options',
            'Custom badge text and colors',
            'Click-through analytics support',
            'Mobile-responsive design'
          ],
          platforms: ['GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'YouTube', 'Discord', 'Telegram', 'WhatsApp', 'Stack Overflow', 'Dev.to', 'Medium'],
          badgeStyles: ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'],
          useCases: [
            'Professional networking display',
            'Social media portfolio integration',
            'Contact information showcase',
            'Building online brand presence'
          ],
          markdownExample: `[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/USERNAME)`,
          customization: {
            'style': 'Badge visual style selection',
            'logo': 'Platform logo inclusion',
            'logoColor': 'Custom logo color',
            'color': 'Custom badge background color',
            'labelColor': 'Custom label background color'
          }
        },
        'Animated Progress Widget': {
          description: 'Custom skill visualization with animated progress bars, skill ratings, and beautiful color gradients for showcasing technical abilities.',
          features: [
            'Animated skill progress bars',
            'Custom skill categories and levels',
            'Gradient color schemes',
            'Animation timing control',
            'Progress percentage display',
            'Skill grouping and categorization',
            'Interactive hover effects',
            'Mobile-responsive layouts'
          ],
          customizable: [
            'Skill names and categories',
            'Progress levels (0-100%)',
            'Color schemes and gradients',
            'Animation duration and easing',
            'Bar height and spacing',
            'Font and text styling'
          ],
          useCases: [
            'Technical skill demonstration',
            'Programming language proficiency',
            'Tool and framework experience',
            'Professional competency showcase'
          ],
          markdownExample: `<img src="https://skillicons.dev/icons?i=js,ts,react,nodejs,python,java&theme=dark" />`,
          animationOptions: {
            'duration': 'Animation speed (1-10 seconds)',
            'easing': 'Animation curve (linear, ease, bounce)',
            'delay': 'Staggered animation delay',
            'loop': 'Continuous animation loop'
          }
        },
        'Wave Animation Widget': {
          description: 'Dynamic SVG wave animations for adding visual appeal and modern aesthetics to profile sections with customizable patterns.',
          features: [
            'Smooth SVG wave animations',
            'Multiple wave pattern styles',
            'Custom color gradients',
            'Animation speed control',
            'Wave amplitude and frequency adjustment',
            'Responsive design compatibility',
            'Overlay and background modes',
            'CSS animation integration'
          ],
          customizable: [
            'Wave colors and gradients',
            'Animation speed and direction',
            'Wave count and amplitude',
            'Container dimensions',
            'Opacity and blend modes',
            'Pattern complexity'
          ],
          useCases: [
            'Profile header decoration',
            'Section divider animations',
            'Background visual enhancement',
            'Modern aesthetic appeal'
          ],
          markdownExample: `<img src="https://github.com/USERNAME/USERNAME/blob/main/assets/wave.svg" width="100%" />`,
          waveTypes: [
            'Sine waves', 'Cosine patterns', 'Complex harmonics', 'Layered waves', 'Gradient fills'
          ]
        },
        'Language Chart Widget': {
          description: 'Interactive programming language distribution visualizations with multiple chart types, custom colors, and detailed statistics.',
          features: [
            'Multiple chart type support',
            'Language percentage calculations',
            'Interactive pie and donut charts',
            'Bar chart representations',
            'Custom color palettes',
            'Language filtering options',
            'Repository inclusion/exclusion',
            'Export and embedding options'
          ],
          chartTypes: ['donut', 'pie', 'horizontal-bar', 'vertical-bar', 'treemap'],
          customizable: [
            'Chart type selection',
            'Color scheme customization',
            'Language count limits',
            'Percentage thresholds',
            'Chart dimensions',
            'Legend positioning'
          ],
          useCases: [
            'Technical portfolio visualization',
            'Programming language expertise',
            'Technology stack demonstration',
            'Skill diversity showcase'
          ],
          markdownExample: `![Language Chart](https://github-readme-stats.vercel.app/api/top-langs/?username=USERNAME&layout=donut&theme=radical)`,
          chartOptions: {
            'layout': 'Chart layout style',
            'langs_count': 'Number of languages to include',
            'hide': 'Languages to exclude from chart',
            'theme': 'Visual theme selection'
          }        }
      };

      const requestBody = {
        content,
        enhancementType: selectedType,
        username,
        socials,
        availableWidgets
      };
      
      console.log('📦 Request body prepared:', {
        contentLength: content.length,
        enhancementType: selectedType,
        hasUsername: !!username,
        hasSocials: !!socials
      });

      const startTime = Date.now();
      progressInterval = setInterval(() => {
        setProcessingStep(prev => {
          const newStep = Math.min(prev + 1, processingSteps.length - 1);
          setProcessingStatus(processingSteps[newStep]);
          setProcessingProgress(Math.min((newStep + 1) * 20, 80)); // Cap at 80% until we get real response
          return newStep;
        });
      }, 2000);
      
      const response = await fetch('/api/ai-enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const endTime = Date.now();
      const requestDuration = endTime - startTime;
      
      console.log('📨 Received response in', requestDuration, 'ms');
      console.log('📊 Response status:', response.status);
      console.log('📄 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error('❌ Response not OK. Status:', response.status);
        let errorData;
        try {
          errorData = await response.json();
          console.error('❌ Error response body:', errorData);
        } catch (parseError) {
          console.error('❌ Could not parse error response:', parseError);
          const errorText = await response.text();
          console.error('❌ Raw error response:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText || 'Unknown error'}`);
        }
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to enhance README`);
      }

      console.log('✅ Response OK, parsing JSON...');
      const responseData = await response.json();
      console.log('📄 Response data keys:', Object.keys(responseData));
      
      const { enhancedContent: enhanced, originalLength, enhancedLength } = responseData;
        console.log('✅ Enhancement complete!');
      console.log('📊 Stats:', { 
        originalLength: originalLength || content.length, 
        enhancedLength: enhancedLength || enhanced?.length || 0,
        enhancementRatio: enhanced ? (enhanced.length / content.length).toFixed(2) : 'N/A'
      });
      console.log('📝 Enhanced content preview (first 200 chars):', enhanced?.substring(0, 200) + '...');
      
      if (!enhanced) {
        throw new Error('No enhanced content received from API');
      }
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      setProcessingStatus('Enhancement complete!');
      setProcessingStep(processingSteps.length - 1);
      setProcessingProgress(100);
      
      setEnhancedContent(enhanced);
      setStats({ 
        originalLength: originalLength || content.length, 
        enhancedLength: enhancedLength || enhanced.length 
      });
      setEnhancementComplete(true);
      
      console.log('⏳ Showing preview in 500ms...');
      setTimeout(() => {
        console.log('👁️ Displaying preview');
        setShowPreview(true);
      }, 500);    } catch (err) {
      console.error('💥 Enhancement failed with error:', err);
      console.error('🔍 Error details:', {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : 'No stack trace'
      });      // Clear the progress update interval if it exists
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      setProcessingStatus('Enhancement failed');
      setProcessingProgress(0);
      
      let userFriendlyMessage = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        if (err.message.includes('API key')) {
          userFriendlyMessage = 'AI service configuration error. Please check if the API key is set up correctly.';
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          userFriendlyMessage = 'Network error. Please check your internet connection and try again.';
        } else if (err.message.includes('timeout')) {
          userFriendlyMessage = 'Request timed out. The AI service might be busy, please try again.';
        } else if (err.message.includes('400')) {
          userFriendlyMessage = 'Invalid request. Please check your content and try again.';
        } else if (err.message.includes('429')) {
          userFriendlyMessage = 'Too many requests. Please wait a moment before trying again.';
        } else if (err.message.includes('500')) {
          userFriendlyMessage = 'Server error. Please try again later.';
        } else {
          userFriendlyMessage = err.message;
        }
      }
      
      setError(userFriendlyMessage);
    } finally {
      console.log('🏁 Enhancement process finished');
      setIsEnhancing(false);
    }
  };
  // Add copy and download functions
  const handleCopyContent = async () => {
    if (!enhancedContent) return;
    
    setCopyStatus('copying');
    try {
      await navigator.clipboard.writeText(enhancedContent);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 3000);
    } catch (err) {
      console.error('Failed to copy content:', err);
      setCopyStatus('idle');
    }
  };

  const handleDownloadContent = () => {
    if (!enhancedContent) return;
    
    setDownloadStatus('downloading');
    try {
      const blob = new Blob([enhancedContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'enhanced-README.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDownloadStatus('downloaded');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    } catch (err) {
      console.error('Failed to download content:', err);
      setDownloadStatus('idle');
    }
  };

  const handleApply = () => {
    if (enhancedContent) {
      onApplyEnhancement(enhancedContent);
      onClose();
    }
  };

  const handleStartOver = () => {
    setShowPreview(false);
    setEnhancedContent('');
    setStats(null);
    setError('');
    setEnhancementComplete(false);
    setProcessingProgress(0);
    setProcessingStep(0);
    setProcessingStatus('');
    setCopyStatus('idle');
    setDownloadStatus('idle');
  };

  const handleCloseModal = () => {
    // Reset all states when closing
    setShowPreview(false);
    setEnhancedContent('');
    setStats(null);
    setError('');
    setEnhancementComplete(false);
    setProcessingProgress(0);
    setProcessingStep(0);
    setProcessingStatus('');
    setCopyStatus('idle');
    setDownloadStatus('idle');
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Enhancement Processing Overlay */}
      <AnimatePresence>
        {isEnhancing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-md z-10 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-white text-center max-w-md mx-4 shadow-2xl"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity }
                }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-full flex items-center justify-center text-3xl shadow-lg"
              >
                🤖
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                AI Enhancement in Progress
              </h3>
              <p className="text-white/90 mb-4 text-lg font-medium">
                {processingStatus}
              </p>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden mb-3 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                  initial={{ width: "0%" }}
                  animate={{ width: `${processingProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
              <div className="flex justify-between text-sm text-white/70 mb-6">
                <span className="font-medium">Step {processingStep + 1} of {processingSteps.length}</span>
                <span className="font-medium">{processingProgress}%</span>
              </div>
              <motion.div
                className="flex justify-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col backdrop-blur-sm"
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)' 
        }}
      >{/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 text-white p-6 relative overflow-hidden">
          {/* Enhanced animated background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient orbs */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-tl from-pink-300/20 to-transparent rounded-full blur-2xl"></div>
              {/* Floating particles */}
            {particlePositions.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                initial={{
                  x: particle.initialX,
                  y: particle.initialY,
                  opacity: 0
                }}
                animate={{
                  x: particle.animateX,
                  y: particle.animateY,
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Animated lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10">
              <defs>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="50%" stopColor="white" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[...Array(5)].map((_, i) => (
                <motion.line
                  key={i}
                  x1="0"
                  y1={20 + i * 15}
                  x2="100%"
                  y2={20 + i * 15}
                  stroke="url(#line-gradient)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </svg>
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative"
                animate={isEnhancing ? { 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                } : {}}
                transition={isEnhancing ? { 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity }
                } : {}}
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                  <span className="text-2xl">🤖</span>
                </div>
                {isEnhancing && (
                  <div className="absolute inset-0 rounded-xl bg-white/10 animate-pulse"></div>
                )}
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
                  AI README Enhancement
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/90 text-sm font-medium">Powered by Gemini Flash 2.5</span>
                  </div>
                  <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                  <span className="text-white/70 text-xs">Advanced AI Writing Assistant</span>
                </div>
              </div>
            </div>            <motion.button
              onClick={handleCloseModal}
              className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 group backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>        <div className="flex-1 overflow-hidden relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" ref={modalContentRef}>
          {/* Subtle background pattern */}          <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]">
            <svg width="40" height="40" viewBox="0 0 40 40" className="w-full h-full">
              <defs>
                <pattern id="subtle-dots" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#subtle-dots)" />
            </svg>
          </div>
          
          {!showPreview ? (
            /* Enhanced Enhancement Options */
            <div className="relative z-10 h-full">
              <div className="h-full overflow-y-auto custom-scrollbar">
                <div className="p-8 pb-24">
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">✨</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Choose Enhancement Type
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                      Select how you&apos;d like AI to improve your README content. Each option uses advanced AI to enhance different aspects of your documentation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {enhancementOptions.map((option) => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                          selectedType === option.id
                            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 shadow-lg shadow-purple-500/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800/50 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50'
                        }`}
                        onClick={() => setSelectedType(option.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                            {option.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                              {option.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                              {option.description}
                            </p>
                            <ul className="space-y-2">
                              {option.examples.map((example, index) => (
                                <motion.li 
                                  key={index} 
                                  className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0"></div>
                                  {example}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {selectedType === option.id && (
                          <motion.div
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                          >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                    >
                      <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium block">Enhancement Error</span>
                          <span className="text-sm opacity-90">{error}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Fixed bottom panel for enhancement button */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">📊</span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Current content</div>
                      <div className="font-bold text-lg text-gray-900 dark:text-white">
                        {content.length.toLocaleString()} characters
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleEnhance}
                    disabled={isEnhancing || !content.trim()}
                    className={`px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      isEnhancing ? 'animate-pulse' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isEnhancing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">✨</span>
                        <span>Enhance with AI</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            /* Enhanced Preview */
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">🎉</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Enhanced README Preview
                      </h3>
                      {stats && (
                        <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                          <span>Expanded from</span>
                          <span className="font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-sm">
                            {stats.originalLength.toLocaleString()}
                          </span>
                          <span>to</span>
                          <span className="font-semibold bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-sm">
                            {stats.enhancedLength.toLocaleString()}
                          </span>
                          <span>characters</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-inner">
                      <motion.button
                        onClick={() => setPreviewMode('rendered')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                          previewMode === 'rendered'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>👁️</span>
                        Preview
                      </motion.button>
                      <motion.button
                        onClick={() => setPreviewMode('markdown')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                          previewMode === 'markdown'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>📝</span>
                        Markdown
                      </motion.button>                    </div>
                    
                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={handleStartOver}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>←</span>
                        Back
                      </motion.button>
                      
                      <motion.button
                        onClick={handleApply}
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>✅</span>
                        Apply Enhancement
                      </motion.button>

                      {/* Copy Button */}
                      <motion.button
                        onClick={handleCopyContent}
                        disabled={copyStatus === 'copying'}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: copyStatus === 'copying' ? 1 : 1.05 }}
                        whileTap={{ scale: copyStatus === 'copying' ? 1 : 0.95 }}
                      >
                        {copyStatus === 'copying' ? (
                          <>
                            <span className="animate-spin">⏳</span>
                            Copying...
                          </>
                        ) : copyStatus === 'copied' ? (
                          <>
                            <span>✅</span>
                            Copied!
                          </>
                        ) : (
                          <>
                            <span>📋</span>
                            Copy
                          </>
                        )}
                      </motion.button>

                      {/* Download Button */}
                      <motion.button
                        onClick={handleDownloadContent}
                        disabled={downloadStatus === 'downloading'}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: downloadStatus === 'downloading' ? 1 : 1.05 }}
                        whileTap={{ scale: downloadStatus === 'downloading' ? 1 : 0.95 }}
                      >
                        {downloadStatus === 'downloading' ? (
                          <>
                            <span className="animate-spin">⏳</span>
                            Downloading...
                          </>
                        ) : downloadStatus === 'downloaded' ? (
                          <>
                            <span>✅</span>
                            Downloaded!
                          </>
                        ) : (
                          <>
                            <span>📥</span>
                            Download
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                ref={previewContainerRef}
                className="flex-1 overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mx-6 mb-6 rounded-2xl shadow-lg"
              >
                <div className="h-full overflow-auto custom-scrollbar">
                  {previewMode === 'markdown' ? (
                    <div className="h-full p-6">
                      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">README.md</span>
                        <span>•</span>
                        <span>{enhancedContent.split('\n').length} lines</span>
                        <span>•</span>
                        <span>{enhancedContent.length} characters</span>
                      </div>
                      <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono leading-relaxed">
                        {enhancedContent}
                      </pre>
                    </div>
                  ) : (
                    <div className="h-full p-6 prose prose-gray dark:prose-invert max-w-none prose-sm">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          img: ({ src, alt, ...props }) => (
                            // Using img instead of Image for compatibility
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={src}
                              alt={alt || ''}
                              className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                              {...props}
                            />
                          ),
                          a: ({ href, children, ...props }) => (
                            <a
                              href={href}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 hover:decoration-blue-500 transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props}
                            >
                              {children}
                            </a>
                          ),
                          code: ({ className, children, ...props }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200 dark:border-gray-700" {...props}>
                                {children}
                              </code>
                            ) : (
                              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl overflow-x-auto border border-gray-200 dark:border-gray-700 shadow-inner">
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            );
                          },
                          h1: ({ children, ...props }) => (
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2" {...props}>
                              {children}
                            </h1>
                          ),
                          h2: ({ children, ...props }) => (
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 mt-6" {...props}>
                              {children}
                            </h2>
                          ),
                          h3: ({ children, ...props }) => (
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-4" {...props}>
                              {children}
                            </h3>
                          ),
                          blockquote: ({ children, ...props }) => (
                            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg my-4" {...props}>
                              {children}
                            </blockquote>
                          ),
                          table: ({ children, ...props }) => (
                            <div className="overflow-x-auto">
                              <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" {...props}>
                                {children}
                              </table>
                            </div>
                          ),
                          th: ({ children, ...props }) => (
                            <th className="bg-gray-50 dark:bg-gray-800 px-3 py-2 text-left font-semibold border-b border-gray-200 dark:border-gray-700" {...props}>
                              {children}
                            </th>
                          ),
                          td: ({ children, ...props }) => (
                            <td className="px-3 py-2 border-b border-gray-200 dark:border-gray-700" {...props}>
                              {children}
                            </td>
                          ),
                        }}
                      >
                        {enhancedContent}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>

              <motion.div 
                className="flex-shrink-0 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-t border-blue-200 dark:border-blue-800 mx-6 mb-6 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold block">Ready to Apply Enhancement</span>
                    <span className="text-sm opacity-90">
                      This enhancement will replace your current README content. You can always undo using Ctrl+Z.
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AIEnhancementModal;
