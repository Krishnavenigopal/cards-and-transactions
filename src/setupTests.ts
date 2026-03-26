import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement browser scroll APIs — mock them globally
// so components that call scrollBy/scrollIntoView don't throw in tests
window.HTMLElement.prototype.scrollBy       = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.scrollTo       = vi.fn();