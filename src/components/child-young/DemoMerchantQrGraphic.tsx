import demoQrSvg from '../../assets/demo-sweet-shop-qr.svg';

type DemoMerchantQrGraphicProps = {
  className?: string;
};

/** Demo QR for Sweet Shop payment (not wired to a live payment URL in prototype). */
export function DemoMerchantQrGraphic({ className = '' }: DemoMerchantQrGraphicProps) {
  return (
    <img
      src={demoQrSvg}
      alt=""
      aria-hidden="true"
      className={`h-full w-full object-contain ${className}`}
      draggable={false}
    />
  );
}
