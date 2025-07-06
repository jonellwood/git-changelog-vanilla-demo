# Vanilla JavaScript Changelog Renderer

A modern, responsive changelog renderer built with pure JavaScript - no frameworks required!

## Demo

🌐 **[Live Demo](https://vanillia.jonellwood.dev)** - See it in action!

[![Netlify Status](https://api.netlify.com/api/v1/badges/fc9f9758-167b-441b-b307-6543d3554ba0/deploy-status)](https://app.netlify.com/projects/vanilla-changelog-demo/deploys)

## Features

- 🎨 **Modern Design**: Beautiful card-based interface with dark mode support
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- 🔍 **Search & Filter**: Real-time search and sorting capabilities
- 📊 **Statistics**: Automatic stats calculation and display
- 🎯 **Dual Views**: Switch between grid and list layouts
- 📅 **Sidebar Navigation**: Organized by month with collapsible sections
- 🎭 **Modal Details**: Click any release for detailed view
- 🚀 **Performance**: Lightweight vanilla JS implementation
- 🎪 **Icons**: Beautiful Phosphor icons throughout
- 📦 **Dynamic**: Loads app name from package.json

## Quick Start

1. **Clone or download** this directory
2. **Open** `index.html` in your browser
3. **That's it!** No build process required

## Customization

### Data Source

Update the `window.changelogData` object in `app.js` with your own releases:

```javascript
window.changelogData = {
    releases: [
        {
            version: "1.0.0",
            date: "2024-12-01",
            summary: "Initial release description",
            tag: "major", // major, minor, patch, hotfix, feature
            changeCount: 5,
            rawContent: `- 🎉 First feature
- 🐛 Bug fix
- 📝 Documentation`
        }
        // ... more releases
    ],
    stats: {
        totalReleases: 1,
        totalChanges: 5,
        latestVersion: "1.0.0"
    }
};
```

### Styling

Modify `styles.css` to match your brand:

- Update CSS variables for colors and spacing
- Customize the layout and typography
- Add your own animations and effects

### App Name

The title automatically loads from `package.json`. Update the `name` field to change the displayed title.

## Integration

### With git-changelog-manager

This renderer is designed to work with [git-changelog-manager](https://www.npmjs.com/package/git-changelog-manager). Simply:

1. Generate your changelog data using the npm package
2. Replace the sample data in `app.js` with your generated data
3. Deploy to your web server

### Custom Data Sources

You can easily adapt this to work with any data source:

```javascript
// Example: Load from API
fetch('/api/changelog')
    .then(response => response.json())
    .then(data => {
        window.changelogData = data;
        window.changelogManager = new ChangelogManager();
    });
```

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ ES6+ features used (classes, arrow functions, async/await)
- ✅ Responsive design for all screen sizes

## File Structure

```
vanilla-js/
├── index.html          # Main HTML structure
├── app.js             # JavaScript functionality
├── styles.css         # Styling and themes
├── package.json       # Project metadata
└── README.md          # This file
```

## Key Features Explained

### Search & Filtering
- Real-time search across version, summary, and content
- Sort by date, version, or number of changes
- Live results counter

### View Modes
- **Grid View**: Card-based layout for visual browsing
- **List View**: Compact list for quick scanning

### Sidebar Navigation
- Releases grouped by month
- Collapsible sections with release counts
- Smooth scrolling to specific releases

### Modal Details
- Click any release for full details
- Formatted markdown content
- Release metadata display
- Keyboard shortcuts (Escape to close)

## Customization Examples

### Change Color Scheme
```css
:root {
    --c-accent: #007bff; /* Change to your brand color */
    --c-bg: #ffffff;     /* Background color */
    --c-fg: #1a1a1a;     /* Text color */
}
```

### Add Custom Icons
```javascript
getVersionIcon(version) {
    // Add your own logic for version icons
    if (version.includes('beta')) return 'ph ph-duotone ph-flask';
    // ... rest of logic
}
```

### Custom Date Formatting
```javascript
formatDate(dateString) {
    // Use your preferred date format
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(dateString));
}
```

## License

MIT License - feel free to use in your projects!

## Contributing

This is an example implementation. For the main project, visit [git-changelog-manager](https://github.com/jonellwood/git-changelog-manager).
