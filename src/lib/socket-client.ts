export const getSocketUrl = () => {
  if (typeof window !== 'undefined') {
    // In production, use the same domain but different port or path
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001'
    }
    // For production, use the same domain with /socket path
    return `${window.location.protocol}//${window.location.hostname}/socket`
  }
  return 'http://localhost:3001'
}