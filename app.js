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

async function fetchReleases() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/releases?select=*&order=created_at.desc`, {
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
const ShareIcon = (p) => <Icon {...p}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></Icon>;
const PlusSquare = (p) => <Icon {...p}><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 12h8" /><path d="M12 8v8" /></Icon>;

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
    title: 'موشن موزیک',
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

function InstallBanner() {
  const [platform, setPlatform] = useState(null); // 'ios' | 'android' | null
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    if (isStandalone) {
      setInstalled(true);
      return;
    }
    let dismissed = false;
    try {
      dismissed = localStorage.getItem('jamalvfx_install_dismissed') === '1';
    } catch (e) {}
    if (dismissed) return;

    const ua = window.navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && 'ontouchend' in document);
    const isAndroid = /Android/.test(ua);

    if (isIOS) {
      setPlatform('ios');
      setVisible(true);
    } else if (isAndroid) {
      setPlatform('android');
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setVisible(true);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  useEffect(() => {
    const onInstalled = () => {
      setVisible(false);
      setInstalled(true);
    };
    window.addEventListener('appinstalled', onInstalled);
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem('jamalvfx_install_dismissed', '1');
    } catch (e) {}
  }

  async function handleAndroidInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  }

  if (installed || !visible || !platform) return null;

  return (
    <div style={{ padding: '10px 16px 0' }}>
      <div style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: colors.redDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Download size={17} color={colors.red} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {platform === 'ios' ? (
            <>
              <div style={{ color: colors.text, fontSize: 12, fontWeight: 700, marginBottom: 2 }}>نصب اپ jamalvfx_</div>
              <div style={{ color: colors.textMuted, fontSize: 11, lineHeight: 1.7 }}>
                رو دکمه‌ی <ShareIcon size={12} color={colors.textMuted} style={{ verticalAlign: 'middle', margin: '0 2px' }} /> پایین صفحه بزن، بعد <b style={{ color: colors.text }}>Add to Home Screen</b> رو انتخاب کن
              </div>
            </>
          ) : (
            <>
              <div style={{ color: colors.text, fontSize: 12, fontWeight: 700, marginBottom: 2 }}>نصب اپ jamalvfx_</div>
              <div style={{ color: colors.textMuted, fontSize: 11 }}>مثل یه اپ واقعی رو گوشیت نصبش کن</div>
            </>
          )}
        </div>
        {platform === 'android' && (
          <button onClick={handleAndroidInstall} style={{ background: colors.red, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 12px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', flexShrink: 0, ...font }}>
            نصب
          </button>
        )}
        <button onClick={dismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 4 }}>
          <XIcon size={15} color={colors.textFaint} />
        </button>
      </div>
    </div>
  );
}

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
        style={{ ...glass, background: colors.surface2, border: `1px solid ${colors.border}`, borderRadius: '20px 20px 0 0', padding: '18px 20px calc(24px + env(safe-area-inset-bottom))', width: '100%', maxWidth: 480 }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(30,41,79,0.18)', margin: '0 auto 16px' }} />
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
              background: colors.surface2,
              border: `1px solid ${colors.border}`,
              borderInlineStart: 'none',
              borderTop: i === 0 ? `1px solid ${colors.border}` : 'none',
              borderRadius: i === 0 ? '999px 999px 0 0' : '0 0 999px 999px',
              width: 38,
              height: 38,
              paddingInlineStart: 4,
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '3px 0 14px rgba(30,41,79,0.14)',
            }}
          >
            <it.icon size={16} color={it.active ? colors.red : colors.textMuted} />
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
      <InstallBanner />
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
          background: colors.surface2,
          border: `1px solid ${colors.border}`,
          borderRadius: 999,
          boxShadow: '0 12px 40px rgba(30,41,79,0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
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
          background: accent ? `linear-gradient(135deg, ${colors.red}, #c2183a)` : active ? colors.redDim : 'transparent',
          boxShadow: accent ? '0 4px 14px rgba(255,59,92,0.35)' : 'none',
        }}
      >
        <IconCmp size={18} color={accent ? '#fff' : active ? colors.red : colors.textMuted} style={flip ? { transform: 'scaleX(-1)' } : undefined} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: accent || active ? colors.red : colors.textFaint }}>{label}</span>
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
                accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
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


function getOrderStage(o) {
  if (o.status === 'تحویل شده' || o.delivery_url) return 3;
  if (o.payment_status === 'پرداخت شده') return 2;
  return 1;
}

const ORDER_STEPS = ['ثبت', 'پرداخت', 'ساخت', 'تحویل'];

function OrderProgress({ stage }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', margin: '14px 4px 12px' }}>
      {ORDER_STEPS.map((label, i) => {
        const done = i <= stage;
        const isLast = i === ORDER_STEPS.length - 1;
        return (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 40 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: done ? colors.success : 'rgba(255,255,255,0.08)',
                border: done ? 'none' : `1px solid ${colors.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {done && <Check size={12} color="#04342c" />}
              </div>
              <span style={{ fontSize: 9.5, color: done ? colors.textMuted : colors.textFaint, fontWeight: i === stage ? 700 : 500 }}>{label}</span>
            </div>
            {!isLast && (
              <div style={{ flex: 1, height: 2, marginBottom: 14, borderRadius: 2, background: i < stage ? colors.success : 'rgba(255,255,255,0.1)' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function OrderCardNew({ o, onUpdated }) {
  const stage = getOrderStage(o);
  const stageLabel = ORDER_STEPS[stage];
  return (
    <div style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: colors.redDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Music2 size={18} color={colors.red} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: colors.text, fontSize: 13.5, fontWeight: 700 }}>{o.service_title}</div>
          <div style={{ color: colors.textFaint, fontSize: 11, marginTop: 2 }}>پکیج {o.package_label} · کد {o.order_code}</div>
        </div>
        <div style={{ background: stage === 3 ? 'rgba(52,211,153,0.14)' : colors.goldDim, color: stage === 3 ? colors.success : colors.gold, fontSize: 10.5, fontWeight: 600, padding: '5px 10px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {stageLabel === 'تحویل' ? 'تحویل شده' : `مرحله: ${stageLabel}`}
        </div>
      </div>

      <OrderProgress stage={stage} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
        <span style={{ color: colors.textFaint, fontSize: 11.5 }}>مبلغ پرداختی</span>
        <span style={{ color: colors.text, fontSize: 13, fontWeight: 600 }}>{o.price}</span>
      </div>

      {o.delivery_url ? (
        <DeliveryBlock order={o} onUpdated={onUpdated} />
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px dashed ${colors.border}`, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Package size={18} color={colors.textFaint} />
          <div style={{ flex: 1 }}>
            <div style={{ color: colors.textMuted, fontSize: 12, fontWeight: 600 }}>فایل نهایی پروژه</div>
            <div style={{ color: colors.textFaint, fontSize: 10.5, marginTop: 1 }}>بعد از تحویل نهایی اینجا نمایش داده می‌شه</div>
          </div>
        </div>
      )}

      {stage === 1 && !o.receipt_url && o.payment_status !== 'در انتظار تایید پرداخت' && (
        <PaymentSection order={{ id: o.order_code }} />
      )}
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
            <div key={o.id}>
              <OrderCardNew o={o} onUpdated={(patch) => setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, ...patch } : x)))} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
