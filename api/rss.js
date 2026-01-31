/**
 * arXiv RSS Proxy API for Vercel
 *
 * Usage (same as arXiv API, plus date parameter):
 *   /api/rss?search_query=cat:cs.LG&date=yesterday&max_results=50
 *
 * Parameters (matching arXiv API):
 *   - search_query: search query (without date filter)
 *   - sortBy: submittedDate | lastUpdatedDate | relevance (default: submittedDate)
 *   - sortOrder: descending | ascending (default: descending)
 *   - start: start index (default: 0)
 *   - max_results: max results (default: 50)
 *
 * Additional parameter:
 *   - date: yesterday | today | week | month | none | YYYYMMDD-YYYYMMDD
 */

export default async function handler(req, res) {
  // Get parameters (matching arXiv API naming)
  const query = req.query.search_query || '';
  const dateParam = req.query.date || 'none';
  const sortBy = req.query.sortBy || 'submittedDate';
  const sortOrder = req.query.sortOrder || 'descending';
  const maxResults = req.query.max_results || '50';
  const start = req.query.start || '0';

  // Calculate date range
  const dateQuery = getDateQuery(dateParam);

  // Build final search query
  let searchQuery = query;
  if (dateQuery) {
    if (searchQuery) {
      searchQuery = `${searchQuery} AND ${dateQuery}`;
    } else {
      searchQuery = dateQuery;
    }
  }

  // Build arXiv API URL
  const arxivUrl = new URL('https://export.arxiv.org/api/query');
  if (searchQuery) {
    arxivUrl.searchParams.set('search_query', searchQuery);
  }
  arxivUrl.searchParams.set('sortBy', sortBy);
  arxivUrl.searchParams.set('sortOrder', sortOrder);
  arxivUrl.searchParams.set('start', start);
  arxivUrl.searchParams.set('max_results', maxResults);

  // Parse date range for strict filtering
  const dateRange = parseDateRange(dateParam);

  try {
    // Fetch from arXiv
    const response = await fetch(arxivUrl.toString());
    let body = await response.text();

    // Apply strict date filtering if date range is specified
    if (dateRange) {
      body = filterByDate(body, dateRange.from, dateRange.to);
    }

    // Return with appropriate headers
    res.setHeader('Content-Type', 'application/atom+xml; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(body);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from arXiv' });
  }
}

function getDateQuery(dateParam) {
  const today = new Date();
  let fromDate, toDate;

  switch (dateParam) {
    case 'today':
      fromDate = new Date(today);
      toDate = new Date(today);
      break;
    case 'yesterday':
      fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 1);
      toDate = new Date(fromDate); // Same day as fromDate
      break;
    case 'week':
      fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 7);
      toDate = new Date(today);
      break;
    case 'month':
      fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 30);
      toDate = new Date(today);
      break;
    case 'all':
    case 'none':
    case '':
      return null;
    default:
      // Try to parse custom range: YYYYMMDD-YYYYMMDD
      if (dateParam.includes('-') && dateParam.length === 17) {
        const parts = dateParam.split('-');
        fromDate = parseDate(parts[0]);
        toDate = parseDate(parts[1]);
        if (!fromDate || !toDate) return null;
      } else {
        return null;
      }
  }

  // arXiv requires 12-digit format: YYYYMMDDHHmm
  return `submittedDate:[${formatDateStart(fromDate)} TO ${formatDateEnd(toDate)}]`;
}

function formatDateStart(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}0000`; // Start of day
}

function formatDateEnd(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}2359`; // End of day
}

function parseDate(str) {
  if (str.length !== 8) return null;
  const year = parseInt(str.substring(0, 4));
  const month = parseInt(str.substring(4, 6)) - 1;
  const day = parseInt(str.substring(6, 8));
  const date = new Date(year, month, day);
  if (isNaN(date.getTime())) return null;
  return date;
}

function parseDateRange(dateParam) {
  // Use UTC dates for consistency with arXiv timestamps
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  let fromDate, toDate;

  switch (dateParam) {
    case 'today':
      fromDate = new Date(todayUTC);
      toDate = new Date(todayUTC);
      toDate.setUTCHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      fromDate = new Date(todayUTC);
      fromDate.setUTCDate(fromDate.getUTCDate() - 1);
      toDate = new Date(fromDate);
      toDate.setUTCHours(23, 59, 59, 999);
      break;
    case 'week':
      fromDate = new Date(todayUTC);
      fromDate.setUTCDate(fromDate.getUTCDate() - 7);
      toDate = new Date(todayUTC);
      toDate.setUTCHours(23, 59, 59, 999);
      break;
    case 'month':
      fromDate = new Date(todayUTC);
      fromDate.setUTCDate(fromDate.getUTCDate() - 30);
      toDate = new Date(todayUTC);
      toDate.setUTCHours(23, 59, 59, 999);
      break;
    case 'all':
    case 'none':
    case '':
      return null;
    default:
      // Try to parse custom range: YYYYMMDD-YYYYMMDD
      if (dateParam.includes('-') && dateParam.length === 17) {
        const parts = dateParam.split('-');
        fromDate = parseDateUTC(parts[0]);
        toDate = parseDateUTC(parts[1]);
        if (!fromDate || !toDate) return null;
        toDate.setUTCHours(23, 59, 59, 999);
      } else {
        return null;
      }
  }

  return { from: fromDate, to: toDate };
}

function parseDateUTC(str) {
  if (str.length !== 8) return null;
  const year = parseInt(str.substring(0, 4));
  const month = parseInt(str.substring(4, 6)) - 1;
  const day = parseInt(str.substring(6, 8));
  const date = new Date(Date.UTC(year, month, day));
  if (isNaN(date.getTime())) return null;
  return date;
}

function filterByDate(xmlBody, fromDate, toDate) {
  // Find all <entry> blocks
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  const publishedRegex = /<published>([^<]+)<\/published>/;
  const updatedRegex = /<updated>([^<]+)<\/updated>/;

  // Extract the feed header (everything before first entry)
  const firstEntryIndex = xmlBody.indexOf('<entry>');
  if (firstEntryIndex === -1) {
    return xmlBody; // No entries, return as-is
  }

  const header = xmlBody.substring(0, firstEntryIndex);
  const footer = '</feed>';

  // Find and filter entries
  const filteredEntries = [];
  let match;

  while ((match = entryRegex.exec(xmlBody)) !== null) {
    const entryContent = match[0];
    const publishedMatch = publishedRegex.exec(entryContent);
    const updatedMatch = updatedRegex.exec(entryContent);

    // Check if either published or updated date is within the range
    let inRange = false;

    if (publishedMatch) {
      const publishedDate = new Date(publishedMatch[1]);
      if (publishedDate >= fromDate && publishedDate <= toDate) {
        inRange = true;
      }
    }

    if (!inRange && updatedMatch) {
      const updatedDate = new Date(updatedMatch[1]);
      if (updatedDate >= fromDate && updatedDate <= toDate) {
        inRange = true;
      }
    }

    if (inRange) {
      filteredEntries.push(entryContent);
    } else if (!publishedMatch && !updatedMatch) {
      // If no date found, include the entry (conservative approach)
      filteredEntries.push(entryContent);
    }
  }

  // Update totalResults in the header
  let updatedHeader = header;
  const totalResultsRegex = /<opensearch:totalResults>(\d+)<\/opensearch:totalResults>/;
  const totalMatch = totalResultsRegex.exec(header);
  if (totalMatch) {
    updatedHeader = header.replace(
      totalResultsRegex,
      `<opensearch:totalResults>${filteredEntries.length}</opensearch:totalResults>`
    );
  }

  // Reconstruct the XML
  return updatedHeader + filteredEntries.join('\n') + '\n' + footer;
}
