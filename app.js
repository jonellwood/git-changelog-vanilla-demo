// Sample changelog data that would come from git-changelog-manager
window.changelogData = {
    releases: [
        {
            version: "1.2.0",
            date: "2025-01-04",
            summary: "Major feature release with new dashboard components",
            tag: "feature",
            changeCount: 12,
            rawContent: `- 🎨 New dashboard layout with improved navigation
- ✨ Added user preferences system
- 🔧 Enhanced search functionality
- 📊 New analytics dashboard
- 🐛 Fixed memory leak in data processing
- 🚀 Performance improvements for large datasets
- 📝 Updated documentation
- 🔒 Enhanced security middleware
- 🎯 Improved error handling
- 💫 Added dark mode support
- 🌐 Internationalization support
- 🧪 Added comprehensive test suite`
        },
        {
            version: "1.1.3",
            date: "2025-01-02",
            summary: "Hotfix for critical authentication bug",
            tag: "hotfix",
            changeCount: 3,
            rawContent: `- 🐛 Fixed critical authentication bypass vulnerability
- 🔒 Enhanced session management
- 📝 Updated security documentation`
        },
        {
            version: "1.1.2",
            date: "2024-12-28",
            summary: "Bug fixes and performance improvements",
            tag: "patch",
            changeCount: 7,
            rawContent: `- 🐛 Fixed pagination issue in user list
- ⚡ Improved database query performance
- 🎨 Fixed UI alignment issues on mobile
- 🔧 Updated dependencies to latest versions
- 📱 Better responsive design
- 🌟 Enhanced loading states
- 💬 Improved error messages`
        },
        {
            version: "1.1.1",
            date: "2024-12-20",
            summary: "Minor improvements and documentation updates",
            tag: "patch",
            changeCount: 5,
            rawContent: `- 📝 Updated API documentation
- 🎨 Minor UI polish
- 🔧 Configuration improvements
- 🧹 Code cleanup and refactoring
- 📦 Updated build process`
        },
        {
            version: "1.1.0",
            date: "2024-12-15",
            summary: "New notification system and workflow improvements",
            tag: "feature",
            changeCount: 15,
            rawContent: `- 🔔 New real-time notification system
- 📋 Enhanced workflow management
- 🎯 Improved task assignment
- 💼 New project templates
- 🔍 Advanced filtering options
- 📊 Enhanced reporting features
- 🎨 UI/UX improvements
- 📱 Mobile app enhancements
- 🔧 Backend optimizations
- 🧪 Expanded test coverage
- 📚 Comprehensive user guides
- 🌍 Multi-language support
- 🔗 Better third-party integrations
- ⚡ Performance optimizations
- 🛡️ Security enhancements`
        },
        {
            version: "1.0.0",
            date: "2024-12-01",
            summary: "Initial stable release with core functionality",
            tag: "major",
            changeCount: 25,
            rawContent: `- 🎉 Initial stable release
- 👥 User management system
- 📝 Project creation and management
- 📋 Task tracking and assignment
- 📊 Basic reporting and analytics
- 🔒 Authentication and authorization
- 📱 Responsive web interface
- 🔄 Real-time updates
- 📁 File upload and management
- 🔍 Search functionality
- 📧 Email notifications
- 🎨 Customizable themes
- 📊 Dashboard widgets
- 🔧 Admin panel
- 📱 Mobile-friendly design
- 🔐 Two-factor authentication
- 📈 Usage analytics
- 🌐 API endpoints
- 📚 Documentation portal
- 🧪 Testing framework
- 🚀 CI/CD pipeline
- 🛡️ Security audit
- 📦 Deployment automation
- 🔄 Database migrations
- 🎯 Performance monitoring`
        }
    ],
    stats: {
        totalReleases: 6,
        totalChanges: 67,
        latestVersion: "1.2.0"
    }
};

/**
 * Vanilla JS Changelog Manager
 * Modern card-based interface with search and filtering
 */
class ChangelogManager {
    constructor() {
        this.data = window.changelogData || { releases: [], stats: {} };
        this.releases = this.data.releases || [];
        this.stats = this.data.stats || {};
        this.filteredReleases = [...this.releases];
        this.currentView = 'grid';
        this.searchTerm = '';
        this.sortBy = 'date';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAppName();
        this.populateSidebar();
        this.updateStats();
        this.renderReleases();
        this.updateResultsCount();
    }

    async loadAppName() {
        try {
            const response = await fetch('./package.json');
            if (response.ok) {
                const packageData = await response.json();
                const appName = packageData.name
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                
                const titleElement = document.getElementById('appTitle');
                if (titleElement) {
                    titleElement.textContent = `${appName} Release Notes`;
                }
            }
        } catch (error) {
            console.warn('Could not load package.json:', error);
            // Title already set as default in HTML
        }
    }

    setupEventListeners() {
        // View toggle buttons
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.setView(view);
            });
        });

        // Search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.filterAndRender();
        });

        // Sort dropdown
        const sortSelect = document.getElementById('sortSelect');
        sortSelect.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.filterAndRender();
        });

        // Modal close
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('releaseModal');
        
        modalClose.addEventListener('click', () => this.closeModal());
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Show/hide appropriate containers
        const gridContainer = document.getElementById('releasesGrid');
        const listContainer = document.getElementById('releasesList');
        
        if (view === 'grid') {
            gridContainer.style.display = 'block';
            listContainer.style.display = 'none';
        } else {
            gridContainer.style.display = 'none';
            listContainer.style.display = 'block';
        }

        this.renderReleases();
    }

    filterAndRender() {
        this.applyFilters();
        this.renderReleases();
        this.updateResultsCount();
    }

    applyFilters() {
        let filtered = [...this.releases];

        // Apply search filter
        if (this.searchTerm) {
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(release => 
                release.version.toLowerCase().includes(searchLower) ||
                release.summary.toLowerCase().includes(searchLower) ||
                release.rawContent.toLowerCase().includes(searchLower)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'version':
                    return this.versionCompare(b.version, a.version);
                case 'date':
                    return new Date(b.date) - new Date(a.date);
                case 'changes':
                    return b.changeCount - a.changeCount;
                default:
                    return 0;
            }
        });

        this.filteredReleases = filtered;
    }

    versionCompare(a, b) {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);

        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aPart = aParts[i] || 0;
            const bPart = bParts[i] || 0;

            if (aPart !== bPart) {
                return aPart - bPart;
            }
        }
        return 0;
    }

    populateSidebar() {
        const sidebarContainer = document.getElementById('sidebarReleases');
        if (!sidebarContainer) return;

        // Group releases by month
        const releasesByMonth = {};
        this.releases.forEach((release) => {
            const date = new Date(release.date);
            const monthKey = `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, '0')}`;
            const monthName = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
            });

            if (!releasesByMonth[monthKey]) {
                releasesByMonth[monthKey] = {
                    name: monthName,
                    releases: [],
                };
            }
            releasesByMonth[monthKey].releases.push(release);
        });

        // Sort months by date (newest first)
        const sortedMonths = Object.keys(releasesByMonth).sort((a, b) =>
            b.localeCompare(a)
        );

        const html = `
            <div class="sidebar-section">
                <h3>📅 Releases by Month</h3>
                <div class="sidebar-summary">
                    <span class="total-releases">${this.releases.length} total releases</span>
                </div>
                <div class="release-groups">
                    ${sortedMonths
                        .map((monthKey) => {
                            const monthData = releasesByMonth[monthKey];
                            const isCurrentMonth =
                                monthKey === new Date().toISOString().slice(0, 7);
                            return `
                                <details class="month-group" ${isCurrentMonth ? 'open' : ''}>
                                    <summary class="month-summary">
                                        <span class="month-name">${monthData.name}</span>
                                        <span class="month-count">${monthData.releases.length} releases</span>
                                    </summary>
                                    <div class="month-releases">
                                        ${monthData.releases
                                            .map(
                                                (release) => `
                                        <a href="#${release.version}" class="release-link" onclick="scrollToRelease('${release.version}')">
                                            <div class="release-version">${release.version}</div>
                                            <div class="release-date">${this.formatDate(release.date)}</div>
                                        </a>
                                    `
                                            )
                                            .join('')}
                                    </div>
                                </details>
                            `;
                        })
                        .join('')}
                </div>
            </div>
        `;

        sidebarContainer.innerHTML = html;
    }

    updateStats() {
        // Update sidebar stats
        document.getElementById('totalReleases').textContent = this.releases.length;
        document.getElementById('totalChanges').textContent = this.stats.totalChanges || 0;

        // Update main stats
        document.getElementById('statTotalReleases').textContent = this.releases.length;
        document.getElementById('statTotalChanges').textContent = this.stats.totalChanges || 0;
        document.getElementById('statLatestVersion').textContent = this.stats.latestVersion || 'Unknown';
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        resultsCount.textContent = `Showing ${this.filteredReleases.length} of ${this.releases.length} releases`;
    }

    renderReleases() {
        if (this.filteredReleases.length === 0) {
            this.showEmptyState();
            return;
        }

        this.hideEmptyState();

        if (this.currentView === 'grid') {
            this.renderGrid();
        } else {
            this.renderList();
        }
    }

    showEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const emptyMessage = document.getElementById('emptyMessage');
        const gridContainer = document.getElementById('releasesGrid');
        const listContainer = document.getElementById('releasesList');

        emptyState.style.display = 'block';
        gridContainer.style.display = 'none';
        listContainer.style.display = 'none';

        if (this.searchTerm) {
            emptyMessage.textContent = 'Try adjusting your search criteria';
        } else {
            emptyMessage.textContent = 'No releases have been published yet';
        }
    }

    hideEmptyState() {
        const emptyState = document.getElementById('emptyState');
        emptyState.style.display = 'none';
    }

    renderGrid() {
        const gridContainer = document.getElementById('releasesGrid');
        
        const html = this.filteredReleases.map(release => `
            <div id="${release.version}" class="release-card" onclick="changelogManager.openReleaseModal('${release.version}')">
                <div class="release-header">
                    <div class="release-icon">
                        <i class="${this.getVersionIcon(release.version)}"></i>
                    </div>
                    <div class="release-info">
                        <h3 class="release-version">${release.version}</h3>
                        <p class="release-date">${this.formatDate(release.date)}</p>
                    </div>
                    <div class="release-tag">
                        <span class="tag-label">${release.tag}</span>
                    </div>
                </div>
                
                <div class="release-body">
                    <div class="release-summary">
                        <p>${release.summary}</p>
                    </div>
                </div>
                
                <div class="release-footer">
                    <div class="release-stats">
                        <span class="stat-item">
                            <i class="ph ph-duotone ph-list-bullets"></i>
                            ${release.changeCount} changes
                        </span>
                        <span class="stat-item">
                            <i class="ph ph-duotone ph-calendar"></i>
                            ${this.formatDate(release.date)}
                        </span>
                    </div>
                    <div class="release-actions">
                        <button class="action-btn primary" onclick="changelogManager.openReleaseModal('${release.version}')">
                            <i class="ph ph-duotone ph-arrow-right"></i>
                            View Release
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        gridContainer.innerHTML = html;
    }

    renderList() {
        const listContainer = document.getElementById('releasesList');
        
        const html = this.filteredReleases.map(release => `
            <div id="${release.version}" class="release-row" onclick="changelogManager.openReleaseModal('${release.version}')">
                <div class="release-list-header">
                    <div class="release-icon">
                        <i class="${this.getVersionIcon(release.version)}"></i>
                    </div>
                    <div class="release-info">
                        <h3 class="release-version">${release.version}</h3>
                        <p class="release-summary">${release.summary}</p>
                    </div>
                    <div class="release-meta">
                        <span class="release-date">${this.formatDate(release.date)}</span>
                        <span class="release-changes">${release.changeCount} changes</span>
                        <span class="release-tag">${release.tag}</span>
                    </div>
                    <div class="release-actions">
                        <button class="action-btn primary" onclick="changelogManager.openReleaseModal('${release.version}')">
                            <i class="ph ph-duotone ph-arrow-right"></i>
                            View
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = html;
    }

    openReleaseModal(version) {
        const release = this.releases.find(r => r.version === version);
        if (!release) return;

        const modal = document.getElementById('releaseModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMeta = document.getElementById('modalMeta');
        const modalSummary = document.getElementById('modalSummary');
        const modalContent = document.getElementById('modalContent');

        modalTitle.textContent = release.version;
        
        modalMeta.innerHTML = `
            <div class="meta-item">
                <i class="ph ph-duotone ph-calendar"></i>
                ${this.formatDate(release.date)}
            </div>
            <div class="meta-item">
                <i class="ph ph-duotone ph-list-bullets"></i>
                ${release.changeCount} changes
            </div>
            <div class="meta-item">
                <i class="ph ph-duotone ph-tag"></i>
                ${release.tag}
            </div>
        `;

        modalSummary.innerHTML = `<p>${release.summary}</p>`;
        modalContent.innerHTML = this.formatMarkdown(release.rawContent);

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('releaseModal');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    getVersionIcon(version) {
        const parts = version.split('.');
        const major = parseInt(parts[0]) || 0;
        const minor = parseInt(parts[1]) || 0;
        const patch = parseInt(parts[2]) || 0;

        if (major > 0) return 'ph ph-duotone ph-rocket-launch';
        if (minor > 0) return 'ph ph-duotone ph-star';
        if (patch > 50) return 'ph ph-duotone ph-medal';
        return 'ph ph-duotone ph-tag';
    }

    formatMarkdown(content) {
        if (!content) return '';
        
        // Simple markdown-like formatting
        return content
            .split('\n')
            .map(line => {
                if (line.trim().startsWith('- ')) {
                    return `<li>${line.trim().substring(2)}</li>`;
                }
                return line;
            })
            .join('\n')
            .replace(/(<li>.*<\/li>\n?)+/g, match => `<ul>${match}</ul>`);
    }
}

// Helper function for sidebar navigation
window.scrollToRelease = function(version) {
    const element = document.getElementById(version);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Briefly highlight the card
        element.style.transform = 'scale(1.02)';
        element.style.borderColor = 'var(--c-accent)';
        setTimeout(() => {
            element.style.transform = '';
            element.style.borderColor = '';
        }, 1000);
    }
};

// Initialize the changelog manager when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    window.changelogManager = new ChangelogManager();
});
