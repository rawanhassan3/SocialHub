# SocialHub - Modern Social Media Platform

SocialHub is a premium, full-featured social media web application built with **React 19**, **Vite**, and **Tailwind CSS**. It offers a seamless user experience with real-time updates, rich media support, and a sleek, responsive design that supports both light and dark modes.

![SocialHub Preview](https://via.placeholder.com/1200x600.png?text=SocialHub+Platform+Preview)

## 🚀 Key Features

### 📡 Dynamic Feed & Posts
- **Interactive Feed**: Explore a centralized feed with smooth scrolling and dynamic loading.
- **Rich Post Creation**: Create posts with both text and high-quality images.
- **Emoji Support**: Native emoji picker for both posts and comments to enhance expression.
- **Post Actions**: Edit, delete, and manage your own posts with instantaneous UI updates.
- **Sharing Mechanism**: Repost and share content from others with proper attribution.

### 💬 Engagement & Social
- **Likes System**: Optimistic UI updates for liking posts and comments.
- **Nested Comments**: Robust commenting system with support for threaded replies.
- **Reply Loading**: Lazy-loading for replies to keep the interface fast and clean.

### 👤 Profile & Privacy
- **Personal Profile**: Dedicated profile pages featuring cover photos and user-specific feeds.
- **Avatar Management**: Upload and update profile photos directly within the app.
- **Security**: Secure account management including password reset and update functionality.

### 🎨 Modern UI/UX
- **Responsive Grid**: Multi-column layouts tailored for mobile, tablet, and desktop screens.
- **Dark Mode**: Fully integrated dark theme support for comfortable late-night browsing.
- **Glassmorphism & Shadows**: Premium aesthetics using modern CSS techniques and HeroUI components.
- **Micro-animations**: Smooth transitions and hover effects powered by Framer Motion.

## 🛠️ Technology Stack

- **Core**: React 19, Vite
- **Styling**: Tailwind CSS 4, Vanilla CSS
- **UI Components**: HeroUI (formerly NextUI), Framer Motion
- **State & Forms**: Context API, React Hook Form, Zod
- **Networking**: Axios
- **Routing**: React Router DOM

## 🏁 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd reactapp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📂 Project Structure

```text
src/
├── components/      # Reusable UI components (Post, Navbar, etc.)
├── contexts/        # Auth and Global State Management
├── pages/           # High-level route components (Feed, Profile, Signin)
├── assets/          # Static images and global styles
└── App.jsx          # Main application routing and configuration
```

## 🤝 Contributing

Contributions are welcome! If you'd like to improve SocialHub, please feel free to fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License.

---
*Built with ❤️ for a better social experience.*
