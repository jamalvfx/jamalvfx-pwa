const { useState, useEffect } = React;

const SUPABASE_URL = 'https://oskheiwnkklfumzzhjkd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jRizYnzfIdm_XQpHlFKLZQ_QYbaQnFH';

/* رمز ورود پنل مدیریت را همینجا تغییر بده */
const ADMIN_PASSWORD = 'jamalvfx1404';

const colors = {
  bg: '#0a0a0c', surface: 'rgba(255,255,255,0.07)', surface2: 'rgba(255,255,255,0.11)', border: 'rgba(255,255,255,0.16)',
  red: '#ff3b5c', redDim: 'rgba(255,59,92,0.22)', gold: '#f0b429', goldDim: 'rgba(240,180,41,0.20)',
  text: '#f8f8fa', textMuted: '#c2c2c9', textFaint: '#8a8a93', success: '#34d399',
};
const glass = { backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)' };

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

const STATUS_OPTIONS = ['در انتظار بررسی', 'در حال انجام', 'تحویل شده'];

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
  const [deliveryLink, setDeliveryLink] = useState(order.delivery_url || '');
  const [savingDelivery, setSavingDelivery] = useState(false);

  async function saveDelivery() {
    if (!deliveryLink.trim()) return;
    setSavingDelivery(true);
    try {
      await onDelivered(order.id, deliveryLink.trim());
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
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={deliveryLink}
            onChange={(e) => setDeliveryLink(e.target.value)}
            placeholder="لینک فایل نهایی (گوگل‌درایو و ...)"
            style={{ ...glass, flex: 1, background: colors.surface2, border: `1.5px solid ${colors.border}`, borderRadius: 8, padding: '8px 10px', color: colors.text, fontSize: 11.5, boxSizing: 'border-box' }}
          />
          <button onClick={saveDelivery} disabled={savingDelivery} style={{ fontSize: 11.5, padding: '8px 12px', borderRadius: 8, border: 'none', background: colors.red, color: '#fff', cursor: 'pointer', fontWeight: 600, opacity: savingDelivery ? 0.6 : 1 }}>
            {savingDelivery ? '...' : 'ثبت و ارسال'}
          </button>
        </div>
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

function Dashboard() {
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
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, delivery_url: deliveryLink, status: 'تحویل شده' } : o)));
    try {
      await updateOrder(id, { delivery_url: deliveryLink, status: 'تحویل شده' });
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontWeight: 800, fontSize: 17 }}>سفارش‌های ثبت‌شده</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={load} style={{ ...glass, background: colors.surface, border: `1px solid ${colors.border}`, color: colors.text, borderRadius: 8, padding: '7px 12px', fontSize: 12, cursor: 'pointer' }}>بروزرسانی</button>
          <button onClick={logout} style={{ background: 'transparent', border: `1px solid ${colors.border}`, color: colors.textMuted, borderRadius: 8, padding: '7px 12px', fontSize: 12, cursor: 'pointer' }}>خروج</button>
        </div>
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
  );
}

function App() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('jamalvfx_admin_auth') === '1');
  return authed ? <Dashboard /> : <LoginScreen onLogin={() => setAuthed(true)} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
