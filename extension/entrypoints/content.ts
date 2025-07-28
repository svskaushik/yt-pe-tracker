// --- SHARED BADGE INJECTION FOR VIDEO CARDS (HOME + SEARCH) ---
function addBadgeToChannelNameDirect(videoCard: Element, channelData: ChannelData, debugContext: string): void {
  // For search: only use ytd-channel-name that is a direct child of #channel-info
  let channelName: Element | undefined;
  const channelInfo = videoCard.querySelector('div#channel-info');
  if (channelInfo && debugContext === 'SEARCH') {
    channelName = Array.from(channelInfo.children).find(el => el.tagName === 'YTD-CHANNEL-NAME');
    if (!channelName) {
      console.debug(`[PE DEBUG][${debugContext}] No direct ytd-channel-name child of #channel-info`, channelInfo);
      return;
    }
  } else {
    // For home/other: use first ytd-channel-name in card
    const found = videoCard.querySelector('ytd-channel-name');
    channelName = found ? found : undefined;
    if (!channelName) {
      console.debug(`[PE DEBUG][${debugContext}] No ytd-channel-name found in videoCard`, videoCard);
      return;
    }
  }
  // Prevent duplicate badges
  if (channelName.querySelector('.yt-pe-badge')) {
    console.debug(`[PE DEBUG][${debugContext}] Badge already present in ytd-channel-name`, channelName);
    return;
  }
  // Find verified badge as direct child of ytd-channel-name
  const verifiedBadge = Array.from(channelName.children).find(el => el.tagName === 'YTD-BADGE-SUPPORTED-RENDERER');
  // Insert badge after verified badge if present, else after #container
  const badge = createBadgeElement('inline', channelData);
  if (verifiedBadge && verifiedBadge.nextSibling && verifiedBadge.parentNode) {
    verifiedBadge.parentNode.insertBefore(badge, verifiedBadge.nextSibling);
    console.debug(`[PE DEBUG][${debugContext}] Inserted badge after verified badge`, badge, channelName);
  } else {
    // Find #container (channel name text)
    const container = channelName.querySelector('#container');
    if (container && container.nextSibling && container.parentNode) {
      container.parentNode.insertBefore(badge, container.nextSibling);
      console.debug(`[PE DEBUG][${debugContext}] Inserted badge after #container`, badge, channelName);
    } else {
      // Fallback: append as last child
      channelName.appendChild(badge);
      console.debug(`[PE DEBUG][${debugContext}] Appended badge as last child`, badge, channelName);
    }
  }
  badgeElements.add(badge);
}

import '../assets/tailwind.css';

// --- YOUTUBE LOGO FIX ---
// TODO: Need to revisit this fix and implement a more robust solution that doesn't interfere with other elements.
function fixYouTubeLogo() {
  try {
    const logoIcon = document.getElementById('logo-icon');
    if (!logoIcon) return;
    // Find the span and div inside the logo
    const span = logoIcon.querySelector('span.yt-icon-shape');
    const div = span ? span.querySelector('div') : null;
    if (div) {
      // If width/height are 0 or unset, forcibly set them
      const style = window.getComputedStyle(div);
      if (style.width === '0px' || style.height === '0px' || !div.style.width || !div.style.height) {
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.display = 'block';
        div.style.minWidth = '93px'; // fallback for logo size
        div.style.minHeight = '20px';
      }
    }
    // Also fix the svg directly if needed
    const svg = logoIcon.querySelector('svg');
    if (svg) {
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.display = 'inherit';
    }
  } catch (e) {
    // Silent fail
  }
}

// Types
interface ChannelData {
  id: string;
  channel_id: string;
  channel_name: string;
  channel_handle: string;
  pe_firm: string;
  acquisition_date: string;
  acquisition_type: string;
  deal_value: number | null;
  deal_value_currency: string;
  status: string;
  source_url: string;
  notes: string;
  tags: string[];
}

interface PEDatabase {
  channels: ChannelData[];
}

// Global variables
let peDatabase: PEDatabase | null = null;
let processedElements = new WeakSet();
let badgeElements = new Set<HTMLElement>();
let debounceTimer: number | null = null;

// Badge creation functions
function createBadgeElement(type: 'small' | 'medium' | 'large' | 'inline', channelData: ChannelData): HTMLElement {
  const badge = document.createElement('div');
  badge.className = 'yt-pe-badge';
  badge.setAttribute('data-pe-firm', channelData.pe_firm);
  badge.setAttribute('data-channel-id', channelData.channel_id);
  
  // Detect YouTube theme
  const isDark = document.documentElement.hasAttribute('dark') || 
                 document.body.hasAttribute('dark') ||
                 document.querySelector('[dark]') !== null;
  
  const baseClasses = 'inline-flex items-center font-medium transition-all duration-200 z-50 pointer-events-auto';
  const themeClasses = isDark 
    ? 'bg-orange-600 text-orange-100 border-orange-500 hover:bg-orange-500' 
    : 'bg-orange-500 text-white border-orange-400 hover:bg-orange-600';
  
  switch (type) {
    case 'small':
      badge.className = `${baseClasses} ${themeClasses} text-xs px-1.5 py-0.5 rounded border text-[10px] leading-tight`;
      badge.innerHTML = `
        <span class="font-bold">PE</span>
      `;
      break;
    
    case 'medium':
      badge.className = `${baseClasses} ${themeClasses} text-xs px-2 py-1 rounded-md border`;
      badge.innerHTML = `
        <span class="font-bold mr-1">PE</span>
        <span class="truncate max-w-[100px]">${channelData.pe_firm}</span>
      `;
      break;
    
    case 'large':
      badge.className = `${baseClasses} ${themeClasses} text-sm px-3 py-1.5 rounded-lg border`;
      badge.innerHTML = `
        <div class="flex items-center">
          <span class="font-bold mr-2">PE-Owned</span>
          <span class="text-orange-200">${channelData.pe_firm}</span>
        </div>
      `;
      break;

    case 'inline':
      badge.className = `${baseClasses} ${themeClasses} text-xs px-1 py-0.5 rounded text-[10px] leading-none ml-1`;
      badge.innerHTML = `
        <span class="font-bold">PE</span>
      `;
      badge.style.fontSize = '10px';
      badge.style.height = '16px';
      badge.style.minHeight = '16px';
      break;
  }
  
  // Add tooltip with improved styling for legibility
  const tooltip = document.createElement('div');
  tooltip.className = `yt-pe-tooltip absolute text-xs px-3 py-2 rounded-lg z-[99999] opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap`;
  tooltip.style.bottom = '100%';
  tooltip.style.left = '50%';
  tooltip.style.transform = 'translateX(-50%)';
  tooltip.style.marginBottom = '8px';
  tooltip.style.boxShadow = '0 4px 16px 0 rgba(0,0,0,0.18), 0 1.5px 4px 0 rgba(0,0,0,0.12)';
  tooltip.style.borderRadius = '8px';
  tooltip.style.fontWeight = '500';
  tooltip.style.maxWidth = '260px';
  tooltip.style.textAlign = 'left';
  tooltip.style.wordBreak = 'break-word';
  tooltip.style.pointerEvents = 'auto';
  tooltip.style.zIndex = '99999';
  if (isDark) {
    tooltip.style.background = 'rgba(30,30,30,0.98)';
    tooltip.style.color = '#f3f3f3';
    tooltip.style.border = '1px solid #444';
  } else {
    tooltip.style.background = 'rgba(255,255,255,0.98)';
    tooltip.style.color = '#222';
    tooltip.style.border = '1px solid #bbb';
  }
  tooltip.innerHTML = `
    <div style="font-weight:600;">${channelData.channel_name}</div>
    <div>PE Firm: <span style="font-weight:500;">${channelData.pe_firm}</span></div>
    <div>Acquired: <span style="font-weight:500;">${channelData.acquisition_date}</span></div>
    <div>Type: <span style="font-weight:500;">${channelData.acquisition_type.replace('_', ' ')}</span></div>
  `;

  badge.style.position = 'relative';
  badge.style.zIndex = '99999';
  badge.appendChild(tooltip);

  // Fix for video page: ensure parent containers allow overflow and pointer events
  let parent = badge.parentElement;
  while (parent) {
    if (parent instanceof HTMLElement) {
      if (parent.style.overflow === 'hidden') parent.style.overflow = 'visible';
      if (parent.style.pointerEvents === 'none') parent.style.pointerEvents = 'auto';
    }
    parent = parent.parentElement;
  }

  // Show/hide tooltip on hover
  badge.addEventListener('mouseenter', () => {
    tooltip.style.opacity = '1';
    tooltip.style.pointerEvents = 'auto';
  });
  badge.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
    tooltip.style.pointerEvents = 'none';
  });
  
  // Click handler for more info (only open if valid, non-placeholder source_url)
  badge.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = channelData.source_url?.trim();
    if (url && url !== '#' && !url.includes('techcrunch.com/acquisition-youtube-pe-placeholder')) {
      window.open(url, '_blank');
    } else {
      // Optionally, open the channel page as a fallback
      const handle = channelData.channel_handle || channelData.channel_id;
      if (handle) {
        window.open(`https://www.youtube.com/${handle.startsWith('@') ? handle : 'channel/' + handle}`, '_blank');
      }
    }
  });
  
  return badge;
}

function addBadgeToVideoCard(videoCard: Element, channelData: ChannelData): void {
  // Remove any existing badge in this video card
  videoCard.querySelectorAll('.yt-pe-badge').forEach(b => b.remove());

  // First try to inject into the channel name area (inline with verified badge)
  const channelNameContainer = videoCard.querySelector('ytd-channel-name');
  if (channelNameContainer) {
    const container = channelNameContainer.querySelector('#container');
    if (container) {
      // Look for verified badge renderer to insert after it
      const verifiedBadge = container.querySelector('ytd-badge-supported-renderer');
      if (verifiedBadge) {
        // Insert after verified badge
        const badge = createBadgeElement('inline', channelData);
        verifiedBadge.insertAdjacentElement('afterend', badge);
        badgeElements.add(badge);
        return;
      } else {
        // No verified badge, insert after text container
        const textContainer = container.querySelector('#text-container');
        if (textContainer) {
          const badge = createBadgeElement('inline', channelData);
          textContainer.insertAdjacentElement('afterend', badge);
          badgeElements.add(badge);
          return;
        }
      }
    }
  }

  // Fallback: Try to find thumbnail container
  const thumbnail = videoCard.querySelector('ytd-thumbnail, .ytd-thumbnail');
  if (thumbnail) {
    const badge = createBadgeElement('small', channelData);
    badge.style.position = 'absolute';
    badge.style.top = '4px';
    badge.style.right = '4px';
    badge.style.zIndex = '10';
    // Make thumbnail container relative if it isn't already
    const thumbnailContainer = thumbnail.closest('ytd-thumbnail') || thumbnail;
    if (thumbnailContainer instanceof HTMLElement) {
      thumbnailContainer.style.position = 'relative';
      thumbnailContainer.appendChild(badge);
      badgeElements.add(badge);
      return;
    }
  }

  // Final fallback: add next to channel name (old method)
  const channelName = videoCard.querySelector('.ytd-channel-name, ytd-channel-name, [id="channel-name"]');
  if (channelName) {
    const badge = createBadgeElement('medium', channelData);
    badge.style.marginLeft = '8px';
    badge.style.display = 'inline-flex';
    if (channelName.parentNode) {
      channelName.parentNode.insertBefore(badge, channelName.nextSibling);
      badgeElements.add(badge);
    }
  }
}

function addBadgeToChannelHeader(headerElement: Element, channelData: ChannelData, selector?: string): void {
  // Debug: log headerElement and selector
  console.debug('[PE DEBUG][CHANNEL] Trying to inject badge in headerElement:', headerElement, 'selector:', selector);
  // New YouTube 2025+ DOM: inject after channel name or handle in title/headline-info
  if (headerElement.classList.contains('page-header-view-model-wiz__page-header-title') ||
      headerElement.classList.contains('page-header-view-model-wiz__page-header-headline-info')) {
    // If badge already exists, skip to prevent duplicates
    if (headerElement.querySelector('.yt-pe-badge')) {
      console.debug('[PE DEBUG][CHANNEL] Badge already present in headerElement');
      return;
    }
    // Remove any existing badge in this header area
    headerElement.querySelectorAll('.yt-pe-badge').forEach(b => b.remove());
    // Try to find the h1 (channel name) or handle span
    const h1 = headerElement.querySelector('h1');
    if (h1 && h1.parentNode) {
      const badge = createBadgeElement('large', channelData);
      badge.style.marginLeft = '12px';
      badge.style.display = 'inline-flex';
      h1.parentNode.insertBefore(badge, h1.nextSibling);
      badgeElements.add(badge);
      console.debug('[PE DEBUG][CHANNEL] Inserted badge after h1 in headerElement');
      return;
    }
    // Fallback: append to headerElement
    const badge = createBadgeElement('large', channelData);
    badge.style.margin = '8px';
    badge.style.display = 'inline-flex';
    headerElement.appendChild(badge);
    badgeElements.add(badge);
    console.debug('[PE DEBUG][CHANNEL] Appended badge as last child of headerElement');
    return;
  }

  // Try to find ytd-channel-name in header (modern and legacy)
  const channelName = headerElement.querySelector('ytd-channel-name, .ytd-channel-name, #channel-name, [id="channel-name"]');
  if (channelName) {
    // Prevent duplicate badges
    if (channelName.querySelector('.yt-pe-badge')) {
      console.debug('[PE DEBUG][CHANNEL] Badge already present in ytd-channel-name in header');
      return;
    }
    // Insert badge as direct child of ytd-channel-name, after verified badge if present, else after #container
    const verifiedBadge = Array.from(channelName.children).find(el => el.tagName === 'YTD-BADGE-SUPPORTED-RENDERER');
    const badge = createBadgeElement('large', channelData);
    if (verifiedBadge && verifiedBadge.nextSibling && verifiedBadge.parentNode) {
      verifiedBadge.parentNode.insertBefore(badge, verifiedBadge.nextSibling);
      badgeElements.add(badge);
      console.debug('[PE DEBUG][CHANNEL] Inserted badge after verified badge in ytd-channel-name', badge, channelName);
      return;
    } else {
      const container = channelName.querySelector('#container');
      if (container && container.nextSibling && container.parentNode) {
        container.parentNode.insertBefore(badge, container.nextSibling);
        badgeElements.add(badge);
        console.debug('[PE DEBUG][CHANNEL] Inserted badge after #container in ytd-channel-name', badge, channelName);
        return;
      } else {
        channelName.appendChild(badge);
        badgeElements.add(badge);
        console.debug('[PE DEBUG][CHANNEL] Appended badge as last child of ytd-channel-name', badge, channelName);
        return;
      }
    }
  }
  // Fallback: add to header container
  const badge = createBadgeElement('large', channelData);
  badge.style.margin = '8px';
  badge.style.display = 'inline-flex';
  headerElement.appendChild(badge);
  badgeElements.add(badge);
  console.debug('[PE DEBUG][CHANNEL] Appended badge as last child of headerElement (fallback)');
}

// Channel detection functions
function extractChannelIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Handle /channel/CHANNEL_ID and /channel/CHANNEL_ID/...
    if (pathname.startsWith('/channel/')) {
      const match = pathname.match(/^\/channel\/([a-zA-Z0-9_-]{24})(?:\/|$)/);
      if (match) {
        console.debug('[PE DEBUG][extractChannelIdFromUrl] Normalized channel_id:', match[1]);
        return match[1];
      }
      return null;
    }

    // Handle /@handle and /@handle/...
    if (pathname.startsWith('/@')) {
      // Always prepend @ and preserve case, but strip trailing segments
      const handle = pathname.split('/')[1]; // e.g. '@PewDiePie'
      if (handle) {
        console.debug('[PE DEBUG][extractChannelIdFromUrl] Normalized handle:', handle);
        return handle;
      }
      return null;
    }

    if (pathname.startsWith('/c/') || pathname.startsWith('/user/')) {
      const username = pathname.split('/')[2];
      return username; // We'll need to handle this differently
    }

    return null;
  } catch {
    return null;
  }
}

function extractChannelFromVideoCard(videoCard: Element): string | null {
  // Try various selectors for channel links
  const channelLink = videoCard.querySelector('a[href*="/channel/"], a[href*="/@"], .ytd-channel-name a, ytd-channel-name a');
  if (channelLink instanceof HTMLAnchorElement) {
    const href = channelLink.href;
    return extractChannelIdFromUrl(href);
  }
  
  return null;
}

function getPageType(): string {
  const path = window.location.pathname;
  
  if (path.startsWith('/channel/') || path.startsWith('/@') || path.startsWith('/c/') || path.startsWith('/user/')) {
    return 'channel';
  }
  
  if (path === '/' || path === '/feed/trending' || path === '/feed/subscriptions') {
    return 'home';
  }
  
  if (path === '/results') {
    return 'search';
  }
  
  if (path === '/watch') {
    return 'watch';
  }
  
  return 'other';
}

function findPEChannel(channelId: string): ChannelData | null {
  if (!peDatabase?.channels) return null;

  // Case-insensitive handle match
  const lowerId = channelId.toLowerCase();
  return (
    peDatabase.channels.find(channel =>
      channel.channel_id === channelId ||
      (channel.channel_handle && channel.channel_handle.toLowerCase() === lowerId)
    ) || null
  );
}

// Main processing functions
function processVideoCards(): void {
  const videoCardSelectors = [
    'ytd-rich-item-renderer',
    'ytd-video-renderer', 
    'ytd-grid-video-renderer',
    'ytd-compact-video-renderer'
  ];

  for (const selector of videoCardSelectors) {
    const videoCards = document.querySelectorAll(selector);

    videoCards.forEach(videoCard => {
      if (processedElements.has(videoCard)) return;
      processedElements.add(videoCard);

      const channelId = extractChannelFromVideoCard(videoCard);
      if (!channelId) return;

      const channelData = findPEChannel(channelId);
      if (channelData) {
        // Search page: ytd-video-renderer with #channel-info
        if (
          selector === 'ytd-video-renderer' &&
          videoCard.querySelector('div#channel-info > ytd-channel-name')
        ) {
          addBadgeToChannelNameDirect(videoCard, channelData, 'SEARCH');
        } else if (
          // Home page: ytd-rich-item-renderer or ytd-video-renderer with ytd-channel-name
          (selector === 'ytd-rich-item-renderer' || selector === 'ytd-video-renderer') &&
          videoCard.querySelector('ytd-channel-name')
        ) {
          addBadgeToChannelNameDirect(videoCard, channelData, 'HOME');
        } else {
          addBadgeToVideoCard(videoCard, channelData);
        }
      }
    });
  }
}

function processChannelPage(): void {
  const currentChannelId = extractChannelIdFromUrl(window.location.href);
  console.log('[PE DEBUG] Extracted channelId/handle from URL:', currentChannelId);
  if (!currentChannelId) {
    console.log('[PE DEBUG] No channelId extracted from URL');
    return;
  }

  // Log all PE channel IDs/handles for debugging
  if (peDatabase?.channels) {
    console.log('[PE DEBUG] PE DB channel_ids:', peDatabase.channels.map(c => c.channel_id));
    console.log('[PE DEBUG] PE DB handles:', peDatabase.channels.map(c => c.channel_handle));
  }

  const channelData = findPEChannel(currentChannelId);
  console.log('[PE DEBUG] Matched channelData:', channelData);
  if (!channelData) {
    console.log('[PE DEBUG] No matching PE channel found for', currentChannelId);
    return;
  }

  // Find channel header (2025+ DOM first, then legacy fallback)
  const headerSelectors = [
    // New YouTube 2025+ channel page DOM (only title to avoid duplicates)
    '.page-header-view-model-wiz__page-header-title',
    // Legacy fallbacks
    'ytd-c4-tabbed-header-renderer',
    '#channel-header-container',
    '.ytd-c4-tabbed-header-renderer',
    'ytd-channel-tagline-renderer'
  ];

  let foundHeader = false;
  for (const selector of headerSelectors) {
    const header = document.querySelector(selector);
    if (header) {
      console.log('[PE DEBUG] Found header element with selector:', selector);
      // If this header has already been processed, stop to avoid duplicates
      if (processedElements.has(header)) {
        foundHeader = true;
        break;
      }
      // New header element: inject badge
      processedElements.add(header);
      addBadgeToChannelHeader(header, channelData, selector);
      foundHeader = true;
      break;
    }
  }
  if (!foundHeader) {
    console.log('[PE DEBUG] No channel header element found for badge injection');
  }
}

function processWatchPage(): void {
  // Only inject badge as a child of ytd-channel-name in the video owner section
  const ownerRenderers = document.querySelectorAll('ytd-video-owner-renderer');
  ownerRenderers.forEach(owner => {
    if (processedElements.has(owner)) return;
    processedElements.add(owner);

    // Find ytd-channel-name inside the owner renderer
    const channelName = owner.querySelector('ytd-channel-name');
    if (!channelName) {
      console.debug('[PE DEBUG][WATCH] No ytd-channel-name found in ytd-video-owner-renderer', owner);
      return;
    }
    // Prevent duplicate badges
    if (channelName.querySelector('.yt-pe-badge')) {
      console.debug('[PE DEBUG][WATCH] Badge already present in ytd-channel-name', channelName);
      return;
    }
    // Extract channelId from the channel link inside ytd-channel-name
    const channelLink = channelName.querySelector('a[href*="/channel/"], a[href*="/@"]');
    if (!(channelLink instanceof HTMLAnchorElement)) {
      console.debug('[PE DEBUG][WATCH] No channel link found in ytd-channel-name', channelName);
      return;
    }
    const channelId = extractChannelIdFromUrl(channelLink.href);
    if (!channelId) {
      console.debug('[PE DEBUG][WATCH] Could not extract channelId from link', channelLink.href);
      return;
    }
    const channelData = findPEChannel(channelId);
    if (!channelData) {
      console.debug('[PE DEBUG][WATCH] No matching PE channel found for', channelId);
      return;
    }
    // Insert badge as direct child of ytd-channel-name, after verified badge if present, else after #container
    const verifiedBadge = Array.from(channelName.children).find(el => el.tagName === 'YTD-BADGE-SUPPORTED-RENDERER');
    const badge = createBadgeElement('medium', channelData);
    if (verifiedBadge && verifiedBadge.nextSibling && verifiedBadge.parentNode) {
      verifiedBadge.parentNode.insertBefore(badge, verifiedBadge.nextSibling);
      badgeElements.add(badge);
      console.debug('[PE DEBUG][WATCH] Inserted badge after verified badge in ytd-channel-name', badge, channelName);
      return;
    } else {
      const container = channelName.querySelector('#container');
      if (container && container.nextSibling && container.parentNode) {
        container.parentNode.insertBefore(badge, container.nextSibling);
        badgeElements.add(badge);
        console.debug('[PE DEBUG][WATCH] Inserted badge after #container in ytd-channel-name', badge, channelName);
        return;
      } else {
        channelName.appendChild(badge);
        badgeElements.add(badge);
        console.debug('[PE DEBUG][WATCH] Appended badge as last child of ytd-channel-name', badge, channelName);
        return;
      }
    }
  });
}

function processCurrentPage(): void {
  if (!peDatabase?.channels) return;
  
  const pageType = getPageType();
  
  switch (pageType) {
    case 'channel':
      processChannelPage();
      break;
    
    case 'home':
    case 'search':
      processVideoCards();
      break;
    
    case 'watch':
      processWatchPage();
      break;
    
    default:
      processVideoCards(); // Try to process video cards on any page
  }
}

function cleanupBadges(): void {
  badgeElements.forEach(badge => {
    if (badge.parentNode) {
      badge.parentNode.removeChild(badge);
    }
  });
  badgeElements.clear();
}

function debouncedProcess(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = window.setTimeout(() => {
    processCurrentPage();
    debounceTimer = null;
  }, 250);
}

// Main content script
export default defineContentScript({
  matches: [
    '*://www.youtube.com/*',
    '*://youtube.com/*'
  ],
  async main() {
    console.log('YT PE Tracker comprehensive overlay system loaded');

  // Load PE database
    try {
      const response = await browser.runtime.sendMessage({ type: 'GET_CHANNEL_DATA' });
      if (response.success) {
        peDatabase = response.data;
        console.log(`Loaded ${peDatabase?.channels?.length || 0} PE channels`);
      } else {
        console.error('Failed to load PE database:', response.error);
        return;
      }
    } catch (error) {
      console.error('Error loading PE database:', error);
      return;
    }

  // --- Fix YouTube logo on load ---
  fixYouTubeLogo();

  // Set up mutation observer for dynamic content
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldProcess = true;
        }
      });
      
      if (shouldProcess) {
        debouncedProcess();
      }
    });


    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also fix logo after any DOM mutations (in case YouTube re-renders it)
    const logoFixObserver = new MutationObserver(() => {
      fixYouTubeLogo();
    });
    const logoContainer = document.getElementById('logo-icon')?.parentElement || document.body;
    logoFixObserver.observe(logoContainer, { childList: true, subtree: true });

  // Handle navigation changes
    let lastUrl = window.location.href;
    
    const urlObserver = new MutationObserver(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        console.log('URL changed to:', currentUrl);
        
        // Clean up old badges
        cleanupBadges();
        processedElements = new WeakSet();
        // Fix logo after navigation
        setTimeout(() => {
          fixYouTubeLogo();
          processCurrentPage();
        }, 500);
      }
    });

    urlObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Listen for YouTube navigation events
    window.addEventListener('yt-navigate-start', () => {
      cleanupBadges();
      processedElements = new WeakSet();
    });

    window.addEventListener('yt-navigate-finish', () => {
      setTimeout(() => {
        fixYouTubeLogo();
        processCurrentPage();
      }, 500);
    });

    // Initial processing
    setTimeout(() => {
      fixYouTubeLogo();
      processCurrentPage();
    }, 1000);

    // Cleanup function
    return () => {
      observer.disconnect();
      urlObserver.disconnect();
      cleanupBadges();
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      // Disconnect logo fix observer
      logoFixObserver.disconnect();
    };
  },
});
