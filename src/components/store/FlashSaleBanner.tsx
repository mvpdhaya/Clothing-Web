import React from 'react';
import Link from 'next/link';

interface FlashSaleBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
  alignment?: 'left' | 'center' | 'right';
}

const FlashSaleBanner: React.FC<FlashSaleBannerProps> = ({
  title = 'FLASH SALE — UP TO 70% OFF',
  subtitle = 'Limited time. Limited stock. Act fast.',
  buttonText = 'SHOP FLASH SALE',
  buttonLink = '/category/flash-sale',
  imageUrl = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop',
  alignment = 'left'
}) => {
  const textAlignment = alignment === 'center' ? 'text-center items-center' :
                        alignment === 'right' ? 'text-right items-end' : 'text-left items-start';

  const textOrder = alignment === 'right' ? 'lg:order-2' : 'lg:order-1';
  const imageOrder = alignment === 'right' ? 'lg:order-1' : 'lg:order-2';
  const gradientDirection = alignment === 'right' ? 'lg:bg-gradient-to-l' : 'lg:bg-gradient-to-r';

  return (
    <section className="bg-black relative overflow-hidden py-6 sm:py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-[60px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[350px] lg:min-h-[450px] bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-neutral-900 group">
          <div className={`col-span-1 lg:col-span-7 flex flex-col justify-center p-8 sm:p-14 text-white z-10 ${textAlignment} ${textOrder}`}>
            <h2 className="text-3xl sm:text-5xl font-black mb-3 sm:mb-4 uppercase tracking-tighter leading-none bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-neutral-400 mb-8 sm:mb-10 max-w-md leading-relaxed text-sm sm:text-base">
              {subtitle}
            </p>
            {buttonText && (
              <Link
                href={buttonLink}
                className="inline-block px-10 py-3.5 sm:px-12 sm:py-4 border border-neutral-400 hover:border-white text-white font-bold text-xs sm:text-sm tracking-widest uppercase bg-transparent hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-[1.02] shadow-lg rounded-sm"
              >
                {buttonText}
              </Link>
            )}
          </div>
          <div className={`col-span-1 lg:col-span-5 relative overflow-hidden min-h-[250px] lg:min-h-auto ${imageOrder}`}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${gradientDirection} from-neutral-950 via-neutral-950/40 to-transparent`}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashSaleBanner;
