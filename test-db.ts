import { supabase } from './src/lib/supabase/client';

async function test() {
    const { data, error } = await supabase.from('product_grids').select('*').limit(1);
    if (error) {
        console.error(error);
        return;
    }
    console.log('Product Grids first row keys:', Object.keys(data[0] || {}));
    console.log('Product Grids first row sample:', data[0]);
}

test();
