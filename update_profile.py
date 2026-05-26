import re
import sys

path = r'c:\Users\pthay\OneDrive\Documents\Clothing\FrontUserSide\src\app\profile\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Imports
text = text.replace(
    "import { Address, User, Order } from '@/types/store';",
    "import { Order } from '@/types/store';\nimport { supabase } from '@/lib/supabase/client';"
)

# 2. Local variables
text = re.sub(r'const LOCAL_USER: User = \{.*?\};', '', text, flags=re.DOTALL)
text = re.sub(r'const LOCAL_ADDRESSES: Address\[\] = \[.*?\];', '', text, flags=re.DOTALL)

# 3. State Setup
state_setup = '''  const [activeTab, setActiveTab] = useState<Tab>(queryTab || 'profile');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      const { data: custData } = await supabase.from('customers').select('*').eq('id', user.id).single();
      if (custData) {
        setCustomer(custData);
        const names = (custData.full_name || '').split(' ');
        setEditFirst(names[0] || '');
        setEditLast(names.slice(1).join(' ') || '');
      }
      
      const { data: addrData } = await supabase.from('addresses').select('*').eq('customer_id', user.id).order('created_at', { ascending: false });
      if (addrData) setAddresses(addrData);
      
      setLoading(false);
    }
    loadData();
  }, [router]);'''

text = re.sub(r'const \[activeTab.*?const \[editingAddress, setEditingAddress\] = useState<Address \| null>\(null\);', state_setup, text, flags=re.DOTALL)

# 4. UseEffect for queryTab
text = re.sub(r'useEffect\(\(\) => \{\n    if \(queryTab.*?\}, \[queryTab\]\);', '''  useEffect(() => {
    if (queryTab && (queryTab === 'profile' || queryTab === 'orders')) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);''', text, flags=re.DOTALL)

# 5. Handlers
handlers = '''  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const fullName = `${editFirst} ${editLast}`.trim();
    const { data } = await supabase.from('customers').update({ full_name: fullName }).eq('id', user.id).select().single();
    if (data) setCustomer(data);
    setShowEditProfile(false);
  };

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const payload = {
      customer_id: user.id,
      label: addrDefault ? 'Home' : 'Other',
      full_name: `${addrFirst} ${addrLast}`.trim(),
      phone: addrPhone,
      line1: addrLine + (addrApt ? `, ${addrApt}` : ''),
      city: addrCity,
      postal_code: addrPostal,
      is_default: addrDefault,
    };

    if (editingAddress) {
      if (addrDefault) await supabase.from('addresses').update({ is_default: false }).eq('customer_id', user.id);
      const { data } = await supabase.from('addresses').update(payload).eq('id', editingAddress.id).select().single();
      if (data) {
        setAddresses(prev => prev.map(a => a.id === editingAddress.id ? data : (addrDefault ? { ...a, is_default: false } : a)));
      }
    } else {
      if (addrDefault) await supabase.from('addresses').update({ is_default: false }).eq('customer_id', user.id);
      const { data } = await supabase.from('addresses').insert([payload]).select().single();
      if (data) {
        setAddresses(prev => [data, ...(addrDefault ? prev.map(a => ({...a, is_default: false})) : prev)]);
      }
    }
    closeAddressModal();
  };

  const closeAddressModal = () => {
    setAddrFirst(''); setAddrLast(''); setAddrLine(''); setAddrApt('');
    setAddrCity(''); setAddrPostal(''); setAddrPhone(''); setAddrDefault(false);
    setShowAddAddress(false);
    setEditingAddress(null);
  };

  const startEditAddress = (addr: any) => {
    setEditingAddress(addr);
    const names = (addr.full_name || '').split(' ');
    setAddrFirst(names[0] || '');
    setAddrLast(names.slice(1).join(' ') || '');
    const lines = (addr.line1 || '').split(', ');
    setAddrLine(lines[0] || '');
    setAddrApt(lines[1] || '');
    setAddrCity(addr.city || '');
    setAddrPostal(addr.postal_code || '');
    setAddrPhone(addr.phone || '');
    setAddrDefault(addr.is_default || false);
    setShowAddAddress(true);
  };

  const removeAddress = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    setAddresses(prev => prev.filter(a => a.id !== id));
  };'''
text = re.sub(r'  const saveProfile.*?\};\n\n  const removeAddress.*?setAddresses\(prev => prev.filter\(a => a.id !== id\)\);\n  \};', handlers, text, flags=re.DOTALL)

# 6. UI Updates
text = text.replace("value={LOCAL_USER.email}", "value={user?.email || ''}")
text = text.replace("{userName || '—'}", "{customer?.full_name || '—'}")
text = text.replace("{LOCAL_USER.email}", "{user?.email || ''}")
text = text.replace("addr.isDefault", "addr.is_default")
text = text.replace("addr.name", "addr.full_name")
text = text.replace("{addr.city}{addr.pincode ? `, ${addr.pincode}` : ''}", "{addr.city}{addr.postal_code ? `, ${addr.postal_code}` : ''}")

# Loading wrapper
text = text.replace("        {/* ── MAIN ── */}", "        {/* ── MAIN ── */}\\n        {loading ? <div className='py-20 text-center text-gray-500'>Loading profile...</div> : (")
text = text.replace("} />\\n\\n      {/* ── PAGE SHELL ── */}", "} />\\n\\n      {/* ── PAGE SHELL ── */}")
text = text.replace("            </div>\\n          )}\\n        </div>\\n      </div>", "            </div>\\n          )}\\n        </div>\\n        )}\\n      </div>")


with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Done!")
