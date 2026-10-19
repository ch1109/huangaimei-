import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => cleanup());
Object.defineProperty(window, 'matchMedia', { value: (query: string) => ({ matches: query.includes('prefers-reduced-motion'), media: query, onchange: null, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn() }) });
class Observer { observe() {} unobserve() {} disconnect() {} }
vi.stubGlobal('IntersectionObserver', Observer);
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();
Element.prototype.scrollTo = vi.fn();
HTMLDialogElement.prototype.showModal = function () { this.open = true; };
HTMLDialogElement.prototype.close = function () { this.open = false; };
// jsdom has no drawing surface. Browser QA exercises the real Canvas renderer;
// DOM tests exercise the graceful static fallback unless they supply a context.
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', { configurable: true, value: vi.fn(() => null) });
Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, value: vi.fn().mockResolvedValue(undefined) });
Object.defineProperty(HTMLMediaElement.prototype, 'pause', { configurable: true, value: vi.fn() });
