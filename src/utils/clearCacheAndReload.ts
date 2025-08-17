// Utility to clear PWA cache and reload the page
export async function clearCacheAndReload() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.active) {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = () => {
          window.location.reload();
        };
        registration.active.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        );
        return;
      }
    } catch {
      // fallback to reload
    }
  }
  window.location.reload();
}
