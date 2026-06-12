# 🌍 Carbon Footprint Tracker - Premium Website

A modern, interactive, and fully responsive website for tracking and reducing your carbon footprint. Built with premium UI/UX design, smooth animations, and engaging micro-interactions.

## ✨ Features

### 🎯 Core Features
- **Carbon Calculator**: Advanced algorithm to calculate your monthly carbon footprint
- **Dashboard Analytics**: Real-time visualizations of your carbon emissions and progress
- **Eco Tips**: Daily environmental tips and sustainable living recommendations
- **Goal Tracking**: Set and achieve sustainability goals with milestone tracking
- **AI-Powered Recommendations**: Personalized suggestions for reducing carbon footprint
- **Rewards System**: Earn badges and rewards for reaching sustainability milestones
- **Community Challenges**: Join challenges with other eco-conscious users
- **Smart Alerts**: Get notified about carbon spikes and receive recommendations

### 🎨 Design & Animation
- **Premium UI Design**: Modern, minimal, and futuristic aesthetic
- **Smooth Animations**: GSAP-quality entrance animations and transitions
- **Glassmorphism Effects**: Modern glass effect with backdrop blur
- **Responsive Design**: Fully responsive for desktop, tablet, and mobile
- **Interactive Elements**: Magnetic buttons, hover effects, and ripple animations
- **Smooth Scrolling**: Lenis scroll with parallax and scroll-triggered animations
- **Floating Elements**: Animated particles and floating leaves
- **3D Effects**: Card tilt effects and perspective transforms

### 🎭 Color Palette
- **Primary Green**: #16A34A
- **Secondary Green**: #22C55E
- **Accent Cyan**: #06B6D4
- **Light Background**: #F8FAFC
- **Dark Background**: #1E293B
- **Dark Gradient**: Slate-900 to Emerald-900

## 📁 Project Structure

```
carbontrack/
├── index.html          # Main HTML file with all sections
├── styles.css          # Custom CSS with animations
├── script.js           # JavaScript for interactivity
└── README.md           # This file
```

## 🚀 Quick Start

### 1. Open Locally
Simply open `index.html` in your web browser. No installation required!

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (http-server)
npx http-server
```

### 2. Deploy Online
You can deploy this website to any hosting service:

#### Netlify (Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `carbontrack` folder
3. Your site is live!

#### Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project" and import the folder
3. Deploy with one click

#### GitHub Pages
1. Create a GitHub repository
2. Push the files to the `main` branch
3. Go to Settings > Pages > Source: Deploy from branch
4. Your site is live at `https://yourusername.github.io/carbontrack`

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with custom animations
- **JavaScript**: Pure vanilla JavaScript
- **Tailwind CSS**: Utility-first CSS framework (via CDN)

### Libraries & Frameworks
- **GSAP 3.12**: Professional animation library
- **ScrollTrigger**: Scroll-based animations
- **Lenis**: Smooth scrolling library
- **Lottie**: Light animations (optional)
- **Font Awesome 6.4**: Icon library
- **Google Fonts**: Poppins & Inter fonts

## 🎯 Website Sections

### 1. Navigation Bar
- Transparent navigation that becomes solid on scroll
- Animated leaf icon logo
- Smooth navigation links with animated underlines
- Responsive mobile menu

### 2. Hero Section
- Full-screen landing with animated gradients
- Floating leaves and particle effects
- Large animated heading
- Two premium CTA buttons
- Scroll indicator animation

### 3. About Section
- Carbon footprint explanation
- Two-column layout with animations
- Statistics cards with counters
- Image reveal effects

### 4. Carbon Calculator
- Beautiful glassmorphism form
- Real-time calculation
- Animated circular progress
- CO₂ equivalent display

### 5. Dashboard Preview
- Premium cards with real-time stats
- Animated charts and counters
- Monthly trend visualization
- Progress tracking

### 6. Personalized Recommendations
- AI-style recommendation cards
- Six key recommendations for sustainability
- Impact level indicators
- Hover animations

### 7. Eco Tips Section
- Horizontal scrolling cards
- Daily environmental tips
- Animations and hover effects
- Practical advice cards

### 8. Features Section
- 8 feature cards with icons
- Smooth hover animations
- Feature descriptions
- Scale and rotation effects

### 9. Testimonials
- User success stories
- 5-star ratings
- Avatar circles
- Sliding animations

### 10. FAQ Section
- Accordion-style FAQ
- Smooth open/close animations
- 5 common questions answered
- Chevron rotation animations

### 11. Contact Section
- Contact form with validation
- Contact information cards
- Social media links
- Hover effects

### 12. Newsletter Section
- Email subscription form
- Gradient background
- Call-to-action

### 13. Footer
- Comprehensive footer links
- Contact information
- Social media links
- Copyright information

## 🎨 Animations & Effects

### Entrance Animations
- Fade in up
- Fade in down
- Scale in
- Slide in left/right
- Stagger animations

### Scroll Effects
- Scroll-triggered animations
- Parallax backgrounds
- Smooth scrolling with Lenis
- Horizontal scrolling sections
- Sticky navigation

### Interactive Effects
- Magnetic buttons
- Ripple click effects
- Card tilt on hover
- Gradient borders
- Glassmorphism hover
- Button scale animations
- Icon rotation
- Text animations

### Micro-Interactions
- Animated counters
- Progress bar animations
- Toggle animations
- Form focus effects
- Button hover states
- Smooth transitions

## ⚙️ Configuration

### Carbon Emission Factors
Edit emission factors in `script.js` (line ~180):

```javascript
const emissionFactors = {
    transport: 0.21,    // kg CO2 per km
    electricity: 0.5,   // kg CO2 per kWh
    food: 5,           // kg CO2 per kg meat
    waste: 0.5,        // kg CO2 per kg
};
```

### Color Customization
Edit colors in `styles.css` or `styles.css`:

```css
:root {
    --primary-color: #16A34A;
    --secondary-color: #22C55E;
    --accent-color: #06B6D4;
}
```

### Animation Duration
Adjust animation speeds in `script.js`:

```javascript
duration: 0.8,  // in seconds
stagger: 0.1,   // between each element
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

All elements are optimized for each breakpoint with appropriate sizing and spacing.

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast ratios
- Focus states on interactive elements
- Reduced motion preferences supported
- Alt text placeholders

## 🚀 Performance

- Optimized animations (60 FPS)
- Lazy loading ready
- Minimal CSS (via Tailwind)
- No heavy dependencies
- Smooth scrolling without jank
- Efficient event listeners

### Optimization Tips
1. **Image Optimization**: Use WebP format for images
2. **Code Splitting**: Separate heavy scripts if needed
3. **Caching**: Enable browser caching
4. **Minification**: Minify CSS and JS in production
5. **CDN**: Serve from CDN for faster delivery

## 🔧 Browser Support

- Chrome/Edge: Latest (Full support)
- Firefox: Latest (Full support)
- Safari: Latest (Full support)
- Mobile browsers: iOS Safari, Chrome Mobile (Full support)

## 📈 Future Enhancements

- [ ] Backend integration for user accounts
- [ ] Real-time data dashboard
- [ ] Community challenges with leaderboards
- [ ] Carbon offset marketplace
- [ ] Mobile app
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] AI chatbot for recommendations
- [ ] API for data exports
- [ ] Gamification system

## 🤝 Contributing

Feel free to fork this project, make improvements, and submit pull requests!

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created with ❤️ for a sustainable future.

## 📞 Support

For questions or issues, please reach out:
- Email: hello@carbontrack.com
- Website: [carbontrack.com](https://carbontrack.com)

## 🌱 Why Carbon Tracking Matters

Climate change is one of the most pressing challenges of our time. By tracking your carbon footprint, you:

1. **Understand Impact**: See how your daily choices affect the environment
2. **Make Changes**: Identify areas where you can reduce emissions
3. **Save Money**: Many sustainable choices save you money
4. **Inspire Others**: Lead by example and encourage others
5. **Build Accountability**: Track progress and celebrate wins
6. **Contribute**: Join the global movement for sustainability

## 🌍 Quick Carbon Facts

- Average person's carbon footprint: 4-8 tonnes CO₂ per year
- Target for 1.5°C warming limit: 2.3 tonnes CO₂ per person per year
- One tree absorbs: ~48 lbs of CO₂ annually
- Switching to renewable energy: Saves ~1 tonne CO₂ per year
- Eating less meat: Saves ~0.5 tonnes CO₂ per year
- Public transport: 80% less emissions than driving

---

**Make every click count towards a greener future! 🌱**
