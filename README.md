# 🚀 GitHub README Generator

<div align="center">

![GitHub README Generator](https://img.shields.io/badge/GitHub-README%20Generator-blue?style=for-the-badge&logo=github)
![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)

**Create stunning GitHub README profiles in minutes with our intuitive, feature-rich generator**

[🌟 Live Demo](https://github-readme-harshit.vercel.app) • [📚 Documentation](https://github-readme-harshit.vercel.app/documentation) • [🎨 Templates](https://github-readme-harshit.vercel.app/templates) • [💬 Feedback](https://github-readme-harshit.vercel.app/feedback)

</div>

---

## ✨ Features

### 🎨 **Professional Templates**
- **50+ Premium Templates** - Choose from a vast collection of professionally designed templates
- **Category-Specific Designs** - Templates for developers, data scientists, designers, and more
- **One-Click Application** - Apply templates instantly with live preview
- **Regular Updates** - New designs added frequently

### 🛠️ **Advanced Customization**
- **Drag & Drop Interface** - Reorder sections effortlessly
- **Custom Color Schemes** - Personalize your README with brand colors
- **Widget Integration** - Add GitHub stats, language charts, and activity graphs
- **Markdown Editor** - Advanced editing capabilities for power users

### 👀 **Real-Time Preview**
- **Instant Visual Feedback** - See changes as you type
- **Multi-Device Preview** - Mobile and desktop responsive views
- **Dark/Light Mode** - Toggle between themes
- **GitHub-Accurate Rendering** - Exact GitHub markdown preview

### 📤 **Seamless Export**
- **One-Click GitHub Integration** - Direct repository updates
- **Multiple Export Formats** - Markdown, HTML, and more
- **Copy with Formatting** - Preserve all styling and layout
- **Shareable Preview Links** - Collaborate with team members

### 🤖 **AI-Powered Enhancement**
- **Gemini Flash 2.5 Integration** - Powered by Google's latest AI model
- **Intelligent Content Enhancement** - Automatically improve descriptions and structure
- **Multiple Enhancement Types** - Choose from comprehensive, structure, content, or formatting improvements
- **Real-Time Preview** - See enhanced content in both markdown and rendered views
- **Smart Personalization** - AI considers your GitHub profile and social links for context

---

## 🏗️ Tech Stack

<div align="center">

| Frontend | Backend | Database | Deployment |
|----------|---------|----------|------------|
| ![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js) | ![API Routes](https://img.shields.io/badge/API%20Routes-gray?style=flat-square&logo=next.js) | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb) | ![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript) | ![Edge Runtime](https://img.shields.io/badge/Edge%20Runtime-000?style=flat-square) | ![Upstash](https://img.shields.io/badge/Upstash-00E9A3?style=flat-square) | ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=github-actions) |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss) | ![SVG Generation](https://img.shields.io/badge/SVG%20Generation-FFB13B?style=flat-square) | | |
| ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=framer) | ![GitHub API](https://img.shields.io/badge/GitHub%20API-181717?style=flat-square&logo=github) | | |

</div>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **pnpm** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshitkumar9030/github_readme.git
   cd github_readme
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GITHUB_TOKEN=your_github_personal_access_token
   NEXTAUTH_SECRET=your_nextauth_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
github_readme/
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router
│   │   ├── 📂 api/               # API endpoints
│   │   │   ├── github-stats-svg/ # GitHub statistics API
│   │   │   ├── language-chart/   # Language chart API
│   │   │   ├── repo-showcase/    # Repository showcase API
│   │   │   └── ...              # Other APIs
│   │   ├── 📂 create/           # README builder interface
│   │   ├── 📂 documentation/    # Comprehensive docs
│   │   ├── 📂 templates/        # Template gallery
│   │   └── 📂 feedback/         # User feedback system
│   ├── 📂 components/           # Reusable UI components
│   ├── 📂 widgets/             # Interactive GitHub widgets
│   ├── 📂 services/            # External service integrations
│   └── 📂 utils/               # Utility functions
├── 📂 public/                  # Static assets
└── 📋 Configuration files
```

---

## 🎯 API Reference

Our public APIs provide programmatic access to generate dynamic SVG widgets:

### GitHub Statistics
```http
GET /api/github-stats-svg?username=octocat&theme=dark&layout=compact
```

### Language Chart
```http
GET /api/language-chart?username=octocat&langs_count=8
```

### Repository Showcase
```http
GET /api/repo-showcase?username=octocat&repo=Hello-World&theme=radical
```

### Animated Progress Bars
```http
GET /api/animated-progress?skills=JavaScript,Python,React&values=90,85,80&theme=gradient
```

### AI Enhancement
```http
POST /api/ai-enhance
Content-Type: application/json

{
  "content": "Your README content",
  "enhancementType": "comprehensive|structure|content|formatting",
  "username": "your-github-username",
  "socials": { "github": "...", "linkedin": "..." }
}
```

**[📖 Full API Documentation](https://github-readme-harshit.vercel.app/documentation)**

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🐛 Bug Reports
Found a bug? Please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### 💡 Feature Requests
Have an idea? We'd love to hear it! Include:
- Detailed description of the feature
- Use cases and benefits
- Mockups or examples if possible

### 🔧 Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### 📋 Development Guidelines
- Follow the existing code style
- Add TypeScript types for new features
- Include tests for new functionality
- Update documentation as needed

---

## 📊 Project Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/harshitkumar9030/github_readme?style=social)
![GitHub forks](https://img.shields.io/github/forks/harshitkumar9030/github_readme?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/harshitkumar9030/github_readme?style=social)

![GitHub issues](https://img.shields.io/github/issues/harshitkumar9030/github_readme)
![GitHub pull requests](https://img.shields.io/github/issues-pr/harshitkumar9030/github_readme)
![GitHub last commit](https://img.shields.io/github/last-commit/harshitkumar9030/github_readme)

</div>

---

## 🏆 Showcase

<div align="center">

### ⭐ Featured Community Love

> *"Absolutely mind-blowing! 🤯 This GitHub README generator transformed my boring profile into a stunning showcase that actually reflects my personality as a developer. The drag-and-drop interface is incredibly intuitive, and the real-time preview feature saved me hours of trial and error. What really impressed me was the variety of professional templates - I went from a blank profile to having my friends asking me about it! The animated widgets and custom SVG integrations are pure magic. This tool doesn't just create READMEs; it creates digital portfolios that tell your story. Harshit, you've built something truly exceptional here! 🚀✨"*
>
> **— Viraj Datta**  
> *Web Dev & Open Source Enthusiast*

</div>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment platform
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Community Contributors** for their valuable feedback and contributions

---

## 📞 Support

Need help? We're here for you!

- 📚 **[Documentation](https://github-readme-harshit.vercel.app/documentation)** - Comprehensive guides and tutorials
- 💬 **[GitHub Discussions](https://github.com/harshitkumar9030/github_readme/discussions)** - Community Q&A
- 🐛 **[Issue Tracker](https://github.com/harshitkumar9030/github_readme/issues)** - Bug reports and feature requests
- 📧 **[Contact](mailto:harshitkumar9030@gmail.com)** - Direct support

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Harshit Kumar](https://github.com/harshitkumar9030)

</div>
