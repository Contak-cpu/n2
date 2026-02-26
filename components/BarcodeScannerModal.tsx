import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Camera, Flashlight, Search, CheckCircle, AlertCircle } from 'lucide-react';
import jsQR from 'jsqr';
import { Product } from '../types';
import { ProductIcon } from './ProductIcon';

interface BarcodeScannerModalProps {
  products: Product[];
  onDetect: (product: Product) => void;
  onClose: () => void;
  mode?: 'add' | 'view'; // 'add' = agrega al carrito, 'view' = solo muestra info
}

type ScanStatus = 'idle' | 'scanning' | 'found' | 'not_found';

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  products,
  onDetect,
  onClose,
  mode = 'add',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<ScanStatus>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [manualSearch, setManualSearch] = useState('');
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  // Iniciar cámara
  useEffect(() => {
    let active = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setStatus('scanning');
        }
      } catch (err: any) {
        if (!active) return;
        if (err.name === 'NotAllowedError') {
          setCameraError('Permiso de cámara denegado. Usá la búsqueda manual.');
        } else if (err.name === 'NotFoundError') {
          setCameraError('No se encontró cámara. Usá la búsqueda manual.');
        } else {
          setCameraError('Error al acceder a la cámara. Usá la búsqueda manual.');
        }
      }
    };

    startCamera();

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Loop de escaneo
  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code && code.data && code.data !== lastScanned) {
      setLastScanned(code.data);
      handleCodeDetected(code.data);
      return; // Parar el loop hasta que el usuario confirme o continúe
    }

    animFrameRef.current = requestAnimationFrame(scanFrame);
  }, [lastScanned, products]);

  useEffect(() => {
    if (status === 'scanning') {
      animFrameRef.current = requestAnimationFrame(scanFrame);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [status, scanFrame]);

  const handleCodeDetected = (code: string) => {
    cancelAnimationFrame(animFrameRef.current);
    // Buscar por barcode, SKU o nombre
    const product = products.find(
      p => (p.barcode && (p.barcode === code || code.includes(p.barcode))) ||
           p.sku.toLowerCase() === code.toLowerCase() ||
           p.name.toLowerCase() === code.toLowerCase() ||
           code.toLowerCase().includes(p.sku.toLowerCase())
    );

    if (product) {
      setFoundProduct(product);
      setStatus('found');
      // Vibrar si está disponible
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } else {
      setFoundProduct(null);
      setStatus('not_found');
      setTimeout(() => {
        setStatus('scanning');
        setLastScanned(null);
        animFrameRef.current = requestAnimationFrame(scanFrame);
      }, 2000);
    }
  };

  const handleConfirm = () => {
    if (foundProduct) {
      onDetect(foundProduct);
      if (mode === 'add') {
        // Continuar escaneando
        setFoundProduct(null);
        setStatus('scanning');
        setLastScanned(null);
      } else {
        onClose();
      }
    }
  };

  const handleManualSearch = () => {
    const q = manualSearch.trim().toLowerCase();
    if (!q) return;
    const product = products.find(
      p => p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
    );
    if (product) {
      handleCodeDetected(product.sku);
    } else {
      setStatus('not_found');
      setTimeout(() => setStatus(cameraError ? 'idle' : 'scanning'), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 text-white">
        <div className="flex items-center gap-2">
          <Camera size={20} className="text-blue-400" />
          <span className="font-semibold">Escaner de Código</span>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Video / Scanner */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-4">
        {!cameraError ? (
          <div className="relative w-full max-w-sm">
            <video
              ref={videoRef}
              className="w-full rounded-xl object-cover"
              playsInline
              muted
              style={{ maxHeight: '60vh' }}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Overlay de escaneo */}
            {status === 'scanning' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-blue-400 rounded-xl relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
                  {/* Línea de escaneo animada */}
                  <div className="absolute inset-x-2 h-0.5 bg-blue-400/80 top-1/2 animate-pulse" />
                </div>
              </div>
            )}

            {/* Estado: encontrado */}
            {status === 'found' && foundProduct && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <CheckCircle size={48} className="text-green-400 mx-auto mb-2" />
                  <p className="text-white font-bold text-lg">{foundProduct.name}</p>
                  <p className="text-green-300 text-sm">{foundProduct.sku}</p>
                </div>
              </div>
            )}

            {/* Estado: no encontrado */}
            {status === 'not_found' && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle size={48} className="text-red-400 mx-auto mb-2" />
                  <p className="text-white font-bold">Código no encontrado</p>
                  <p className="text-gray-300 text-sm">Volviendo a escanear...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-white p-6">
            <Camera size={48} className="mx-auto mb-3 text-gray-500" />
            <p className="text-red-300 mb-2 font-medium">{cameraError}</p>
          </div>
        )}

        {/* Instrucción */}
        {status === 'scanning' && (
          <p className="text-gray-300 text-sm mt-4 text-center">
            Apuntá la cámara al código QR o de barras del producto
          </p>
        )}
      </div>

      {/* Panel inferior */}
      <div className="bg-gray-900 p-4 space-y-3">
        {/* Producto encontrado: confirmar */}
        {status === 'found' && foundProduct && (
          <div className="bg-gray-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <ProductIcon category={foundProduct.category} size="md" className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{foundProduct.name}</p>
                <p className="text-gray-400 text-xs">{foundProduct.sku}</p>
                {mode === 'view' ? (
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
                    <span className="text-amber-300">Depósito: <strong>{foundProduct.stockDepot}</strong> un.</span>
                    <span className="text-emerald-300">Góndola: <strong>{foundProduct.stockGondola}</strong> un.</span>
                    <span className="text-gray-400">Total: <strong>{foundProduct.stockDepot + foundProduct.stockGondola}</strong> un.</span>
                    {foundProduct.stockGondola < 5 && <span className="text-red-400 font-bold">Crítico</span>}
                    {foundProduct.stockGondola >= 5 && foundProduct.stockGondola < 10 && <span className="text-orange-400 font-medium">Bajo</span>}
                  </div>
                ) : (
                  <p className="text-gray-400 text-xs">Góndola: {foundProduct.stockGondola} un.</p>
                )}
                {mode === 'add' && <p className="text-blue-400 font-bold text-sm mt-0.5">${foundProduct.price.toLocaleString()}</p>}
              </div>
            </div>
            <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
              <button
                onClick={handleConfirm}
                className="flex-1 sm:flex-none px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500 transition-colors touch-target"
              >
                {mode === 'add' ? 'Agregar' : 'Ver / Reponer'}
              </button>
              <button
                onClick={() => { setStatus('scanning'); setLastScanned(null); }}
                className="px-4 py-3 sm:py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Búsqueda manual */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por SKU o nombre..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm outline-none focus:border-blue-500"
              value={manualSearch}
              onChange={e => setManualSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
            />
          </div>
          <button
            onClick={handleManualSearch}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
};
