import { useEffect, useRef } from 'react';

interface MercadoPagoButtonProps {
  preferenceId: string;
  onError?: (error: any) => void;
  onReady?: () => void;
}

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const MercadoPagoButton = ({ preferenceId, onError, onReady }: MercadoPagoButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = 'mercadopago-button-container';

  useEffect(() => {
    // Load MercadoPago SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    
    script.onload = () => {
      const mp = new window.MercadoPago('APP_USR-19e9336b-8809-4558-b558-1e0e851e76e6');
      const bricksBuilder = mp.bricks();

      const renderWalletBrick = async () => {
        if (containerRef.current) {
          await bricksBuilder.create('wallet', containerId, {
            initialization: {
              preferenceId: preferenceId,
            },
            callbacks: {
              onError: (error: any) => {
                console.error('Error:', error);
                onError?.(error);
              },
              onReady: () => {
                console.log('Wallet ready');
                onReady?.();
              },
            },
          });
        }
      };

      renderWalletBrick();
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [preferenceId, onError, onReady]);

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="w-full"
    />
  );
};

export default MercadoPagoButton; 