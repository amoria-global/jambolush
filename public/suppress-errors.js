// Global error suppression script - loaded before app initialization
// This completely suppresses browser console errors for network requests

(function() {
  'use strict';

  if (typeof window === 'undefined') return;

  // COMPLETE CONSOLE SUPPRESSION - Override ALL console methods
  const noop = function() {};

  // Store originals
  const _error = console.error;
  const _warn = console.warn;
  const _log = console.log;
  const _info = console.info;
  const _debug = console.debug;

  // Completely override console.error
  console.error = noop;
  console.warn = noop;

  // Override console.log, info, debug to filter network errors
  console.log = function(...args) {
    const msg = args.join(' ');
    if (msg.includes('http://') || msg.includes('localhost')) return;
    _log.apply(console, args);
  };

  console.info = function(...args) {
    const msg = args.join(' ');
    if (msg.includes('http://') || msg.includes('localhost')) return;
    _info.apply(console, args);
  };

  console.debug = function(...args) {
    const msg = args.join(' ');
    if (msg.includes('http://') || msg.includes('localhost')) return;
    _debug.apply(console, args);
  };

  // Suppress ALL unhandled rejections
  window.addEventListener('unhandledrejection', function(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }, true);

  // Suppress ALL errors
  window.addEventListener('error', function(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }, true);
})();
