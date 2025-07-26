# Contributing Channel Data

Thank you for helping to build the YouTube PE ownership database! This guide
will walk you through adding or updating channel information.

## Quick Contribution Process

1. **Fork** this repository
2. **Edit** `data/channels.csv` with your new data
3. **Validate** your changes locally (optional but recommended)
4. **Submit** a pull request with your changes

## Data Requirements

### Required Fields

- **ID**: Generate a new UUID (use
  [uuidgenerator.net](https://www.uuidgenerator.net/))
- **Channel ID**: YouTube channel ID (starts with `UC`, 24 characters total)
- **Channel Name**: Display name of the channel
- **PE Firm**: Name of the private equity firm or investment company
- **Acquisition Date**: Date in YYYY-MM-DD format
- **Acquisition Type**: One of: `full_acquisition`, `majority_stake`,
  `minority_stake`, `partnership`, `investment`, `unknown`
- **Status**: One of: `confirmed`, `rumored`, `pending`, `withdrawn`, `denied`
- **Source URL**: Link to news article, press release, or other source
- **Last Updated**: Current datetime in ISO format (YYYY-MM-DDTHH:MM:SSZ)

### Optional Fields

- **Channel Handle**: YouTube handle (e.g., `@MrBeast`)
- **Subscriber Count**: Approximate count at time of acquisition
- **Deal Value**: Value in USD (numbers only)
- **Deal Value Currency**: Currency code (default: USD)
- **Additional Sources**: Comma-separated list of additional source URLs
- **Notes**: Additional context (max 500 characters)
- **Verified By**: Your GitHub username
- **Tags**: Comma-separated channel categories

## Finding YouTube Channel IDs

### Method 1: From Channel URL

If the channel URL is `youtube.com/channel/UC...`, the part after `/channel/` is
the Channel ID.

### Method 2: From Custom URL

1. Go to the channel page
2. View page source (Ctrl+U)
3. Search for `"channelId":"UC`
4. Copy the 24-character ID

### Method 3: Using Browser Extension

Install "YouTube Channel ID" browser extension for easy lookup.

## Acquisition Types

- **`full_acquisition`** - PE firm acquired 100% of the channel/company
- **`majority_stake`** - PE firm owns >50%
- **`minority_stake`** - PE firm owns <50%
- **`partnership`** - Strategic partnership or content deal
- **`investment`** - Financial investment without clear ownership details
- **`unknown`** - Relationship confirmed but details unclear

## Status Guidelines

- **`confirmed`** - Multiple reliable sources, official announcements
- **`rumored`** - Industry reports but not officially confirmed
- **`pending`** - Deal announced but not yet completed
- **`withdrawn`** - Deal was announced but fell through
- **`denied`** - Claims were officially denied

## Valid Channel Tags

Use these tags (comma-separated, lowercase): `gaming`, `entertainment`,
`education`, `tech`, `lifestyle`, `news`, `sports`, `music`, `comedy`,
`business`, `family`, `beauty`, `food`, `travel`, `other`

## Example Entry

```csv
550e8400-e29b-41d4-a716-446655440001,UCX6OQ3DkcsbYNE6H8uQQuVA,MrBeast,@MrBeast,200000000,Chernin Group,2022-01-20,minority_stake,100000000,USD,confirmed,https://variety.com/2022/digital/news/mrbeast-funding-chernin-group-1235157503/,,Investment to scale content production,2024-01-15T10:30:00Z,contributor1,"entertainment,business"
```

## Local Validation (Recommended)

Before submitting, you can validate your changes locally:

```bash
# Install dependencies
npm install

# Validate your CSV changes
npm run data:validate

# Generate updated JSON files
npm run data:convert

# Update README table
npm run data:table
```

## Source Quality Guidelines

### Preferred Sources

1. Official press releases from PE firms
2. Major business publications (WSJ, Bloomberg, Forbes, etc.)
3. Industry trade publications (Variety, The Information, etc.)
4. Official company announcements

### Avoid

- Social media rumors without verification
- Single-source claims
- Outdated information
- Speculative articles

## Pull Request Guidelines

### Title Format

- `Add [Channel Name] PE acquisition by [Firm]`
- `Update [Channel Name] acquisition details`
- `Fix data for [Channel Name]`

### Description

Include:

- Summary of what you're adding/changing
- Links to your sources
- Any additional context or notes
- Confirmation that you've validated the data locally (if applicable)

### Example PR Description

```markdown
## Adding MrBeast / Chernin Group Investment

**Channel**: MrBeast (@MrBeast) **PE Firm**: Chernin Group **Type**: Minority
stake investment **Date**: January 20, 2022 **Deal Value**: $100M USD

**Sources**:

- [Variety Article](https://variety.com/2022/digital/news/mrbeast-funding-chernin-group-1235157503/)
- [WSJ Coverage](https://example.com/wsj-link)

**Notes**: This was a strategic investment to help scale content production, not
a full acquisition.

- [x] Data validated locally
- [x] Sources verified
- [x] All required fields completed
```

## Updating Existing Entries

When updating existing entries:

1. Keep the same `id` field
2. Update `last_updated` to current datetime
3. Add your username to `verified_by` if you verified the information
4. Include update reason in your PR description

## Questions or Issues?

- Check existing [Issues](../../issues) for similar questions
- Create a new issue with the `question` label
- Review our [Discussion board](../../discussions) for community help

## Code of Conduct

- Be respectful and collaborative
- Focus on factual, verifiable information
- Cite your sources clearly
- Assume good faith from other contributors
- Help newcomers learn the process

Thank you for contributing to this important transparency project! 🚀
