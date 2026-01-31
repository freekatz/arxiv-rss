# arXiv RSS Feed Generator

A simple, elegant web tool that allows you to create custom RSS feeds for arXiv search queries. Stay up-to-date with the latest research papers in your field by subscribing to precisely crafted searches.

> This is an extended version forked from [ronpay/arxiv-rss-feed-generator](https://github.com/ronpay/arxiv-rss-feed-generator), with additional features like dynamic date proxy API, category quick-select, and query import/export.

## Try it now

**Live Demo**: [arxiv.rss.1uvu.com](https://arxiv.rss.1uvu.com/)

No installation needed - just use the online tool to create your custom arXiv RSS feeds instantly.

## Deploy Your Own

1. **Fork** this repository
2. **Install [Pull App](https://github.com/apps/pull)** to automatically sync updates from upstream
3. **Deploy to Vercel** with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/freekatz/arxiv-rss)

## Features

- Create complex search queries with an intuitive interface
- Support for nested groups with different boolean operators (AND, OR, ANDNOT)
- Search in specific fields (title, author, abstract, etc.)
- Sort results by relevance, submission date, or update date
- Generate an RSS feed URL you can use in any feed reader
- **Date range filtering** - filter papers by submission date (today, yesterday, last week, last month, or custom range)
- **Quick category selection** - one-click selection for popular categories (cs.LG, cs.CL, cs.CV, etc.)
- **Query import** - paste existing query strings to populate the form
- **Dynamic Date Proxy API** - automatically updates date ranges on each fetch, perfect for RSS readers

## License

GPL-3.0

## Credits

- Original project: [ronpay/arxiv-rss-feed-generator](https://github.com/ronpay/arxiv-rss-feed-generator)
- [arXiv API](https://info.arxiv.org/help/api/user-manual.html)
