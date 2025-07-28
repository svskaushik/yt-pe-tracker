/**
 * Utilities for extracting YouTube channel IDs from various URL formats
 */

export interface ChannelInfo {
	channelId: string | null;
	detectionMethod: 'url-channel' | 'url-handle' | 'url-custom' | 'page-data' | 'unknown';
	confidence: 'high' | 'medium' | 'low';
}

/**
 * Extract channel ID from YouTube URL patterns
 */
export function extractChannelIdFromUrl(url: string): ChannelInfo {
	try {
		const parsedUrl = new URL(url);
		const pathname = parsedUrl.pathname;

		// Pattern 1: /channel/[CHANNEL_ID] - Most reliable
		const channelMatch = pathname.match(/^\/channel\/([a-zA-Z0-9_-]{24})$/);
		if (channelMatch) {
			return {
				channelId: channelMatch[1],
				detectionMethod: 'url-channel',
				confidence: 'high'
			};
		}

		// Pattern 2: /@[HANDLE] - Requires conversion
		const handleMatch = pathname.match(/^\/@([a-zA-Z0-9_.-]+)$/);
		if (handleMatch) {
			return {
				channelId: null, // Will need to be resolved via page data
				detectionMethod: 'url-handle',
				confidence: 'medium'
			};
		}

		// Pattern 3: /c/[CUSTOM_NAME] - Requires conversion
		const customMatch = pathname.match(/^\/c\/([a-zA-Z0-9_.-]+)$/);
		if (customMatch) {
			return {
				channelId: null, // Will need to be resolved via page data
				detectionMethod: 'url-custom',
				confidence: 'medium'
			};
		}

		// Pattern 4: /user/[USERNAME] - Legacy format
		const userMatch = pathname.match(/^\/user\/([a-zA-Z0-9_.-]+)$/);
		if (userMatch) {
			return {
				channelId: null, // Will need to be resolved via page data
				detectionMethod: 'url-custom',
				confidence: 'low'
			};
		}

		return {
			channelId: null,
			detectionMethod: 'unknown',
			confidence: 'low'
		};
	} catch (error) {
		console.error('Error parsing URL:', error);
		return {
			channelId: null,
			detectionMethod: 'unknown',
			confidence: 'low'
		};
	}
}

/**
 * Extract channel ID from YouTube page data (ytInitialData)
 */
export function extractChannelIdFromPageData(): ChannelInfo {
	try {
		// Try to find ytInitialData in window object
		const ytInitialData = (window as any).ytInitialData;
    
		if (!ytInitialData) {
			console.log('ytInitialData not found');
			return {
				channelId: null,
				detectionMethod: 'page-data',
				confidence: 'low'
			};
		}

		// Method 1: Check metadata
		const metadata = ytInitialData?.metadata?.channelMetadataRenderer;
		if (metadata?.externalId) {
			return {
				channelId: metadata.externalId,
				detectionMethod: 'page-data',
				confidence: 'high'
			};
		}

		// Method 2: Check header
		const header = ytInitialData?.header?.c4TabbedHeaderRenderer;
		if (header?.channelId) {
			return {
				channelId: header.channelId,
				detectionMethod: 'page-data',
				confidence: 'high'
			};
		}

		// Method 3: Check microformat
		const microformat = ytInitialData?.microformat?.microformatDataRenderer;
		if (microformat?.urlCanonical) {
			const channelInfo = extractChannelIdFromUrl(microformat.urlCanonical);
			if (channelInfo.channelId) {
				return {
					...channelInfo,
					detectionMethod: 'page-data',
					confidence: 'high'
				};
			}
		}

		// Method 4: Deep search in contents
		const channelId = findChannelIdInObject(ytInitialData);
		if (channelId) {
			return {
				channelId,
				detectionMethod: 'page-data',
				confidence: 'medium'
			};
		}

		console.log('Channel ID not found in page data');
		return {
			channelId: null,
			detectionMethod: 'page-data',
			confidence: 'low'
		};
	} catch (error) {
		console.error('Error extracting channel ID from page data:', error);
		return {
			channelId: null,
			detectionMethod: 'page-data',
			confidence: 'low'
		};
	}
}

/**
 * Recursively search for channel ID in nested objects
 */
function findChannelIdInObject(obj: any, depth = 0): string | null {
	// Prevent infinite recursion
	if (depth > 10 || !obj || typeof obj !== 'object') {
		return null;
	}

	// Check if current object has channelId property
	if (obj.channelId && typeof obj.channelId === 'string' && obj.channelId.length === 24) {
		return obj.channelId;
	}

	// Check for externalId
	if (obj.externalId && typeof obj.externalId === 'string' && obj.externalId.length === 24) {
		return obj.externalId;
	}

	// Recursively search in child objects
	for (const key in obj) {
		if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
			const result = findChannelIdInObject(obj[key], depth + 1);
			if (result) {
				return result;
			}
		}
	}

	return null;
}

/**
 * Main function to get channel ID using multiple methods
 */
export function getYouTubeChannelId(): ChannelInfo {
	// First try URL parsing
	const urlInfo = extractChannelIdFromUrl(window.location.href);
	if (urlInfo.channelId) {
		return urlInfo;
	}

	// If URL parsing fails, try page data
	const pageInfo = extractChannelIdFromPageData();
	if (pageInfo.channelId) {
		return pageInfo;
	}

	// Return the best attempt
	return urlInfo.confidence >= pageInfo.confidence ? urlInfo : pageInfo;
}

/**
 * Check if current page is a YouTube channel page
 */
export function isYouTubeChannelPage(): boolean {
	const hostname = window.location.hostname;
	const pathname = window.location.pathname;

	// Check if we're on YouTube
	if (!hostname.includes('youtube.com')) {
		return false;
	}

	// Check for channel-specific patterns
	const channelPatterns = [
		/^\/channel\/[a-zA-Z0-9_-]{24}/,  // /channel/UCxxxxx
		/^\/@[a-zA-Z0-9_.-]+/,           // /@handle
		/^\/c\/[a-zA-Z0-9_.-]+/,         // /c/customname
		/^\/user\/[a-zA-Z0-9_.-]+/       // /user/username
	];

	return channelPatterns.some(pattern => pattern.test(pathname));
}

/**
 * Wait for YouTube page to load completely
 */
export function waitForYouTubeLoad(timeout = 10000): Promise<boolean> {
	return new Promise((resolve) => {
		const startTime = Date.now();
    
		const checkLoad = () => {
			// Check if ytInitialData is available
			if ((window as any).ytInitialData) {
				resolve(true);
				return;
			}
      
			// Check timeout
			if (Date.now() - startTime > timeout) {
				resolve(false);
				return;
			}
      
			// Check again in 100ms
			setTimeout(checkLoad, 100);
		};
    
		checkLoad();
	});
}
