# 🗳️ QuickPoll - Instant Opinion Collector

> Real-time polling platform built with Next.js and Appwrite for instant feedback collection and visualization.

[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Powered by Appwrite](https://img.shields.io/badge/Appwrite-Backend-f02e65?style=flat&logo=appwrite)](https://appwrite.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

- **🚀 Real-time Results** - Live vote updates using Appwrite Realtime
- **🔐 Anonymous Voting** - Privacy-first voting system
- **📱 Responsive Design** - Works seamlessly on all devices
- **⚡ Instant Setup** - Create polls in under 2 minutes
- **📊 Visual Analytics** - Animated charts and progress bars
- **🎯 Zero Registration** - Participants vote without signing up
- **🔗 Easy Sharing** - Share via URL, QR codes, or poll IDs
- **🎨 Interactive UI** - Modern, clean interface with smooth animations

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Appwrite Cloud (Database, Auth, Realtime)
- **Charts**: Chart.js with React Chart.js 2
- **Icons**: Lucide React
- **Deployment**: Vercel/Netlify + Appwrite Cloud

## 🏗️ Architecture

```
┌─────────────────────┐    ┌─────────────────────┐
│   Next.js Frontend  │    │   Appwrite Backend  │
│                     │    │                     │
│ • Poll Creator      │◄──►│ • Authentication    │
│ • Voting Interface  │    │ • Database          │
│ • Real-time Results │    │ • Realtime API      │
│ • Analytics Dashboard     │ • Cloud Functions   │
└─────────────────────┘    └─────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Git installed
- Appwrite Cloud account (free)

### 1. Clone Repository

```bash
git clone https://github.com/nikhil-amin/quickpoll-app.git
cd quickpoll-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env.local` file in the root directory:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_PROJECT_ID = your_project_id_here
NEXT_PUBLIC_APPWRITE_PROJECT_NAME = your_project_name_here
NEXT_PUBLIC_APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here  
NEXT_PUBLIC_APPWRITE_POLLS_COLLECTION_ID=your_polls_collection_id
NEXT_PUBLIC_APPWRITE_OPTIONS_COLLECTION_ID=your_options_collection_id
NEXT_PUBLIC_APPWRITE_VOTES_COLLECTION_ID=your_votes_collection_id
```

### 4. Appwrite Setup

#### Create Appwrite Project
1. Go to [Appwrite Cloud](https://cloud.appwrite.io/)
2. Create new project: `QuickPoll App`
3. Add Web Platform with hostname: `localhost`

#### Database Configuration
Create database: `QuickPollDB` with these collections:

**Collection: `polls`**
```javascript
{
  title: "string(200)" - required,
  description: "string(1000)" - optional,
  creator_id: "string(50)" - required,
  poll_type: "string(20)" - required, default: "single_choice",
  is_anonymous: "boolean" - required, default: true,
  is_public: "boolean" - required, default: true,
  expires_at: "datetime" - optional,
  status: "string(20)" - required, default: "active",
  total_votes: "integer" - required, default: 0
}
```

**Collection: `poll_options`**
```javascript
{
  poll_id: "string(50)" - required,
  text: "string(500)" - required,
  emoji: "string(10)" - optional,
  vote_count: "integer" - required, default: 0,
  order_index: "integer" - required, default: 0
}
```

**Collection: `votes`**
```javascript
{
  poll_id: "string(50)" - required,
  option_id: "string(50)" - required,
  voter_id: "string(50)" - required,
  voter_session: "string(100)" - optional,
  is_anonymous: "boolean" - required, default: false,
  timestamp: "datetime" - required
}
```

#### Permissions Setup
For each collection, set permissions:
- **Any role**: Read access
- **Users role**: Create, Read, Update, Delete access

### 5. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app!

## 📁 Project Structure

```
quickpoll-app/
├── src/
│   ├── app/
│   │   ├── page.js              # Homepage
│   │   └── poll/
│   │       └── [id]/
│   │           └── page.js      # Poll voting page
│   ├── components/
│   │   ├── PollCreator.js       # Poll creation component
│   │   └── PollVoter.js         # Voting interface component
│   └── lib/
│       └── appwrite.js          # Appwrite configuration
├── public/                      # Static assets
├── .env.local                   # Environment variables (create this)
├── package.json
├── tailwind.config.js
└── next.config.js
```

## 🎯 Usage

### Creating a Poll
1. Visit the homepage
2. Fill in poll title and options (2-10 options)
3. Configure settings (anonymous voting, expiry time)
4. Click "Create Poll"
5. Share the generated poll URL or ID

### Voting
1. Visit poll URL or enter poll ID on homepage
2. Select your preferred option
3. See real-time results immediately
4. Share poll with others

### Real-time Features
- Live vote count updates
- Instant result visualization
- Synchronized across all devices
- No page refresh needed

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
   ```bash
   npm run build
   npm run start
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style
- Use ESLint and Prettier (configured)
- Follow React best practices
- Write descriptive commit messages
- Add comments for complex logic

### Testing Your Changes
- Test poll creation flow
- Test voting from multiple devices
- Verify real-time updates work
- Check responsive design on mobile

## 🔧 Advanced Features (Future Enhancements)

- [ ] **QR Code Generation** for easy poll sharing
- [ ] **Emoji Reactions** as poll options
- [ ] **Poll Templates** for common use cases
- [ ] **Advanced Analytics** with detailed insights
- [ ] **Bulk Poll Creation** via CSV import
- [ ] **Custom Themes** and branding
- [ ] **Integration APIs** for third-party apps
- [ ] **Mobile Apps** (React Native)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Appwrite](https://appwrite.io/) for providing excellent backend services
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Chart.js](https://www.chartjs.org/) for beautiful data visualization

## 🐛 Issues & Support

Found a bug or need help?
- Check [existing issues](https://github.com/nikhil-amin/quickpoll-app/issues)
- Create a [new issue](https://github.com/nikhil-amin/quickpoll-app/issues/new)
- Join our community discussions

## 🌟 Show Your Support

If you find this project helpful, please give it a ⭐ on GitHub!
