# YouTube Channel Private Equity Ownership Tracker

A community-driven resource for tracking private equity acquisitions of YouTube
channels.

## Project Overview

This is a monorepo containing:

- **`/web`** - Next.js 15 web application for browsing and contributing to the
  tracker
- **`/extension`** - Chrome/Firefox browser extension for in-context PE
  ownership alerts
- **`/data`** - Community-maintained CSV database of YouTube channel PE
  ownership
- **`/scripts`** - Automation scripts for data validation and processing

## Getting Started

### Prerequisites

- Node.js >= 22.15.1
- pnpm >= 9.0.0

### Installation

```bash
# Install all dependencies
pnpm install

# Install specific workspace dependencies
pnpm --filter web install
pnpm --filter extension install
```

### Development

```bash
# Start all development servers
pnpm dev

# Start specific project
pnpm web:dev
pnpm extension:dev

# Build all projects
pnpm build

# Build specific project
pnpm web:build
pnpm extension:build
```

### Workspace Commands

```bash
# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format

# Type checking
pnpm type-check

# Data operations
pnpm data:validate
pnpm data:convert
pnpm data:table
```

## Project Structure

```
yt-pe-tracker/
├── web/                    # Next.js web application
├── extension/              # Browser extension
├── data/                   # CSV data and schema
├── scripts/                # Automation scripts
├── .github/workflows/      # CI/CD pipelines
├── package.json           # Root workspace configuration
├── pnpm-workspace.yaml    # pnpm workspace setup
├── turbo.json             # Turbo build system
├── tsconfig.base.json     # Shared TypeScript config
├── eslint.config.js       # Shared ESLint config
├── .prettierrc            # Shared Prettier config
└── .editorconfig          # Editor configuration
```

## Section 1: Monorepo Refinement ✅

**Status: Complete**

- ✅ Root package.json with workspaces configuration
- ✅ Root pnpm-workspace.yaml
- ✅ Root tsconfig.base.json with shared TypeScript configuration
- ✅ Root eslint.config.js with shared ESLint configuration
- ✅ Root .prettierrc with shared Prettier configuration
- ✅ Root .editorconfig for consistent editor settings
- ✅ Updated extension/tsconfig.json to extend root base config
- ✅ Updated web/tsconfig.json to extend root base config
- ✅ Updated web/package.json to use pnpm instead of yarn
- ✅ Harmonized dependency versions between projects
- ✅ Updated root turbo.json configuration
- ✅ Unified workspace with pnpm install working
- ✅ Updated root README.md with workspace overview

## Section 2: Data Layer & Git-backed Source ✅

**Status: Complete**

- ✅ Created data/channels.schema.json with comprehensive JSON Schema
- ✅ Created data/channels.csv with sample data (5 real examples)
- ✅ Created scripts/csv-to-json.js conversion script (fully functional)
- ✅ Created scripts/validate-data.js for comprehensive CSV validation
- ✅ Created .github/workflows/validate-data.yml for CI validation
- ✅ Created .github/workflows/readme-table.yml for automated README updates
- ✅ Created data/README.md with detailed contribution instructions
- ✅ Tested complete data validation and conversion workflow
- ✅ Verified GitHub Actions configuration
- ✅ Generated working automated README table with rich formatting

## Project Status

### ✅ Completed: Core Infrastructure & Data Layer

We have successfully implemented the foundational components of the YouTube PE
Tracker:

**🏗️ Monorepo Infrastructure**

- Unified workspace with shared configurations
- TypeScript, ESLint, and Prettier standardization
- Turbo-powered build system for optimal performance
- Cross-project dependency management with pnpm

**📊 Data Management System**

- Comprehensive JSON schema for data validation
- CSV-based community contribution workflow
- Automated data validation and conversion scripts
- GitHub Actions for CI/CD automation
- Rich README table generation with real-time updates

**🤝 Community Contribution Framework**

- Detailed contributor documentation
- Automated validation to ensure data quality
- Pull request workflows for community submissions
- Comprehensive source verification guidelines

### 🚧 Next Steps

The foundation is complete and ready for further development:

1. **Web Application Enhancement** - Implement search, filtering, and
   visualization features
2. **Browser Extension Development** - Build in-context PE ownership alerts
3. **API Layer** - Create REST/GraphQL endpoints for data consumption
4. **Advanced Analytics** - Add market trend analysis and reporting
5. **Mobile Application** - Extend reach with native mobile apps

## Contributing

See [data/README.md](data/README.md) for instructions on adding channel data.

## License

MIT License - see [LICENSE](LICENSE) file for details.

<!--data-start-->

| Channel | Subscribers | PE Firm | Type | Deal Value | Date | Status | Source |
|---------|-------------|---------|------|------------|------|--------|--------|
| **MrBeast**<br/><small>@MrBeast</small> | 200,000,000 | Chernin Group | Minority Stake | $100.0M | Jan 19, 2022 | ✅ Confirmed | [📰](https://variety.com/2022/digital/news/mrbeast-funding-chernin-group-1235157503/ "View Source") |
| **Marques Brownlee**<br/><small>@MKBHD</small> | 18,500,000 | Vox Media | Partnership | - | Nov 14, 2021 | ✅ Confirmed | [📰](https://techcrunch.com/2021/11/15/vox-media-mkbhd/ "View Source") |
| **TED**<br/><small>@TED</small> | 23,000,000 | TED Media Group | Full Acquisition | - | Feb 29, 2020 | ✅ Confirmed | [📰](https://blog.ted.com/ted-launches-new-media-initiatives/ "View Source") |
| **Jacksepticeye**<br/><small>@jacksepticeye</small> | 29,000,000 | Night Media | Partnership | - | Aug 9, 2019 | ✅ Confirmed | [📰](https://www.tubefilter.com/2019/08/13/night-media-signs-jacksepticeye/ "View Source") |
| **PewDiePie**<br/><small>@PewDiePie</small> | 111,000,000 | Maker Studios | Partnership | - | Dec 2, 2012 | ✅ Confirmed | [📰](https://variety.com/2012/digital/news/pewdiepie-maker-studios-1118063647/ "View Source") |

<small><i>Last updated: July 26, 2025 at 06:25 AM UTC</i></small>
<small><i>Total channels tracked: 5</i></small>

<!--data-end-->
