import { useCallback } from 'react';

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

export interface UseNativeShareOptions {
  fallbackMessage?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useNativeShare(options: UseNativeShareOptions = {}) {
  const {
    fallbackMessage = '링크가 클립보드에 복사되었습니다!',
    onSuccess,
    onError,
  } = options;

  const fallbackShare = useCallback(
    async (shareData: ShareData) => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareData.url);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = shareData.url;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        alert(fallbackMessage);
        onSuccess?.();
      } catch (error) {
        const errorMessage = error instanceof Error ? error : new Error('Failed to copy to clipboard');
        onError?.(errorMessage);
        throw errorMessage;
      }
    },
    [fallbackMessage, onSuccess, onError]
  );

  const share = useCallback(
    async (shareData: ShareData) => {
      try {
        if (navigator.share && navigator.canShare?.(shareData)) {
          await navigator.share(shareData);
          onSuccess?.();
        } else if (navigator.share) {
          // Try sharing without canShare check for broader compatibility
          await navigator.share(shareData);
          onSuccess?.();
        } else {
          // Fallback to clipboard copy
          await fallbackShare(shareData);
        }
      } catch (error) {
        // If user cancels share (AbortError), don't show error
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        // For other errors, try fallback
        try {
          await fallbackShare(shareData);
        } catch (fallbackError) {
          const finalError = fallbackError instanceof Error ? fallbackError : new Error('Share failed');
          onError?.(finalError);
          throw finalError;
        }
      }
    },
    [fallbackShare, onSuccess, onError]
  );

  const isShareSupported = useCallback(() => {
    return 'share' in navigator;
  }, []);

  const isClipboardSupported = useCallback(() => {
    return 'clipboard' in navigator || document.queryCommandSupported?.('copy');
  }, []);

  return {
    share,
    isShareSupported,
    isClipboardSupported,
  };
}