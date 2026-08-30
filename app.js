const { useState, useEffect } = React;

/* ---------- Supabase config ---------- */
const SUPABASE_URL = 'https://oskheiwnkklfumzzhjkd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jRizYnzfIdm_XQpHlFKLZQ_QYbaQnFH';

async function uploadFileToSupabase(file) {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/order-files/${path}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: file,
  });
  if (!res.ok) throw new Error('upload failed');
  return `${SUPABASE_URL}/storage/v1/object/public/order-files/${path}`;
}

async function insertOrderToSupabase(order) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      order_code: order.id,
      service_title: order.serviceTitle,
      package_label: order.packageLabel,
      price: order.price,
      name: order.name,
      contact: order.contact,
      description: order.desc,
      reference: order.reference,
      deadline: order.deadline,
      file_url: order.fileUrl || null,
      audio_file_url: order.audioFileUrl || null,
    }),
  });
  if (!res.ok) throw new Error('insert failed');
}

async function updateOrderByCode(orderCode, patch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?order_code=eq.${encodeURIComponent(orderCode)}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('update failed');
}

async function fetchOrdersByContact(contact) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&contact=eq.${encodeURIComponent(contact)}&order=created_at.desc`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error('fetch failed');
  return res.json();
}

async function fetchPortfolio() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio?select=*&order=created_at.desc`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error('fetch failed');
  return res.json();
}

const PAYMENT_CARD = { number: '6219861916255325', holder: 'جمال محمدی' };

/* ---------- local icon set (replaces lucide-react — no bundler here) ---------- */
function Icon({ size = 18, color = 'currentColor', style, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {children}
    </svg>
  );
}
const Home = (p) => <Icon {...p}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></Icon>;
const ClipboardList = (p) => <Icon {...p}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect width="8" height="4" x="8" y="2" rx="1" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></Icon>;
const Music2 = (p) => <Icon {...p}><circle cx="8" cy="18" r="4" /><path d="M12 18V2l7 4" /></Icon>;
const Wand2 = (p) => <Icon {...p}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></Icon>;
const AudioLines = (p) => <Icon {...p}><path d="M2 10v3" /><path d="M6 6v11" /><path d="M10 3v18" /><path d="M14 8v7" /><path d="M18 5v13" /><path d="M22 10v3" /></Icon>;
const Palette = (p) => <Icon {...p}><circle cx="13.5" cy="6.5" r=".5" fill={p.color || 'currentColor'} /><circle cx="17.5" cy="10.5" r=".5" fill={p.color || 'currentColor'} /><circle cx="8.5" cy="7.5" r=".5" fill={p.color || 'currentColor'} /><circle cx="6.5" cy="12.5" r=".5" fill={p.color || 'currentColor'} /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></Icon>;
const ChevronLeft = (p) => <Icon {...p}><path d="m15 18-6-6 6-6" /></Icon>;
const Check = (p) => <Icon {...p}><path d="M20 6 9 17l-5-5" /></Icon>;
const Clock = (p) => <Icon {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></Icon>;
const Phone = (p) => <Icon {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></Icon>;
const XIcon = (p) => <Icon {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>;
const TelegramIcon = (p) => <Icon {...p}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></Icon>;
const WhatsappIcon = (p) => <Icon {...p}><path d="M3 21l1.65-4.95A9 9 0 1 1 8.05 19.35Z" /><path d="M8.5 8.5c0 4 3 7 7 7 .5-1 1-2 .5-2.5-1-.5-2-1-2.5-.5-.3.3-.5.7-.8 1-1.2-.6-2.2-1.6-2.8-2.8.3-.3.7-.5 1-.8.5-.5 0-1.5-.5-2.5-.5-.5-1.5 0-2.5.5" /></Icon>;
const Link2 = (p) => <Icon {...p}><path d="M9 17H7A5 5 0 0 1 7 7h2" /><path d="M15 7h2a5 5 0 1 1 0 10h-2" /><line x1="8" x2="16" y1="12" y2="12" /></Icon>;
const User = (p) => <Icon {...p}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>;
const Send = (p) => <Icon {...p}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></Icon>;
const Gift = (p) => <Icon {...p}><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8" /><path d="M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8" /></Icon>;
const Package = (p) => <Icon {...p}><path d="M16.5 9.4 7.55 4.24" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96 12 12.01l8.73-5.05" /><path d="M12 22.08V12" /></Icon>;
const CreditCard = (p) => <Icon {...p}><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></Icon>;
const Copy = (p) => <Icon {...p}><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></Icon>;
const Download = (p) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></Icon>;
const Search = (p) => <Icon {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>;
const Image2 = (p) => <Icon {...p}><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></Icon>;
const ArrowRight = (p) => <Icon {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Icon>;

/* ---------- design tokens ---------- */
const colors = {
  bg: '#0a0a0c',
  surface: 'rgba(8,8,10,0.58)',
  surface2: 'rgba(8,8,10,0.72)',
  border: 'rgba(255,255,255,0.14)',
  red: '#ff3b5c',
  redDim: 'rgba(255,59,92,0.24)',
  gold: '#f0b429',
  goldDim: 'rgba(240,180,41,0.22)',
  text: '#f8f8fa',
  textMuted: '#cfcfd4',
  textFaint: '#9d9da3',
  success: '#34d399',
};
const glass = { backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)' };
const font = { fontFamily: "'Vazirmatn', sans-serif" };
const LOGO_URL = 'data:image/jpeg;base64,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';

/* ---------- service + pricing data ---------- */
const services = [
  {
    id: 'cover',
    title: 'طراحی کاور',
    icon: Music2,
    tagline: 'کاورموزیک حرفه‌ای با فضاسازی و پالت رنگی اختصاصی',
    packages: [
      { id: 'vip', label: 'VIP', price: '۱,۱۰۰,۰۰۰ تومان', features: ['طراحی کاور حرفه‌ای و فضاسازی', 'انتخاب پالت رنگی اختصاصی', 'فونت‌آرایی حرفه‌ای', 'افکت‌گذاری حرفه‌ای'], gift: 'طراحی کامینگ‌سون رایگان' },
      { id: 'pro', label: 'حرفه‌ای', price: '۸۸۰,۰۰۰ تومان', features: ['طراحی کاور حرفه‌ای', 'پالت رنگی', 'افکت‌گذاری', 'فونت‌آرایی'] },
      { id: 'eco', label: 'اقتصادی', price: '۶۵۰,۰۰۰ تومان', features: ['طراحی کاور حرفه‌ای و مناسب کار', 'پالت رنگی', 'فونت‌آرایی'] },
    ],
  },
  {
    id: 'equalizer',
    title: 'طراحی اکولایزر',
    icon: AudioLines,
    tagline: 'اکولایزر و موشن‌گرافی هماهنگ با ریتم آهنگ',
    packages: [
      { id: 'vip', label: 'VIP', price: '۱,۵۰۰,۰۰۰ تومان', features: ['طراحی اکولایزر حرفه‌ای و منحصربه‌فرد', 'موشن‌گرافی حرفه‌ای', 'افکت‌گذاری حرفه‌ای'], gift: 'نسخه کامینگ‌سون استوری رایگان' },
      { id: 'pro', label: 'حرفه‌ای', price: '۱,۲۰۰,۰۰۰ تومان', features: ['طراحی اکولایزر حرفه‌ای', 'افکت‌گذاری حرفه‌ای'] },
      { id: 'eco', label: 'اقتصادی', price: '۱,۰۰۰,۰۰۰ تومان', features: ['طراحی اکولایزر حرفه‌ای و مناسب کار', 'افکت‌گذاری'], gift: 'هزینه شعرنویسی برای اکولایزر تا ۱ دقیقه رایگان' },
    ],
  },
  {
    id: 'visualizer',
    title: 'طراحی ویژوالایزر',
    icon: Wand2,
    tagline: 'ویژوالایزر سینمایی هماهنگ با ضرب و فضای موزیک',
    packages: [
      { id: 'eco', label: 'اقتصادی', price: '۱,۲۰۰,۰۰۰ تومان', features: ['طراحی ویژوالایزر حرفه‌ای', 'هماهنگ با ریتم و ضرب موزیک', 'افکت‌های تصویری جذاب', 'تایپوگرافی نام خواننده و آهنگ', 'خروجی با کیفیت بالا', 'مناسب انتشار در اینستاگرام و تلگرام'] },
      { id: 'pro', label: 'حرفه‌ای', price: '۱,۳۰۰,۰۰۰ تومان', features: ['تمام امکانات پکیج اقتصادی', 'موشن‌گرافیک حرفه‌ای‌تر', 'افکت‌های ویژه و سینمایی', 'فضاسازی متناسب با سبک موزیک', 'انیمیشن اختصاصی المان‌ها', 'خروجی با کیفیت بالا و استاندارد انتشار'] },
      { id: 'vip', label: 'VIP', price: '۱,۵۰۰,۰۰۰ تومان', features: ['طراحی ویژوالایزر کاملاً اختصاصی', 'فضاسازی و طراحی بصری حرفه‌ای', 'موشن‌گرافیک و افکت‌های پیشرفته', 'هماهنگی دقیق با ضرب و فضای موزیک', 'طراحی المان‌های اختصاصی', 'رنگ‌بندی و تایپوگرافی اختصاصی', 'خروجی نهایی با بالاترین کیفیت'] },
    ],
  },
  {
    id: 'logo',
    title: 'طراحی لوگو',
    icon: Palette,
    tagline: 'لوگو و هویت بصری برای پیج یا برند موسیقی',
    packages: [
      { id: 'inquiry', label: 'استعلام قیمت', price: 'بعد از توضیح سفارش اعلام می‌شود', features: ['بعد از دیدن جزئیات کار، قیمت دقیق اعلام می‌شود'] },
    ],
  },
];

function EqBars({ size = 'sm', color = colors.red }) {
  const heights = [10, 18, 26, 16, 22];
  const dims = size === 'sm' ? { w: 3, gap: 3, base: 8 } : { w: 4, gap: 4, base: 10 };
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: dims.gap, height: 28 }}>
      {heights.map((h, i) => (
        <div key={i} style={{ width: dims.w, height: dims.base, background: color, borderRadius: 2, animation: `eqbar 900ms ease-in-out ${i * 120}ms infinite alternate`, transformOrigin: 'bottom', '--maxh': `${h}px` }} />
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    'در انتظار بررسی': { c: colors.gold, bg: colors.goldDim },
    'در حال انجام': { c: colors.red, bg: colors.redDim },
    'تحویل شده': { c: colors.success, bg: '#0f3a26' },
    'نیاز به ویرایش': { c: colors.gold, bg: colors.goldDim },
    'تایید نهایی': { c: colors.success, bg: '#0f3a26' },
  };
  const s = map[status] || map['در انتظار بررسی'];
  return <span style={{ color: s.c, background: s.bg, fontSize: 11, padding: '4px 10px', borderRadius: 999, fontWeight: 600, whiteSpace: 'nowrap' }}>{status}</span>;
}

const CONTACT_LINKS = {
  telegram: 'https://t.me/jamalvfx',
  whatsapp: 'https://wa.me/989172739342',
  instagram: 'https://www.instagram.com/jamalvfx_',
};

function ContactSheet({ onClose }) {
  const options = [
    { key: 'telegram', label: 'تلگرام', icon: TelegramIcon, url: CONTACT_LINKS.telegram, color: '#2AABEE' },
    { key: 'whatsapp', label: 'واتساپ', icon: WhatsappIcon, url: CONTACT_LINKS.whatsapp, color: '#25D366' },
    { key: 'instagram', label: 'اینستاگرام', icon: Image2, url: CONTACT_LINKS.instagram, color: '#E1306C' },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ ...glass, background: 'rgba(6,6,8,0.92)', border: `1px solid ${colors.border}`, borderRadius: '20px 20px 0 0', padding: '18px 20px calc(24px + env(safe-area-inset-bottom))', width: '100%', maxWidth: 480 }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.2)', margin: '0 auto 16px' }} />
        <div style={{ color: colors.text, fontWeight: 800, fontSize: 15, marginBottom: 16, textAlign: 'center' }}>ارتباط با ما</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map((o) => (
            <a
              key={o.key}
              href={o.url}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 12, background: colors.surface2, border: `1px solid ${colors.border}`, borderRadius: 12, padding: '13px 16px', textDecoration: 'none' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: o.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <o.icon size={17} color="#fff" />
              </div>
              <span style={{ color: colors.text, fontSize: 13.5, fontWeight: 600 }}>{o.label}</span>
            </a>
          ))}
        </div>
        <button onClick={onClose} style={{ ...secondaryBtnStyle, width: '100%', marginTop: 16 }}>بستن</button>
      </div>
    </div>
  );
}

function SideCapsule({ screen, onOrders, badge }) {
  const [showContact, setShowContact] = useState(false);
  const items = [
    { key: 'orders', icon: ClipboardList, onClick: onOrders, active: screen === 'orders', badge },
    { key: 'contact', icon: Phone, onClick: () => setShowContact(true), active: showContact },
  ];
  return (
    <>
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          zIndex: 60,
        }}
      >
        {items.map((it, i) => (
          <button
            key={it.key}
            onClick={it.onClick}
            style={{
              ...glass,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#000',
              border: '1px solid rgba(255,255,255,0.08)',
              borderInlineStart: 'none',
              borderTop: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              borderRadius: i === 0 ? '999px 999px 0 0' : '0 0 999px 999px',
              width: 38,
              height: 38,
              paddingInlineStart: 4,
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '3px 0 14px rgba(0,0,0,0.6)',
            }}
          >
            <it.icon size={16} color={it.active ? colors.red : 'rgba(255,255,255,0.85)'} />
            {!!it.badge && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: colors.red, color: '#fff', fontSize: 9, width: 14, height: 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.badge}</span>
            )}
          </button>
        ))}
      </div>
      {showContact && <ContactSheet onClose={() => setShowContact(false)} />}
    </>
  );
}

function App() {
  const [screen, setScreen] = useState('home');

  useEffect(() => {
    document.body.classList.add('bg-kick');
    const t = setTimeout(() => document.body.classList.remove('bg-kick'), 750);
    return () => clearTimeout(t);
  }, [screen]);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [orderStep, setOrderStep] = useState(1);
  const [form, setForm] = useState({ name: '', contact: '', desc: '', reference: '', deadline: 'normal' });
  const [orderImageFile, setOrderImageFile] = useState(null);
  const [orderAudioFile, setOrderAudioFile] = useState(null);
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('jamalvfx_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [lastOrder, setLastOrder] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [activeOrderCount, setActiveOrderCount] = useState(0);

  async function refreshActiveOrderCount() {
    let contact = '';
    try {
      contact = localStorage.getItem('jamalvfx_contact') || '';
    } catch (e) {}
    if (!contact.trim()) return;
    try {
      const data = await fetchOrdersByContact(contact.trim());
      setActiveOrderCount(data.filter((o) => o.status !== 'تحویل شده').length);
    } catch (e) {}
  }

  useEffect(() => {
    refreshActiveOrderCount();
  }, []);

  useEffect(() => {
    if (screen === 'orders' || screen === 'confirm') refreshActiveOrderCount();
  }, [screen]);

  function goOrder(service) {
    setSelectedService(service || null);
    setSelectedPackage(null);
    setOrderStep(service ? 2 : 1);
    setScreen('order');
  }
  function goOrderFromSample(item) {
    const matchedService = services.find((s) => s.id === item.category) || null;
    const matchedPackage = matchedService && item.price ? matchedService.packages.find((p) => p.price === item.price) || null : null;
    setSelectedService(matchedService);
    setSelectedPackage(matchedPackage);
    setForm((f) => ({ ...f, reference: item.title ? `نمونه‌کار انتخابی: ${item.title}` : f.reference }));
    setOrderStep(matchedPackage ? 3 : matchedService ? 2 : 1);
    setScreen('order');
  }
  function updateForm(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }
  function validateStep3() {
    const e = {};
    if (!form.name.trim()) e.name = 'نام رو وارد کن';
    if (!form.contact.trim()) e.contact = 'یه راه ارتباطی وارد کن';
    if (!form.desc.trim()) e.desc = 'توضیح کوتاهی از سفارش بنویس';
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function submitOrder() {
    setSubmitting(true);
    setSubmitError('');
    const orderNum = 'JV-' + Math.floor(1000 + Math.random() * 9000);
    try {
      let fileUrl = null;
      let audioFileUrl = null;
      if (orderImageFile) {
        fileUrl = await uploadFileToSupabase(orderImageFile);
      }
      if (orderAudioFile) {
        audioFileUrl = await uploadFileToSupabase(orderAudioFile);
      }
      const newOrder = { id: orderNum, serviceTitle: selectedService.title, packageLabel: selectedPackage.label, price: selectedPackage.price, status: 'در انتظار بررسی', fileUrl, audioFileUrl, ...form };
      await insertOrderToSupabase(newOrder);
      setOrders((prev) => {
        const updated = [newOrder, ...prev];
        try {
          localStorage.setItem('jamalvfx_orders', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      setLastOrder(newOrder);
      try {
        localStorage.setItem('jamalvfx_contact', form.contact.trim());
      } catch (e) {}
      setScreen('confirm');
    } catch (err) {
      setSubmitError('ارسال سفارش با خطا مواجه شد. دوباره امتحان کن.');
    } finally {
      setSubmitting(false);
    }
  }
  function resetAndGoHome() {
    setForm({ name: '', contact: '', desc: '', reference: '', deadline: 'normal' });
    setOrderImageFile(null);
    setOrderAudioFile(null);
    setErrors({});
    setSelectedService(null);
    setSelectedPackage(null);
    setOrderStep(1);
    setScreen('home');
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto', ...font }} dir="rtl">
      <SideCapsule screen={screen} onOrders={() => setScreen('orders')} badge={activeOrderCount} />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {screen === 'home' && <HomeScreen onSelectService={goOrder} onOrder={() => goOrder(null)} onPortfolio={() => setScreen('portfolio')} />}
        {screen === 'portfolio' && <PortfolioScreen onBack={() => setScreen('home')} onOrderFromSample={goOrderFromSample} />}
        {screen === 'order' && (
          <OrderScreen
            step={orderStep}
            setStep={setOrderStep}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
            form={form}
            updateForm={updateForm}
            errors={errors}
            onValidate={validateStep3}
            onSubmit={submitOrder}
            onCancel={() => setScreen('home')}
            orderImageFile={orderImageFile}
            setOrderImageFile={setOrderImageFile}
            orderAudioFile={orderAudioFile}
            setOrderAudioFile={setOrderAudioFile}
            submitting={submitting}
            submitError={submitError}
          />
        )}
        {screen === 'confirm' && lastOrder && <ConfirmScreen order={lastOrder} onDone={resetAndGoHome} onSeeOrders={() => setScreen('orders')} />}
        {screen === 'orders' && <OrdersScreen onNewOrder={() => goOrder(null)} onSearched={refreshActiveOrderCount} />}
      </div>

      <div
        style={{
          ...glass,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '12px 10px',
          background: 'rgba(10,8,8,0.68)',
          border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: 999,
          boxShadow: '0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
          position: 'fixed',
          left: 14,
          right: 14,
          bottom: 'calc(14px + env(safe-area-inset-bottom))',
          maxWidth: 452,
          margin: '0 auto',
          zIndex: 50,
        }}
      >
        <NavItem icon={Home} label="خانه" active={screen === 'home'} onClick={() => setScreen('home')} />
        <NavItem icon={Image2} label="نمونه‌کار" active={screen === 'portfolio'} onClick={() => setScreen('portfolio')} />
        <NavItem icon={Send} flip active={screen === 'order'} label="سفارش" onClick={() => goOrder(null)} accent />
        <NavItem icon={ClipboardList} label="سفارش‌ها" active={screen === 'orders'} onClick={() => setScreen('orders')} badge={activeOrderCount} />
      </div>
    </div>
  );
}

function NavItem({ icon: IconCmp, label, active, onClick, badge, accent, flip }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '2px 10px' }}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: accent ? `linear-gradient(135deg, ${colors.red}, #c2183a)` : active ? 'rgba(255,255,255,0.14)' : 'transparent',
          boxShadow: accent ? '0 4px 14px rgba(255,59,92,0.5)' : 'none',
        }}
      >
        <IconCmp size={18} color={accent ? '#fff' : active ? '#fff' : 'rgba(255,255,255,0.55)'} style={flip ? { transform: 'scaleX(-1)' } : undefined} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: accent || active ? '#fff' : 'rgba(255,255,255,0.5)' }}>{label}</span>
      {!!badge && (
        <span style={{ position: 'absolute', top: -2, left: 4, background: colors.red, color: '#fff', fontSize: 9.5, width: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</span>
      )}
    </button>
  );
}

function PortfolioScreen({ onBack, onOrderFromSample }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState(services[0].id);

  useEffect(() => {
    fetchPortfolio()
      .then((data) => setItems(data))
      .catch(() => setError('خطا در دریافت نمونه‌کارها'))
      .finally(() => setLoading(false));
  }, []);

  const categories = services.map((s) => ({ id: s.id, title: s.title }));
  const filtered = items.filter((i) => i.category === filter);

  if (active) {
    const isImage = active.media_url && /\.(jpg|jpeg|png|gif|webp)$/i.test(active.media_url);
    const isVideo = active.media_url && /\.(mp4|webm|mov)$/i.test(active.media_url);
    const isAudio = active.media_url && /\.(mp3|wav|ogg|m4a)$/i.test(active.media_url);
    return (
      <div className="fade-up" style={{ padding: '4px 20px 20px' }}>
        <ScreenHeader title={active.title || 'نمونه‌کار'} onBack={() => setActive(null)} />
        <div style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 16, maxHeight: '52vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isImage && <img src={active.media_url} alt={active.title} style={{ width: '100%', maxHeight: '52vh', objectFit: 'cover', display: 'block' }} />}
          {isVideo && <video src={active.media_url} controls style={{ width: '100%', maxHeight: '52vh', objectFit: 'contain', display: 'block' }} />}
          {isAudio && <div style={{ padding: 16, width: '100%' }}><audio controls src={active.media_url} style={{ width: '100%' }} /></div>}
          {!active.media_url && <div style={{ padding: 30, textAlign: 'center', color: colors.textFaint, fontSize: 12 }}>فایلی برای این نمونه ثبت نشده</div>}
        </div>
        {active.price && <div style={{ color: colors.success, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{active.price}</div>}
        {active.note && <div style={{ color: colors.textMuted, fontSize: 12.5, lineHeight: 1.9, marginBottom: 18 }}>{active.note}</div>}
        <button onClick={() => onOrderFromSample(active)} style={{ ...primaryBtnStyle, width: '100%' }}>سفارش با این نمونه</button>
      </div>
    );
  }

  return (
    <div className="fade-up" style={{ padding: '4px 20px 20px' }}>
      <ScreenHeader title="نمونه‌کارها" onBack={onBack} />
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 2 }}>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            style={{
              flexShrink: 0, fontSize: 11.5, padding: '7px 14px', borderRadius: 999, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap',
              border: `1.5px solid ${filter === c.id ? colors.red : colors.border}`,
              background: filter === c.id ? colors.redDim : 'transparent',
              color: filter === c.id ? colors.text : colors.textMuted,
            }}
          >
            {c.title}
          </button>
        ))}
      </div>
      {loading && <div style={{ color: colors.textMuted, textAlign: 'center', padding: 30, fontSize: 12.5 }}>در حال بارگذاری...</div>}
      {error && <div style={{ color: colors.red, textAlign: 'center', padding: 20, fontSize: 12.5 }}>{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 10px', color: colors.textFaint }}>
          <Image2 size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <div style={{ fontSize: 12.5, color: colors.textMuted }}>هنوز نمونه‌کاری اضافه نشده</div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {filtered.map((item) => {
          const isImage = item.media_url && /\.(jpg|jpeg|png|gif|webp)$/i.test(item.media_url);
          const thumb = item.cover_image_url || (isImage ? item.media_url : null);
          return (
            <button key={item.id} onClick={() => setActive(item)} style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, overflow: 'hidden', cursor: 'pointer', padding: 0, textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', aspectRatio: '1', background: colors.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {thumb ? <img src={thumb} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Image2 size={24} color={colors.textFaint} />}
              </div>
              <div style={{ padding: '8px 10px' }}>
                <div style={{ color: colors.text, fontSize: 11.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title || 'نمونه‌کار'}</div>
                {item.category && <div style={{ color: colors.textFaint, fontSize: 10, marginTop: 2 }}>{(services.find((s) => s.id === item.category) || {}).title || item.category}</div>}
                {item.price && <div style={{ color: colors.success, fontSize: 10, fontWeight: 600, marginTop: 2 }}>{item.price}</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HomeScreen({ onSelectService, onOrder, onPortfolio }) {
  return (
    <div className="fade-up" style={{ padding: '20px 20px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <div style={{ width: 46, height: 46, borderRadius: '50%', border: `2px solid ${colors.red}`, padding: 2, flexShrink: 0 }}>
          <img src={LOGO_URL} alt="jamalvfx_" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div>
          <div style={{ color: colors.text, fontWeight: 700, fontSize: 15 }}>jamalvfx_</div>
          <div style={{ color: colors.textMuted, fontSize: 12 }}>طراحی موشن | کاورموزیک | اکولایزر</div>
        </div>
      </div>

      <div style={{ ...glass, background: `linear-gradient(135deg, ${colors.surface2}, ${colors.surface})`, border: `1px solid ${colors.border}`, borderRadius: 20, padding: 20, marginBottom: 20, position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
        <div style={{ position: 'absolute', top: 16, left: 16 }}>
          <EqBars size="md" />
        </div>
        <div style={{ color: colors.text, fontSize: 19, fontWeight: 800, lineHeight: 1.7, marginBottom: 6 }}>
          سفارشت رو بگو،
          <br />
          ما تصویرش می‌کنیم
        </div>
        <div style={{ color: colors.textMuted, fontSize: 13, marginBottom: 16, maxWidth: 220 }}>کاورموزیک، اکولایزر و ویژوالایزر اختصاصی برای آهنگ و برند تو</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onOrder} style={{ flex: 1, background: colors.red, color: '#fff', border: 'none', borderRadius: 12, padding: '11px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', ...font }}>
            ثبت سفارش جدید
          </button>
          <button onClick={onPortfolio} style={{ ...glass, flex: 1, background: 'rgba(255,255,255,0.12)', color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 12, padding: '11px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, ...font }}>
            <Image2 size={15} />
            دیدن نمونه‌کار
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, padding: '0 4px' }}>
        <TrustStat value="۱۴۹K" label="فالوور" />
        <TrustStat value="۱,۰۱۳" label="پست منتشرشده" />
        <TrustStat value="۶۰K+" label="بازدید ماهانه" />
      </div>

      <div style={{ color: colors.text, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>چه خدمتی می‌خوای؟</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {services.map((s) => {
          const IconCmp = s.icon;
          const fromPrice = s.packages[s.packages.length - 1].price;
          return (
            <button key={s.id} onClick={() => onSelectService(s)} style={{ ...glass, display: 'flex', alignItems: 'center', gap: 14, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 14, cursor: 'pointer', textAlign: 'right', ...font }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: colors.redDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconCmp size={20} color={colors.red} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: colors.text, fontWeight: 700, fontSize: 13 }}>{s.title}</div>
                <div style={{ color: colors.textMuted, fontSize: 11.5, marginTop: 2, lineHeight: 1.6 }}>{s.tagline}</div>
                <div style={{ color: colors.red, fontSize: 11, marginTop: 4, fontWeight: 700 }}>{s.id === 'logo' ? 'استعلام قیمت' : `شروع از ${fromPrice}`}</div>
              </div>
              <ChevronLeft size={18} color={colors.textFaint} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TrustStat({ value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: colors.text, fontWeight: 800, fontSize: 15 }}>{value}</div>
      <div style={{ color: colors.textFaint, fontSize: 10.5, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function OrderScreen({ step, setStep, selectedService, setSelectedService, selectedPackage, setSelectedPackage, form, updateForm, errors, onValidate, onSubmit, onCancel, orderImageFile, setOrderImageFile, orderAudioFile, setOrderAudioFile, submitting, submitError }) {
  return (
    <div className="fade-up" style={{ padding: '4px 20px 20px' }}>
      <ScreenHeader title="ثبت سفارش" onBack={onCancel} />

      <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: n <= step ? colors.red : colors.border }} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <div style={{ color: colors.text, fontWeight: 700, fontSize: 15, marginBottom: 14 }}>نوع خدمت رو انتخاب کن</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {services.map((s) => {
              const IconCmp = s.icon;
              const active = selectedService && selectedService.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedService(s);
                    setSelectedPackage(null);
                  }}
                  style={{ ...glass, display: 'flex', alignItems: 'center', gap: 12, background: active ? colors.redDim : colors.surface, border: `1.5px solid ${active ? colors.red : colors.border}`, borderRadius: 14, padding: 13, cursor: 'pointer', textAlign: 'right', ...font }}
                >
                  <IconCmp size={18} color={active ? colors.red : colors.textMuted} />
                  <span style={{ color: colors.text, fontWeight: 600, fontSize: 13 }}>{s.title}</span>
                  {active && <Check size={16} color={colors.red} style={{ marginRight: 'auto' }} />}
                </button>
              );
            })}
          </div>
          <button
            disabled={!selectedService}
            onClick={() => setStep(2)}
            style={{ ...glass, width: '100%', marginTop: 22, background: selectedService ? colors.red : colors.surface2, color: selectedService ? '#fff' : colors.textFaint, border: 'none', borderRadius: 12, padding: '13px', fontWeight: 700, fontSize: 13, cursor: selectedService ? 'pointer' : 'not-allowed', ...font }}
          >
            ادامه
          </button>
        </div>
      )}

      {step === 2 && selectedService && (
        <div>
          <div style={{ color: colors.textMuted, fontSize: 12, marginBottom: 16 }}>
            یه پکیج برای <span style={{ color: colors.red, fontWeight: 700 }}>{selectedService.title}</span> انتخاب کن
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {selectedService.packages.map((p) => {
              const active = selectedPackage && selectedPackage.id === p.id;
              return (
                <button key={p.id} onClick={() => setSelectedPackage(p)} style={{ ...glass, background: active ? colors.redDim : colors.surface, border: `1.5px solid ${active ? colors.red : colors.border}`, borderRadius: 16, padding: 15, cursor: 'pointer', textAlign: 'right', ...font }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Package size={15} color={active ? colors.red : colors.textMuted} />
                      <span style={{ color: colors.text, fontWeight: 800, fontSize: 13.5 }}>{p.label}</span>
                    </div>
                    <span style={{ color: colors.red, fontWeight: 800, fontSize: 13 }}>{p.price}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {p.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <Check size={12} color={colors.success} style={{ marginTop: 2, flexShrink: 0 }} />
                        <span style={{ color: colors.textMuted, fontSize: 11.5, lineHeight: 1.6 }}>{f}</span>
                      </div>
                    ))}
                    {p.gift && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <Gift size={12} color={colors.gold} style={{ flexShrink: 0 }} />
                        <span style={{ color: colors.gold, fontSize: 11.5, fontWeight: 600 }}>{p.gift}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={() => setStep(1)} style={secondaryBtnStyle}>بازگشت</button>
            <button
              disabled={!selectedPackage}
              onClick={() => setStep(3)}
              style={{ ...glass, ...primaryBtnStyle, flex: 1, background: selectedPackage ? colors.red : colors.surface2, color: selectedPackage ? '#fff' : colors.textFaint, cursor: selectedPackage ? 'pointer' : 'not-allowed' }}
            >
              ادامه
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ color: colors.textMuted, fontSize: 12, marginBottom: 16 }}>
            {selectedService.title} · <span style={{ color: colors.red, fontWeight: 700 }}>پکیج {selectedPackage.label}</span>
          </div>

          <Field label="نام و نام خانوادگی" error={errors.name}>
            <input value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="مثلاً: علی رضایی" style={inputStyle} />
          </Field>
          <Field label="شماره تماس یا آیدی تلگرام" error={errors.contact}>
            <input value={form.contact} onChange={(e) => updateForm('contact', e.target.value)} placeholder="۰۹۱۲... یا @username" style={inputStyle} />
          </Field>
          <Field label="توضیح سفارش" error={errors.desc}>
            <textarea value={form.desc} onChange={(e) => updateForm('desc', e.target.value)} placeholder="حال‌وهوا، رنگ‌بندی، مدت زمان و هر نکته مهم دیگه رو بنویس" rows={4} style={{ ...inputStyle, resize: 'none' }} />
          </Field>
          <Field label="لینک آهنگ یا رفرنس (اختیاری)">
            <div style={{ position: 'relative' }}>
              <input value={form.reference} onChange={(e) => updateForm('reference', e.target.value)} placeholder="لینک اسپاتیفای، ساندکلاود یا نمونه مشابه" style={{ ...inputStyle, paddingLeft: 36 }} />
              <Link2 size={15} color={colors.textFaint} style={{ position: 'absolute', left: 12, top: 13 }} />
            </div>
          </Field>
          <Field label="زمان تحویل">
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ id: 'normal', label: 'عادی' }, { id: 'fast', label: 'فوری' }].map((opt) => (
                <button key={opt.id} onClick={() => updateForm('deadline', opt.id)} style={{ ...glass, flex: 1, padding: '10px', borderRadius: 10, border: `1.5px solid ${form.deadline === opt.id ? colors.red : colors.border}`, background: form.deadline === opt.id ? colors.redDim : colors.surface, color: colors.text, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', ...font }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="آپلود عکس (اختیاری)">
            <label style={{ ...glass, display: 'flex', alignItems: 'center', gap: 8, background: colors.surface, border: `1.5px dashed ${colors.border}`, borderRadius: 10, padding: '11px 12px', cursor: 'pointer', ...font }}>
              <Package size={16} color={colors.textMuted} />
              <span style={{ color: orderImageFile ? colors.text : colors.textFaint, fontSize: 12.5, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {orderImageFile ? orderImageFile.name : 'برای انتخاب عکس ضربه بزن'}
              </span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setOrderImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              />
            </label>
          </Field>
          <Field label="آپلود فایل موزیک (اختیاری)">
            <label style={{ ...glass, display: 'flex', alignItems: 'center', gap: 8, background: colors.surface, border: `1.5px dashed ${colors.border}`, borderRadius: 10, padding: '11px 12px', cursor: 'pointer', ...font }}>
              <Package size={16} color={colors.textMuted} />
              <span style={{ color: orderAudioFile ? colors.text : colors.textFaint, fontSize: 12.5, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {orderAudioFile ? orderAudioFile.name : 'برای انتخاب فایل موزیک ضربه بزن'}
              </span>
              <input
                type="file"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={(e) => setOrderAudioFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              />
            </label>
          </Field>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={() => setStep(2)} style={secondaryBtnStyle}>بازگشت</button>
            <button onClick={() => onValidate() && setStep(4)} style={{ ...primaryBtnStyle, flex: 1 }}>مرور و ثبت</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <div style={{ color: colors.text, fontWeight: 700, fontSize: 15, marginBottom: 14 }}>بررسی نهایی سفارش</div>
          <div style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <ReviewRow icon={selectedService.icon} label="خدمت" value={selectedService.title} />
            <ReviewRow icon={Package} label="پکیج" value={`${selectedPackage.label} — ${selectedPackage.price}`} />
            <ReviewRow icon={User} label="نام" value={form.name} />
            <ReviewRow icon={Phone} label="راه ارتباطی" value={form.contact} />
            <ReviewRow icon={Clock} label="زمان تحویل" value={form.deadline === 'fast' ? 'فوری' : 'عادی'} />
            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 12 }}>
              <div style={{ color: colors.textFaint, fontSize: 11, marginBottom: 4 }}>توضیحات</div>
              <div style={{ color: colors.text, fontSize: 12.5, lineHeight: 1.7 }}>{form.desc}</div>
            </div>
          </div>
          {submitError && <div style={{ color: colors.red, fontSize: 12, marginBottom: 12, textAlign: 'center' }}>{submitError}</div>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStep(3)} style={secondaryBtnStyle} disabled={submitting}>ویرایش</button>
            <button onClick={onSubmit} disabled={submitting} style={{ ...primaryBtnStyle, flex: 1, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'در حال ارسال...' : 'ثبت نهایی سفارش'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewRow({ icon: IconCmp, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <IconCmp size={15} color={colors.red} />
      <span style={{ color: colors.textFaint, fontSize: 11.5, width: 78, flexShrink: 0 }}>{label}</span>
      <span style={{ color: colors.text, fontSize: 12.5, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ color: colors.textMuted, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {children}
      {error && <div style={{ color: colors.red, fontSize: 11, marginTop: 5 }}>{error}</div>}
    </div>
  );
}

const inputStyle = { ...glass, width: '100%', background: colors.surface, border: `1.5px solid ${colors.border}`, borderRadius: 10, padding: '11px 12px', color: colors.text, fontSize: 13, boxSizing: 'border-box', ...font };
const primaryBtnStyle = { background: `linear-gradient(135deg, ${colors.red}, #c2183a)`, color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, padding: '13px', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,59,92,0.35), inset 0 1px 0 rgba(255,255,255,0.25)', ...font };
const secondaryBtnStyle = { ...glass, background: colors.surface, color: colors.textMuted, border: `1.5px solid ${colors.border}`, borderRadius: 12, padding: '13px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', ...font };

function ScreenHeader({ title, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingTop: 16 }}>
      <button onClick={onBack} style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <ChevronLeft size={18} color={colors.text} style={{ transform: 'scaleX(-1)' }} />
      </button>
      <div style={{ color: colors.text, fontWeight: 700, fontSize: 15 }}>{title}</div>
    </div>
  );
}

function PaymentStatusBadge({ status }) {
  const map = {
    'در انتظار پرداخت': { c: colors.gold, bg: colors.goldDim },
    'در انتظار تایید پرداخت': { c: colors.red, bg: colors.redDim },
    'پرداخت شده': { c: colors.success, bg: '#0f3a26' },
  };
  const s = map[status] || map['در انتظار پرداخت'];
  return <span style={{ color: s.c, background: s.bg, fontSize: 11, padding: '4px 10px', borderRadius: 999, fontWeight: 600, whiteSpace: 'nowrap' }}>{status || 'در انتظار پرداخت'}</span>;
}

function PaymentSection({ order }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function copyCard() {
    try {
      navigator.clipboard.writeText(PAYMENT_CARD.number.replace(/(.{4})/g, '$1 ').trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {}
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadFileToSupabase(file);
      await updateOrderByCode(order.id, { receipt_url: url, payment_status: 'در انتظار تایید پرداخت' });
      setDone(true);
    } catch (e) {
      setError('ارسال رسید با خطا مواجه شد. دوباره امتحان کن.');
    } finally {
      setUploading(false);
    }
  }

  if (done) {
    return (
      <div style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 16, textAlign: 'center' }}>
        <Check size={26} color={colors.success} style={{ marginBottom: 8 }} />
        <div style={{ color: colors.text, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>رسید پرداخت دریافت شد</div>
        <div style={{ color: colors.textMuted, fontSize: 11.5 }}>به‌زودی بررسی و تایید می‌شه.</div>
      </div>
    );
  }

  return (
    <div style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 16, textAlign: 'right' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <CreditCard size={16} color={colors.red} />
        <span style={{ color: colors.text, fontWeight: 700, fontSize: 13 }}>پرداخت کارت‌به‌کارت</span>
      </div>
      <div style={{ ...glass, background: colors.surface2, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <div style={{ color: colors.textFaint, fontSize: 10.5, marginBottom: 4 }}>شماره کارت</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ color: colors.text, fontSize: 14, fontWeight: 700, letterSpacing: 1, direction: 'ltr' }}>{PAYMENT_CARD.number.replace(/(.{4})/g, '$1 ').trim()}</span>
          <button onClick={copyCard} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? colors.success : colors.textMuted, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
            <Copy size={14} />
          </button>
        </div>
        <div style={{ color: colors.textMuted, fontSize: 11.5, marginTop: 6 }}>به نام {PAYMENT_CARD.holder}</div>
      </div>
      <div style={{ color: colors.textMuted, fontSize: 11.5, marginBottom: 10 }}>مبلغ سفارش رو کارت‌به‌کارت کن و عکس رسید رو آپلود کن:</div>
      <label style={{ ...glass, display: 'flex', alignItems: 'center', gap: 8, background: colors.surface2, border: `1.5px dashed ${colors.border}`, borderRadius: 10, padding: '11px 12px', cursor: 'pointer', marginBottom: 10, ...font }}>
        <Package size={16} color={colors.textMuted} />
        <span style={{ color: file ? colors.text : colors.textFaint, fontSize: 12.5, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {file ? file.name : 'انتخاب عکس رسید'}
        </span>
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
      </label>
      {error && <div style={{ color: colors.red, fontSize: 11, marginBottom: 8 }}>{error}</div>}
      <button onClick={handleUpload} disabled={!file || uploading} style={{ ...primaryBtnStyle, width: '100%', opacity: !file || uploading ? 0.6 : 1, cursor: !file || uploading ? 'not-allowed' : 'pointer' }}>
        {uploading ? 'در حال ارسال...' : 'ارسال رسید پرداخت'}
      </button>
    </div>
  );
}

function DeliveryBlock({ order, onUpdated }) {
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const isImage = order.delivery_url && /\.(jpg|jpeg|png|gif|webp)$/i.test(order.delivery_url);
  const isAudio = order.delivery_url && /\.(mp3|wav|ogg|m4a)$/i.test(order.delivery_url);

  async function approve() {
    setSending(true);
    setError('');
    try {
      await updateOrderByCode(order.order_code, { customer_approved: true, revision_requested: false, revision_note: null });
      onUpdated({ customer_approved: true, revision_requested: false, revision_note: null });
    } catch (e) {
      setError('خطا در ثبت. دوباره امتحان کن.');
    } finally {
      setSending(false);
    }
  }

  async function sendRevision() {
    if (!note.trim()) return;
    setSending(true);
    setError('');
    try {
      await updateOrderByCode(order.order_code, { revision_requested: true, revision_note: note.trim(), customer_approved: false });
      onUpdated({ revision_requested: true, revision_note: note.trim(), customer_approved: false });
      setShowRevisionForm(false);
    } catch (e) {
      setError('ارسال درخواست با خطا مواجه شد. دوباره امتحان کن.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <Package size={15} color={colors.success} />
        <span style={{ color: colors.text, fontWeight: 700, fontSize: 12.5 }}>فایل نهایی پروژه</span>
      </div>
      {isImage && <img src={order.delivery_url} alt="فایل نهایی" style={{ maxWidth: '100%', borderRadius: 10, border: `1px solid ${colors.border}`, marginBottom: 10 }} />}
      {isAudio && <audio controls src={order.delivery_url} style={{ width: '100%', marginBottom: 10 }} />}
      <a href={order.delivery_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: colors.redDim, color: colors.red, textDecoration: 'none', borderRadius: 10, padding: '9px', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
        <Download size={14} />
        دانلود / مشاهده فایل
      </a>

      {order.customer_approved && !order.revision_requested && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.success, fontSize: 12, fontWeight: 600 }}>
          <Check size={14} />
          تایید نهایی شد
        </div>
      )}

      {order.revision_requested && (
        <div style={{ ...glass, background: colors.goldDim, border: `1px solid ${colors.gold}`, borderRadius: 10, padding: 10, fontSize: 11.5, color: colors.gold }}>
          درخواست اصلاح ارسال شد و در انتظار بررسیه.
          {order.revision_note && <div style={{ marginTop: 4, color: colors.textMuted }}>یادداشت تو: «{order.revision_note}»</div>}
        </div>
      )}

      {!order.customer_approved && !order.revision_requested && !showRevisionForm && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={approve} disabled={sending} style={{ ...primaryBtnStyle, flex: 1, background: colors.success, opacity: sending ? 0.7 : 1 }}>
            تایید نهایی
          </button>
          <button onClick={() => setShowRevisionForm(true)} disabled={sending} style={{ ...secondaryBtnStyle, flex: 1 }}>
            درخواست اصلاح
          </button>
        </div>
      )}

      {showRevisionForm && (
        <div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="چه چیزی نیاز به اصلاح داره؟"
            rows={3}
            style={{ ...inputStyle, resize: 'none', marginBottom: 8 }}
          />
          {error && <div style={{ color: colors.red, fontSize: 11, marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowRevisionForm(false)} disabled={sending} style={{ ...secondaryBtnStyle, flex: 1 }}>
              انصراف
            </button>
            <button onClick={sendRevision} disabled={sending || !note.trim()} style={{ ...primaryBtnStyle, flex: 1, opacity: sending || !note.trim() ? 0.6 : 1 }}>
              {sending ? 'در حال ارسال...' : 'ارسال درخواست'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfirmScreen({ order, onDone, onSeeOrders }) {
  return (
    <div className="fade-up" style={{ padding: '40px 24px 20px', textAlign: 'center' }}>
      <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#0f3a26', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Check size={28} color={colors.success} />
      </div>
      <div style={{ color: colors.text, fontWeight: 800, fontSize: 16, marginBottom: 8 }}>سفارش ثبت شد</div>
      <div style={{ color: colors.textMuted, fontSize: 12.5, lineHeight: 1.8, marginBottom: 18 }}>
        سفارش تو با کد <span style={{ color: colors.red, fontWeight: 700 }}>{order.id}</span> ثبت شد.
      </div>
      <div style={{ marginBottom: 18 }}>
        <PaymentSection order={order} />
      </div>
      <button onClick={onSeeOrders} style={{ ...primaryBtnStyle, width: '100%', marginBottom: 10 }}>پیگیری سفارش</button>
      <button onClick={onDone} style={{ ...secondaryBtnStyle, width: '100%' }}>بازگشت به خانه</button>
    </div>
  );
}

function OrdersScreen({ onNewOrder, onSearched }) {
  const [phone, setPhone] = useState(() => {
    try {
      return localStorage.getItem('jamalvfx_contact') || '';
    } catch (e) {
      return '';
    }
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  async function search(numberToSearch) {
    const value = (numberToSearch || phone).trim();
    if (!value) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchOrdersByContact(value);
      setOrders(data);
      setSearched(true);
      try {
        localStorage.setItem('jamalvfx_contact', value);
      } catch (e) {}
      if (onSearched) onSearched();
    } catch (e) {
      setError('خطا در دریافت اطلاعات. دوباره امتحان کن.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (phone.trim()) search(phone);
  }, []);

  function forgetMe() {
    try {
      localStorage.removeItem('jamalvfx_contact');
    } catch (e) {}
    setPhone('');
    setOrders([]);
    setSearched(false);
  }

  return (
    <div className="fade-up" style={{ padding: '4px 20px 20px' }}>
      <ScreenHeader title="سفارش‌های من" onBack={onNewOrder} />
      <div style={{ color: colors.textMuted, fontSize: 12, marginBottom: 10 }}>شماره تماس یا آیدی‌ای که موقع ثبت سفارش وارد کردی رو بزن:</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} placeholder="۰۹۱۲... یا @username" style={{ ...inputStyle, flex: 1 }} />
        <button onClick={() => search()} disabled={loading} style={{ ...primaryBtnStyle, padding: '0 16px', opacity: loading ? 0.7 : 1 }}>
          <Search size={16} color="#fff" />
        </button>
      </div>
      {searched && (
        <div style={{ textAlign: 'left', marginBottom: 16 }}>
          <button onClick={forgetMe} style={{ background: 'none', border: 'none', color: colors.textFaint, fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>
            این شماره رو فراموش کن
          </button>
        </div>
      )}
      {!searched && <div style={{ marginBottom: 16 }} />}
      {error && <div style={{ color: colors.red, fontSize: 12, textAlign: 'center', marginBottom: 12 }}>{error}</div>}
      {loading && <div style={{ color: colors.textMuted, textAlign: 'center', padding: 30, fontSize: 12.5 }}>در حال جستجو...</div>}
      {!loading && searched && orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 10px', color: colors.textFaint }}>
          <ClipboardList size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <div style={{ fontSize: 12.5, color: colors.textMuted }}>سفارشی با این شماره پیدا نشد</div>
        </div>
      )}
      {!loading && !searched && (
        <div style={{ textAlign: 'center', padding: '40px 10px', color: colors.textFaint }}>
          <ClipboardList size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <div style={{ fontSize: 12.5, color: colors.textMuted }}>برای دیدن سفارش‌هات، شماره‌ت رو جستجو کن</div>
        </div>
      )}
      {!loading && orders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {orders.map((o) => (
            <div key={o.id} style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color: colors.text, fontWeight: 700, fontSize: 13 }}>{o.service_title}</span>
                <StatusBadge status={o.status} />
              </div>
              <div style={{ color: colors.textMuted, fontSize: 11.5, marginBottom: 4 }}>پکیج {o.package_label} · {o.price}</div>
              <div style={{ color: colors.textFaint, fontSize: 11, marginBottom: 8 }}>کد سفارش: {o.order_code}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: o.delivery_url ? 10 : 0 }}>
                <span style={{ color: colors.textFaint, fontSize: 10.5 }}>وضعیت پرداخت:</span>
                <PaymentStatusBadge status={o.payment_status} />
              </div>
              {o.delivery_url && <DeliveryBlock order={o} onUpdated={(patch) => setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, ...patch } : x)))} />}
              {(!o.payment_status || o.payment_status === 'در انتظار پرداخت') && <PaymentSection order={{ id: o.order_code }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
