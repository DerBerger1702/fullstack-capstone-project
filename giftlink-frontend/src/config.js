const raw =
  process.env.REACT_APP_BACKEND_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '');
const config = {
  backendUrl: typeof raw === 'string' ? raw.replace(/\/+$/, '') : '',
};

console.log(`backendUrl in config.js: ${config.backendUrl}`);
export { config as urlConfig };
