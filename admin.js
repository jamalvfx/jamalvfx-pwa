const { useState, useEffect } = React;

const SUPABASE_URL = 'https://oskheiwnkklfumzzhjkd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jRizYnzfIdm_XQpHlFKLZQ_QYbaQnFH';

/* رمز ورود پنل مدیریت را همینجا تغییر بده */
const ADMIN_PASSWORD = 'jamalvfx1404';

const colors = {
  bg: '#0a0a0c', surface: 'rgba(8,8,10,0.58)', surface2: 'rgba(8,8,10,0.72)', border: 'rgba(255,255,255,0.14)',
  red: '#ff3b5c', redDim: 'rgba(255,59,92,0.24)', gold: '#f0b429', goldDim: 'rgba(240,180,41,0.22)',
  text: '#f8f8fa', textMuted: '#cfcfd4', textFaint: '#9d9da3', success: '#34d399',
};
const glass = { backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)' };

function Icon({ size = 16, color = 'currentColor', style, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {children}
    </svg>
  );
}
const Check = (p) => <Icon {...p}><path d="M20 6 9 17l-5-5" /></Icon>;

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

async function fetchOrders() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error('fetch failed');
  return res.json();
}

async function updateStatus(id, status) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('update failed');
}

async function updateOrder(id, patch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
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

async function deleteOrder(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
    method: 'DELETE',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error('delete failed');
}

async function fetchPortfolio() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio?select=*&order=created_at.desc`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error('fetch failed');
  return res.json();
}

async function insertPortfolio(item) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('insert failed');
}

async function deletePortfolio(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio?id=eq.${id}`, {
    method: 'DELETE',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error('delete failed');
}

const STATUS_OPTIONS = ['در انتظار بررسی', 'در حال انجام', 'تحویل شده'];
const SERVICE_CATEGORIES = [
  { id: 'cover', title: 'طراحی کاور' },
  { id: 'equalizer', title: 'طراحی اکولایزر' },
  { id: 'visualizer', title: 'طراحی ویژوالایزر' },
  { id: 'logo', title: 'طراحی لوگو' },
];

function StatusBadge({ status }) {
  const map = {
    'در انتظار بررسی': { c: colors.gold, bg: colors.goldDim },
    'در حال انجام': { c: colors.red, bg: colors.redDim },
    'تحویل شده': { c: colors.success, bg: '#0f3a26' },
  };
  const s = map[status] || map['در انتظار بررسی'];
  return <span style={{ color: s.c, background: s.bg, fontSize: 11, padding: '4px 10px', borderRadius: 999, fontWeight: 600, whiteSpace: 'nowrap' }}>{status}</span>;
}

function LoginScreen({ onLogin }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  function submit() {
    if (pass === ADMIN_PASSWORD) {
      sessionStorage.setItem('jamalvfx_admin_auth', '1');
      onLogin();
    } else {
      setError('رمز اشتباهه');
    }
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 24, width: '100%', maxWidth: 360 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16, textAlign: 'center' }}>ورود به پنل مدیریت</div>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="رمز عبور"
          style={{ ...glass, width: '100%', background: colors.surface2, border: `1.5px solid ${colors.border}`, borderRadius: 10, padding: '11px 12px', color: colors.text, fontSize: 13, boxSizing: 'border-box', marginBottom: 10 }}
        />
        {error && <div style={{ color: colors.red, fontSize: 12, marginBottom: 10 }}>{error}</div>}
        <button onClick={submit} style={{ width: '100%', background: colors.red, color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          ورود
        </button>
      </div>
    </div>
  );
}

function OrderCard({ order, onStatusChange, onDelivered, onDelete, onConfirmPayment }) {
  const isImage = order.file_url && /\.(jpg|jpeg|png|gif|webp)$/i.test(order.file_url);
  const isAudio = order.file_url && /\.(mp3|wav|ogg|m4a)$/i.test(order.file_url);
  const [deliveryFile, setDeliveryFile] = useState(null);
  const [deliveryLink, setDeliveryLink] = useState('');
  const [savingDelivery, setSavingDelivery] = useState(false);
  const [deliveryError, setDeliveryError] = useState('');

  async function saveDelivery() {
    setDeliveryError('');
    let finalUrl = deliveryLink.trim();
    setSavingDelivery(true);
    try {
      if (deliveryFile) {
        finalUrl = await uploadFileToSupabase(deliveryFile);
      }
      if (!finalUrl) {
        setDeliveryError('یه فایل انتخاب کن یا لینک وارد کن');
        setSavingDelivery(false);
        return;
      }
      await onDelivered(order.id, finalUrl);
      setDeliveryFile(null);
      setDeliveryLink('');
    } catch (e) {
      setDeliveryError('ارسال فایل با خطا مواجه شد. دوباره امتحان کن.');
    } finally {
      setSavingDelivery(false);
    }
  }

  return (
    <div style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{order.service_title} — {order.package_label}</div>
          <div style={{ color: colors.textFaint, fontSize: 11, marginTop: 2 }}>کد: {order.order_code} · {order.price}</div>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div style={{ fontSize: 12.5, color: colors.textMuted, lineHeight: 1.9, marginBottom: 10 }}>
        <div><b style={{ color: colors.text }}>نام:</b> {order.name}</div>
        <div><b style={{ color: colors.text }}>تماس:</b> {order.contact}</div>
        {order.reference && <div><b style={{ color: colors.text }}>رفرنس:</b> {order.reference}</div>}
        <div><b style={{ color: colors.text }}>زمان تحویل:</b> {order.deadline === 'fast' ? 'فوری' : 'عادی'}</div>
        <div style={{ marginTop: 6 }}><b style={{ color: colors.text }}>توضیحات:</b><br />{order.description}</div>
      </div>
      {order.file_url && (
        <div style={{ marginBottom: 10 }}>
          {isImage && <img src={order.file_url} alt="فایل سفارش" style={{ maxWidth: '100%', borderRadius: 10, border: `1px solid ${colors.border}` }} />}
          {isAudio && <audio controls src={order.file_url} style={{ width: '100%' }} />}
          <div style={{ marginTop: 6 }}>
            <a href={order.file_url} target="_blank" rel="noreferrer" style={{ color: colors.red, fontSize: 12, fontWeight: 600 }}>دانلود / مشاهده فایل مرجع مشتری</a>
          </div>
        </div>
      )}

      <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 10, marginTop: 10, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 11.5, color: colors.textMuted, fontWeight: 600 }}>وضعیت پرداخت:</span>
          <PaymentBadge status={order.payment_status} />
        </div>
        {order.receipt_url && (
          <div style={{ marginBottom: 8 }}>
            <a href={order.receipt_url} target="_blank" rel="noreferrer" style={{ color: colors.red, fontSize: 12, fontWeight: 600 }}>مشاهده رسید پرداخت</a>
          </div>
        )}
        {order.payment_status !== 'پرداخت شده' && order.receipt_url && (
          <button onClick={() => onConfirmPayment(order.id)} style={{ fontSize: 11.5, padding: '7px 12px', borderRadius: 8, border: `1.5px solid ${colors.success}`, background: 'transparent', color: colors.success, cursor: 'pointer', fontWeight: 600 }}>
            تایید پرداخت
          </button>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 11.5, color: colors.textMuted, fontWeight: 600, marginBottom: 6 }}>ارسال فایل نهایی به مشتری:</div>
        {order.delivery_url && (
          <div style={{ marginBottom: 6 }}>
            <a href={order.delivery_url} target="_blank" rel="noreferrer" style={{ color: colors.success, fontSize: 12, fontWeight: 600 }}>لینک فعلی فایل نهایی</a>
          </div>
        )}
        {order.revision_requested && (
          <div style={{ ...glass, background: colors.goldDim, border: `1px solid ${colors.gold}`, borderRadius: 8, padding: 10, marginBottom: 8, fontSize: 11.5, color: colors.gold }}>
            مشتری درخواست اصلاح داده:
            {order.revision_note && <div style={{ marginTop: 4, color: colors.text }}>«{order.revision_note}»</div>}
          </div>
        )}
        {order.customer_approved && !order.revision_requested && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.success, fontSize: 11.5, fontWeight: 600, marginBottom: 8 }}>
            <Check size={13} color={colors.success} />
            مشتری فایل نهایی رو تایید کرده
          </div>
        )}
        <label style={{ ...glass, display: 'flex', alignItems: 'center', gap: 8, background: colors.surface2, border: `1.5px dashed ${colors.border}`, borderRadius: 8, padding: '8px 10px', cursor: 'pointer', marginBottom: 6 }}>
          <span style={{ color: deliveryFile ? colors.text : colors.textFaint, fontSize: 11.5, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {deliveryFile ? deliveryFile.name : 'انتخاب فایل نهایی از گوشی'}
          </span>
          <input type="file" style={{ display: 'none' }} onChange={(e) => setDeliveryFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <div style={{ flex: 1, height: 1, background: colors.border }} />
          <span style={{ color: colors.textFaint, fontSize: 10.5 }}>یا</span>
          <div style={{ flex: 1, height: 1, background: colors.border }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={deliveryLink}
            onChange={(e) => setDeliveryLink(e.target.value)}
            placeholder="لینک فایل نهایی (گوگل‌درایو و ...)"
            style={{ ...glass, flex: 1, background: colors.surface2, border: `1.5px solid ${colors.border}`, borderRadius: 8, padding: '8px 10px', color: colors.text, fontSize: 11.5, boxSizing: 'border-box' }}
          />
        </div>
        {deliveryError && <div style={{ color: colors.red, fontSize: 11, marginTop: 6 }}>{deliveryError}</div>}
        <button onClick={saveDelivery} disabled={savingDelivery} style={{ width: '100%', marginTop: 8, fontSize: 11.5, padding: '9px 12px', borderRadius: 8, border: 'none', background: colors.red, color: '#fff', cursor: 'pointer', fontWeight: 600, opacity: savingDelivery ? 0.6 : 1 }}>
          {savingDelivery ? 'در حال ارسال...' : 'ثبت و ارسال فایل نهایی'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(order.id, s)}
              style={{
                fontSize: 11, padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
                border: `1.5px solid ${order.status === s ? colors.red : colors.border}`,
                background: order.status === s ? colors.redDim : 'transparent',
                color: order.status === s ? colors.text : colors.textMuted,
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => onDelete(order.id)} style={{ fontSize: 11, padding: '6px 10px', borderRadius: 8, border: `1.5px solid ${colors.red}`, background: 'transparent', color: colors.red, cursor: 'pointer', fontWeight: 600 }}>
          حذف سفارش
        </button>
      </div>
    </div>
  );
}

function PaymentBadge({ status }) {
  const map = {
    'در انتظار پرداخت': { c: colors.gold, bg: colors.goldDim },
    'در انتظار تایید پرداخت': { c: colors.red, bg: colors.redDim },
    'پرداخت شده': { c: colors.success, bg: '#0f3a26' },
  };
  const s = map[status] || map['در انتظار پرداخت'];
  return <span style={{ color: s.c, background: s.bg, fontSize: 10.5, padding: '3px 9px', borderRadius: 999, fontWeight: 600, whiteSpace: 'nowrap' }}>{status || 'در انتظار پرداخت'}</span>;
}

function PortfolioManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('cover');
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      setItems(await fetchPortfolio());
    } catch (e) {
      setError('خطا در دریافت نمونه‌کارها');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    if (!title.trim() || !file) {
      setError('عنوان و فایل نمونه‌کار رو وارد کن');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const url = await uploadFileToSupabase(file);
      const coverUrl = coverImage ? await uploadFileToSupabase(coverImage) : null;
      await insertPortfolio({ title: title.trim(), category, note: note.trim() || null, media_url: url, cover_image_url: coverUrl });
      setTitle('');
      setNote('');
      setFile(null);
      setCoverImage(null);
      load();
    } catch (e) {
      setError('ثبت نمونه‌کار با خطا مواجه شد');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('این نمونه‌کار حذف بشه؟')) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await deletePortfolio(id);
    } catch (e) {
      load();
    }
  }

  return (
    <div>
      <div style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 12 }}>افزودن نمونه‌کار جدید</div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان نمونه‌کار"
          style={{ ...glass, width: '100%', background: colors.surface2, border: `1.5px solid ${colors.border}`, borderRadius: 8, padding: '9px 12px', color: colors.text, fontSize: 12.5, boxSizing: 'border-box', marginBottom: 8 }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          {SERVICE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              style={{
                fontSize: 11, padding: '6px 12px', borderRadius: 999, cursor: 'pointer', fontWeight: 600,
                border: `1.5px solid ${category === c.id ? colors.red : colors.border}`,
                background: category === c.id ? colors.redDim : 'transparent',
                color: category === c.id ? colors.text : colors.textMuted,
              }}
            >
              {c.title}
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="توضیح کوتاه (اختیاری)"
          rows={2}
          style={{ ...glass, width: '100%', background: colors.surface2, border: `1.5px solid ${colors.border}`, borderRadius: 8, padding: '9px 12px', color: colors.text, fontSize: 12.5, boxSizing: 'border-box', marginBottom: 8, resize: 'none' }}
        />
        <label style={{ ...glass, display: 'flex', alignItems: 'center', gap: 8, background: colors.surface2, border: `1.5px dashed ${colors.border}`, borderRadius: 8, padding: '9px 12px', cursor: 'pointer', marginBottom: 8 }}>
          <span style={{ color: file ? colors.text : colors.textFaint, fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file ? file.name : 'انتخاب فایل اصلی نمونه‌کار (عکس، ویدیو یا صدا)'}
          </span>
          <input type="file" accept="image/*,video/*,audio/*" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
        </label>
        <label style={{ ...glass, display: 'flex', alignItems: 'center', gap: 8, background: colors.surface2, border: `1.5px dashed ${colors.border}`, borderRadius: 8, padding: '9px 12px', cursor: 'pointer', marginBottom: 10 }}>
          <span style={{ color: coverImage ? colors.text : colors.textFaint, fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {coverImage ? coverImage.name : 'تصویر کاور برای نمایش تو گرید (اختیاری، ولی پیشنهاد می‌شه)'}
          </span>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setCoverImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
        </label>
        {error && <div style={{ color: colors.red, fontSize: 11.5, marginBottom: 8 }}>{error}</div>}
        <button onClick={handleAdd} disabled={saving} style={{ width: '100%', fontSize: 12.5, padding: '10px', borderRadius: 8, border: 'none', background: colors.red, color: '#fff', cursor: 'pointer', fontWeight: 700, opacity: saving ? 0.6 : 1 }}>
          {saving ? 'در حال ثبت...' : 'افزودن نمونه‌کار'}
        </button>
      </div>

      {loading && <div style={{ color: colors.textMuted, textAlign: 'center', padding: 20 }}>در حال بارگذاری...</div>}
      {!loading && items.length === 0 && <div style={{ color: colors.textFaint, textAlign: 'center', padding: 30, fontSize: 12.5 }}>هنوز نمونه‌کاری اضافه نشده</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map((item) => {
          const isImage = item.media_url && /\.(jpg|jpeg|png|gif|webp)$/i.test(item.media_url);
          const thumb = item.cover_image_url || (isImage ? item.media_url : null);
          return (
            <div key={item.id} style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ width: '100%', aspectRatio: '1', background: colors.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {thumb ? <img src={thumb} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <a href={item.media_url} target="_blank" rel="noreferrer" style={{ color: colors.red, fontSize: 11 }}>مشاهده فایل</a>}
              </div>
              <div style={{ padding: 10 }}>
                <div style={{ color: colors.text, fontSize: 11.5, fontWeight: 700, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                <div style={{ color: colors.textFaint, fontSize: 10, marginBottom: 8 }}>{(SERVICE_CATEGORIES.find((c) => c.id === item.category) || {}).title || item.category}</div>
                <button onClick={() => handleDelete(item.id)} style={{ width: '100%', fontSize: 10.5, padding: '6px', borderRadius: 6, border: `1.5px solid ${colors.red}`, background: 'transparent', color: colors.red, cursor: 'pointer', fontWeight: 600 }}>
                  حذف
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    document.body.classList.add('bg-kick');
    const t = setTimeout(() => document.body.classList.remove('bg-kick'), 750);
    return () => clearTimeout(t);
  }, [tab]);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (e) {
      setError('خطا در دریافت سفارش‌ها');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleStatusChange(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await updateStatus(id, status);
    } catch (e) {
      load();
    }
  }

  async function handleDelivered(id, deliveryLink) {
    const patch = { delivery_url: deliveryLink, status: 'تحویل شده', revision_requested: false, revision_note: null, customer_approved: false };
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
    try {
      await updateOrder(id, patch);
    } catch (e) {
      load();
    }
  }

  async function handleConfirmPayment(id) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, payment_status: 'پرداخت شده' } : o)));
    try {
      await updateOrder(id, { payment_status: 'پرداخت شده' });
    } catch (e) {
      load();
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('مطمئنی می‌خوای این سفارش حذف بشه؟ این کار قابل بازگشت نیست.')) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
    try {
      await deleteOrder(id);
    } catch (e) {
      load();
    }
  }

  function logout() {
    sessionStorage.removeItem('jamalvfx_admin_auth');
    window.location.reload();
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 17 }}>پنل مدیریت</div>
        <button onClick={logout} style={{ background: 'transparent', border: `1px solid ${colors.border}`, color: colors.textMuted, borderRadius: 8, padding: '7px 12px', fontSize: 12, cursor: 'pointer' }}>خروج</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <button onClick={() => setTab('orders')} style={{ flex: 1, fontSize: 12.5, padding: '9px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, border: `1.5px solid ${tab === 'orders' ? colors.red : colors.border}`, background: tab === 'orders' ? colors.redDim : 'transparent', color: tab === 'orders' ? colors.text : colors.textMuted }}>
          سفارش‌ها
        </button>
        <button onClick={() => setTab('portfolio')} style={{ flex: 1, fontSize: 12.5, padding: '9px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, border: `1.5px solid ${tab === 'portfolio' ? colors.red : colors.border}`, background: tab === 'portfolio' ? colors.redDim : 'transparent', color: tab === 'portfolio' ? colors.text : colors.textMuted }}>
          نمونه‌کارها
        </button>
      </div>

      {tab === 'portfolio' ? (
        <PortfolioManager />
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={load} style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, color: colors.text, borderRadius: 8, padding: '7px 12px', fontSize: 12, cursor: 'pointer' }}>بروزرسانی</button>
          </div>
          {loading && <div style={{ color: colors.textMuted, textAlign: 'center', padding: 30 }}>در حال بارگذاری...</div>}
          {error && <div style={{ color: colors.red, textAlign: 'center', padding: 20 }}>{error}</div>}
          {!loading && !error && orders.length === 0 && (
            <div style={{ color: colors.textFaint, textAlign: 'center', padding: 40 }}>هنوز سفارشی ثبت نشده</div>
          )}
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} onStatusChange={handleStatusChange} onDelivered={handleDelivered} onDelete={handleDelete} onConfirmPayment={handleConfirmPayment} />
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('jamalvfx_admin_auth') === '1');

  useEffect(() => {
    document.body.classList.add('bg-kick');
    const t = setTimeout(() => document.body.classList.remove('bg-kick'), 750);
    return () => clearTimeout(t);
  }, [authed]);

  return authed ? <Dashboard /> : <LoginScreen onLogin={() => setAuthed(true)} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
