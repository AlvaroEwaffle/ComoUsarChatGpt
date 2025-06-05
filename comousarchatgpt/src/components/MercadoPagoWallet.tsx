import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

declare global {
    interface Window {
        MercadoPago: any;
    }
}

interface MercadoPagoWalletProps {
    publicKey: string;
    preferenceId: string;
}

const MercadoPagoWallet = ({ }: MercadoPagoWalletProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const containerId = 'wallet_container';
    const initialized = useRef(false);
    const { sessionId } = useParams<{ sessionId: string }>();

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const fetchCheckout = async () => {
            const response = await fetch('http://localhost:3000/api/sessions/pago', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId }),
            });
            const data = await response.json();

            console.log('data', data);

            if (data) {
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
                                    preferenceId: data.preference_id,
                                },
                                callbacks: {
                                    onError: (error: any) => console.error('Error:', error),
                                    onReady: () => console.log('Wallet ready'),
                                },
                            });
                        }
                    };

                    renderWalletBrick();
                };

                document.body.appendChild(script);
            }

        }

        fetchCheckout();
    }, [sessionId]);

    return <div id={containerId} ref={containerRef} className="w-full" />;
};

export default MercadoPagoWallet; 