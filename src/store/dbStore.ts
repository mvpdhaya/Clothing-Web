import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/product';

export interface CategoryNav {
  id: string;
  label: string;
  subcategories: { id: string; label: string }[];
  image: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  cta: string;
}

export interface CategoryGridSlot {
  image: string;
  link: string;
}

export interface HomepageSection {
  id: string;
  name: string;
  active: boolean;
  type: 'banner' | 'products' | 'middle_banner' | 'double_banner' | 'categories';
  displayOrder: number;
  banner?: {
    imageUrl: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    alignment: string;
  };
  grid?: {
    source: string;
    selectedProducts: string[];
    selectedSubcategories: string[];
    description: string;
    itemCount: number;
  };
  categoryGrid?: {
    mainTitle: string;
    slots: CategoryGridSlot[];
  };
}

export interface PaymentMethodSetting {
  icon: string;
  name: string;
  active: boolean;
}

export interface SocialLinkSetting {
  icon: string;
  label: string;
  value: string;
  active: boolean;
}

export interface ShippingRate {
  id: string;
  name: string;
  rate: number;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  storeTagline: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  maintenanceMode: boolean;
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
  freeShippingLabel: string;
  paymentMethods: PaymentMethodSetting[];
  socialLinks: SocialLinkSetting[];
  announcementBarText: string | null;
  maintenanceMessage: string;
  codExtraCharge: number;
}

interface DbState {
  products: Product[];
  categoryNav: CategoryNav[];
  banners: Banner[];
  homepageSections: HomepageSection[];
  storeSettings: StoreSettings | null;
  shippingRates: ShippingRate[];
  loading: boolean;
  error: string | null;
  fetchDbData: () => Promise<void>;
  
  // Selectors
  getNewArrivals: () => Product[];
  getOnSale: () => Product[];
  getFlashSale: () => Product[];
  getBySubcategory: (sub: string) => Product[];
  getProductBySlug: (slug: string) => Product | undefined;
}

export const useDbStore = create<DbState>((set, get) => ({
  products: [],
  categoryNav: [],
  banners: [],
  homepageSections: [],
  storeSettings: null,
  shippingRates: [],
  loading: true,
  error: null,

  fetchDbData: async () => {
    try {
      set({ loading: true, error: null });

      // Fetch all tables in parallel
      const [
        { data: productsRes, error: productsErr },
        { data: categoriesRes, error: categoriesErr },
        { data: subcategoriesRes, error: subcategoriesErr },
        { data: bannersRes, error: bannersErr },
        { data: settingsRes, error: settingsErr },
        { data: homepageSectionsRes, error: homepageSectionsErr },
        { data: gridsRes, error: gridsErr },
        { data: shippingRes, error: shippingErr },
        { data: categoryGridsRes }
      ] = await Promise.all([
        supabase.from('products').select('*').eq('status', 'Active'),
        supabase.from('categories').select('*'),
        supabase.from('subcategories').select('*'),
        supabase.from('promo_banners').select('*'),
        supabase.from('store_settings').select('*'),
        supabase.from('homepage_sections').select('*'),
        supabase.from('product_grids').select('*'),
        supabase.from('shipping_rates').select('*'),
        supabase.from('category_grids').select('*')
      ]);

      if (productsErr) throw productsErr;
      if (categoriesErr) throw categoriesErr;
      if (subcategoriesErr) throw subcategoriesErr;
      if (bannersErr) throw bannersErr;
      if (settingsErr) throw settingsErr;
      if (homepageSectionsErr) throw homepageSectionsErr;
      if (gridsErr) throw gridsErr;
      if (shippingErr) throw shippingErr;

      // 1. Map Products
      const products: Product[] = (productsRes || []).map((p: any) => {
        const imagesList = Array.isArray(p.images) && p.images.length > 0
          ? p.images
          : (p.image ? [p.image] : []);

        const colorsList = Array.isArray(p.colors)
          ? p.colors.map((c: any) => typeof c === 'string' ? { name: c, hex: c } : c)
          : [];

        const isNew = p.badges?.includes('NEW') || false;
        const isSale = p.badges?.includes('SALE') || false;
        const isFlashSale = p.badges?.includes('FLASH') || false;

        return {
          id: p.id,
          name: p.name,
          price: Number(p.price) || 0,
          oldPrice: p.old_price ? Number(p.old_price) : undefined,
          description: p.description || 'A premium boutique apparel piece.',
          category: p.category || 'Clothing',
          subcategory: p.subcategory || 'Shirts',
          images: imagesList,
          sizes: Array.isArray(p.sizes) ? p.sizes : [],
          colors: colorsList,
          isNew,
          isSale,
          isFlashSale,
          flashSaleEnds: '2026-06-30T23:59:00', // default future date
          material: p.material || 'Premium Fabric Blend',
          fit: p.fit || 'Regular Fit',
          sizeChart: p.size_chart,
          stock: typeof p.stock === 'number' ? p.stock : (p.stock ? Number(p.stock) : undefined),
          stock_status: p.stock_status,
          variant_inventory: p.variant_inventory || {},
        };
      });

      // 2. Map Category Navigation
      const subcategories = subcategoriesRes || [];
      const categoryNav: CategoryNav[] = (categoriesRes || []).map((cat: any) => {
        const catSubs = subcategories.filter((sub: any) => sub.category_id === cat.id);
        const capitalizedLabel = cat.name.charAt(0).toUpperCase() + cat.name.slice(1);

        let imageUrl = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80';
        if (cat.name.toLowerCase() === 'men' || cat.name.toLowerCase() === 'clothing') {
          imageUrl = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80';
        } else if (cat.name.toLowerCase() === 'accessories') {
          imageUrl = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80';
        } else if (cat.name.toLowerCase() === 'flash sale') {
          imageUrl = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80';
        }

        const subList = [
          { id: `All ${capitalizedLabel}`, label: `All ${capitalizedLabel}` },
          ...catSubs.map((sub: any) => ({
            id: sub.name,
            label: sub.name.charAt(0).toUpperCase() + sub.name.slice(1)
          }))
        ];

        return {
          id: cat.name,
          label: capitalizedLabel,
          image: imageUrl,
          subcategories: subList
        };
      });

      // 3. Map Banners
      const banners: Banner[] = (bannersRes || []).map((b: any) => ({
        id: b.section_id || 'hero',
        title: b.title || 'Exclusive Season',
        subtitle: b.subtitle || 'Discover premium items',
        image: b.image_url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600',
        link: b.button_link || '/products',
        cta: b.button_text || 'Shop Now'
      }));

      // Fallback banner if none exists
      if (banners.length === 0) {
        banners.push({
          id: 'banner_01',
          title: 'SUMMER SALE',
          subtitle: 'UP TO 50% OFF ON NEW ARRIVALS',
          image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600',
          link: '/products?category=Clothing',
          cta: 'SHOP NOW'
        });
      }

      // 4. Map Store Settings
      let storeSettings: StoreSettings | null = null;
      if (settingsRes && settingsRes.length > 0) {
        const s = settingsRes[0];
        storeSettings = {
          id: s.id,
          storeName: s.store_name || 'VOGUE',
          storeTagline: s.store_tagline || 'Modern Wear',
          storeEmail: s.store_email || '',
          storePhone: s.store_phone || '',
          storeAddress: s.store_address || '',
          maintenanceMode: s.maintenance_mode || false,
          freeShippingEnabled: s.free_shipping_enabled || false,
          freeShippingThreshold: Number(s.free_shipping_threshold) || 10000,
          freeShippingLabel: s.free_shipping_label || 'Free delivery',
          paymentMethods: Array.isArray(s.payment_methods) ? s.payment_methods : [],
          socialLinks: Array.isArray(s.social_links) ? s.social_links : [],
          announcementBarText: s.announcement_bar_text,
          maintenanceMessage: s.maintenance_message || 'Our store is currently under maintenance. We will be back soon!',
          codExtraCharge: Number(s.cod_extra_charge) || 0
        };
      }

      // 5. Map Homepage Sections
      const homepageSections: HomepageSection[] = (homepageSectionsRes || [])
        .filter((sec: any) => sec.active)
        .map((sec: any) => {
          const nameLower = (sec.name || '').toLowerCase();
          const typeLower = (sec.type || '').toLowerCase();

          const type: HomepageSection['type'] =
            typeLower === 'products' ? 'products' :
            (typeLower === 'middle_banner' || nameLower === 'middle banner') ? 'middle_banner' :
            (typeLower === 'double_banner' || typeLower === 'duble_banner' || nameLower === 'double banner' || nameLower === 'duble banner') ? 'double_banner' :
            (typeLower === 'categories' || nameLower === 'categories') ? 'categories' :
            (typeLower === 'banner' || nameLower === 'hero banner') ? 'banner' : 'banner';
          
          let bannerData: any = undefined;
          if (type === 'banner' || type === 'middle_banner' || type === 'double_banner') {
            const pb = (bannersRes || []).find((b: any) => b.section_id === sec.id);
            if (pb) {
              bannerData = {
                imageUrl: pb.image_url || '',
                title: pb.title || '',
                subtitle: pb.subtitle || '',
                buttonText: pb.button_text || 'Shop Now',
                buttonLink: pb.button_link || '/products',
                alignment: pb.alignment || 'right'
              };
            }
          }

          let gridData: any = undefined;
          if (type === 'products') {
            const pg = (gridsRes || []).find((g: any) => g.section_id === sec.id);
            if (pg) {
              const rawProducts = pg.selected_products;
              const rawSubs = pg.selected_subcategories || pg.selected_subcategory;
              
              gridData = {
                source: pg.source || 'manual',
                selectedProducts: Array.isArray(rawProducts) 
                  ? rawProducts 
                  : (typeof rawProducts === 'string' ? rawProducts.split(',').map((s: string) => s.trim()) : []),
                selectedSubcategories: Array.isArray(rawSubs) 
                  ? rawSubs 
                  : (typeof rawSubs === 'string' ? rawSubs.split(',').map((s: string) => s.trim()) : []),
                description: pg.description || '',
                itemCount: Number(pg.item_count) || 8
              };
            }
          }

          let categoryGridData: HomepageSection['categoryGrid'] = undefined;
          if (type === 'categories') {
            const cg = (categoryGridsRes || []).find((c: any) => c.section_id === sec.id);
            if (cg) {
              categoryGridData = {
                mainTitle: cg.main_title || 'SHOP OUR TOP CATEGORIES',
                slots: [
                  { image: cg.cat1_image || '', link: cg.cat1_link || '' },
                  { image: cg.cat2_image || '', link: cg.cat2_link || '' },
                  { image: cg.cat3_image || '', link: cg.cat3_link || '' },
                  { image: cg.cat4_image || '', link: cg.cat4_link || '' },
                ]
              };
            }
          }

          return {
            id: sec.id,
            name: sec.name || 'Unnamed Section',
            active: sec.active,
            type,
            displayOrder: Number(sec.display_order) || 0,
            banner: bannerData,
            grid: gridData,
            categoryGrid: categoryGridData
          };
        });

      // Sort by display order
      homepageSections.sort((a, b) => a.displayOrder - b.displayOrder);

      set({
        products,
        categoryNav,
        banners,
        homepageSections,
        storeSettings,
        shippingRates: (shippingRes || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          rate: Number(s.rate) || 0
        })),
        loading: false,
        error: null
      });

    } catch (err: any) {
      console.error('Error fetching Supabase data:', err);
      set({ loading: false, error: err.message || 'Unknown fetching error' });
    }
  },

  getNewArrivals: () => {
    return get().products.filter(p => p.isNew).slice(0, 8);
  },

  getOnSale: () => {
    return get().products.filter(p => p.isSale && !p.isFlashSale).slice(0, 8);
  },

  getFlashSale: () => {
    return get().products.filter(p => p.isFlashSale);
  },

  getBySubcategory: (sub: string) => {
    const products = get().products;
    const lower = sub.toLowerCase();
    
    if (lower === 'all clothing' || lower === 'clothing' || lower === 'men') {
      return products.filter(p => 
        p.category.toLowerCase() === 'clothing' || 
        p.category.toLowerCase() === 'men'
      );
    }
    if (lower === 'all accessories' || lower === 'accessories') {
      return products.filter(p => p.category.toLowerCase() === 'accessories');
    }
    if (lower === 'flash sale') {
      return products.filter(p => p.isFlashSale);
    }
    
    return products.filter(p => 
      p.subcategory.toLowerCase() === lower || 
      p.subcategory.replace('-', ' ').toLowerCase() === lower.replace('-', ' ')
    );
  },

  getProductBySlug: (slug: string) => {
    const products = get().products;
    return products.find(p => 
      p.id === slug || 
      p.name.toLowerCase().replace(/ /g, '-') === slug.toLowerCase()
    );
  }
}));
