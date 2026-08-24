const { useState, useEffect } = React;

const SUPABASE_URL = 'https://oskheiwnkklfumzzhjkd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jRizYnzfIdm_XQpHlFKLZQ_QYbaQnFH';

/* رمز ورود پنل مدیریت را همینجا تغییر بده */
const ADMIN_PASSWORD = 'jamalvfx1404';

const colors = {
  bg: '#0a0a0c', surface: '#151519', surface2: '#1e1e24', border: '#2a2a31',
  red: '#e01e3c', redDim: '#4a0f1c', gold: '#e0a91e', goldDim: '#3a2f10',
  text: '#f4f4f6', textMuted: '#8b8b93', textFaint: '#57575f', success: '#2fbf7a',
};

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
      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 24, width: '100%', maxWidth: 360 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16, textAlign: 'center' }}>ورود به پنل مدیریت</div>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="رمز عبور"
          style={{ width: '100%', background: colors.surface2, border: `1.5px solid ${colors.border}`, borderRadius: 10, padding: '11px 12px', color: colors.text, fontSize: 13, boxSizing: 'border-box', marginBottom: 10 }}
        />
        {error && <div style={{ color: colors.red, fontSize: 12, marginBottom: 10 }}>{error}</div>}
        <button onClick={submit} style={{ width: '100%', background: colors.red, color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          ورود
        </button>
      </div>
    </div>
  );
}

function OrderCard({ order, onStatusChange }) {
  const isImage = order.file_url && /\.(jpg|jpeg|png|gif|webp)$/i.test(order.file_url);
  const isAudio = order.file_url && /\.(mp3|wav|ogg|m4a)$/i.test(order.file_url);
  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
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
            <a href={order.file_url} target="_blank" rel="noreferrer" style={{ color: colors.red, fontSize: 12, fontWeight: 600 }}>دانلود / مشاهده فایل</a>
          </div>
        </div>
      )}
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
    </div>
  );
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

  function logout() {
    sessionStorage.removeItem('jamalvfx_admin_auth');
    window.location.reload();
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontWeight: 800, fontSize: 17 }}>سفارش‌های ثبت‌شده</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={load} style={{ background: colors.surface, border: `1px solid ${colors.border}`, color: colors.text, borderRadius: 8, padding: '7px 12px', fontSize: 12, cursor: 'pointer' }}>بروزرسانی</button>
          <button onClick={logout} style={{ background: 'transparent', border: `1px solid ${colors.border}`, color: colors.textMuted, borderRadius: 8, padding: '7px 12px', fontSize: 12, cursor: 'pointer' }}>خروج</button>
        </div>
      </div>
      {loading && <div style={{ color: colors.textMuted, textAlign: 'center', padding: 30 }}>در حال بارگذاری...</div>}
      {error && <div style={{ color: colors.red, textAlign: 'center', padding: 20 }}>{error}</div>}
      {!loading && !error && orders.length === 0 && (
        <div style={{ color: colors.textFaint, textAlign: 'center', padding: 40 }}>هنوز سفارشی ثبت نشده</div>
      )}
      {orders.map((o) => (
        <OrderCard key={o.id} order={o} onStatusChange={handleStatusChange} />
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
