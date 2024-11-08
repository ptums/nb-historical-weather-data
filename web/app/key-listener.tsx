"use client";

import Script from "next/script";

export default function KeyListener() {
  const keyListenerCode = `
    function setupKeyListener() {
      function handleKeyDown(event) {
        // Check for Cmd+T (Mac) or Ctrl+T (Windows/Linux)
        if ((event.metaKey || event.ctrlKey) && event.key === 't') {
          event.preventDefault(); // Prevent the default browser behavior (opening a new tab)
          
          // Toggle the displayToggleFetch value in localStorage
          const currentValue = localStorage.getItem('displayToggleFetch');
          const newValue = currentValue === 'true' ? 'false' : 'true';
          localStorage.setItem('displayToggleFetch', newValue);
          
          console.log(\`displayToggleFetch set to: \${newValue}\`);
        }
      }

      // Add the event listener
      window.addEventListener('keydown', handleKeyDown);

      // Return a function to remove the event listener
      return function cleanup() {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }

    // Set up the key listener when the script is loaded
    const cleanup = setupKeyListener();

    // Optionally, you can expose the cleanup function globally
    window.removeKeyListener = cleanup;
  `;

  return (
    <Script
      id="key-listener"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: keyListenerCode }}
    />
  );
}
