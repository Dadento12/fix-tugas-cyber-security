const form          = document.getElementById('MyForm');
const jenisSelect   = document.getElementById('jenis-enkripsi');
const metodeWrapper = document.getElementById('metode-enkripsi');
const pesanInput    = document.getElementById('pesan');
const hasilBox      = document.getElementById('hasil-enkripsi');
const keyInput      = document.getElementById('key');

/* ===== list metode per jenis ===== */
const methodMap = {
  tradisional: [
    { value: 'caesar',   label: 'Caesar Cipher'   },
    { value: 'vigenere', label: 'Vigenère Cipher' },
    { value: 'atbash',   label: 'Atbash Cipher'   }
  ],
  modern: [
    { value: 'aes', label: 'AES (Base64 demo)' },
    { value: 'rsa', label: 'RSA (Base64 demo)' }
  ]
};

/* ====== helper UI – render <select> metode ====== */
function renderMetodeSelect(jenis) {
  metodeWrapper.innerHTML = '';
  const select = document.createElement('select');
  select.id        = 'metode-select';
  select.className = 'rounded-md w-full h-10 bg-gray-600 text-white px-3 focus:outline-none';

  methodMap[jenis].forEach(({ value, label }) => {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = label;
    select.appendChild(o);
  });
  metodeWrapper.appendChild(select);
}

/* render awal & saat ganti jenis */
renderMetodeSelect(jenisSelect.value);
jenisSelect.addEventListener('change', () => renderMetodeSelect(jenisSelect.value));

/* ══════════════════  SECTION: crypto logic  ══════════════════ */
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const isLower = c => c >= 'a' && c <= 'z';
const shiftChar = (c, s) => {
  const i = ABC.indexOf(c.toUpperCase());
  if (i === -1) return c;
  const n = (i + s + 26 * 1000) % 26;
  const enc = ABC[n];
  return isLower(c) ? enc.toLowerCase() : enc;
};

/* -- Caesar -------------------------------------------------- */
const caesar = (txt, shift = 0) => [...txt].map(ch => shiftChar(ch, shift)).join('');

/* -- Vigenère ------------------------------------------------ */
const vigenere = (txt, key) => {
  if (!key) throw new Error('Key kosong buat Vigenère');
  const shifts = [...key.toUpperCase()].map(k => ABC.indexOf(k));
  let j = 0;
  return [...txt].map(ch => {
    const idx = ABC.indexOf(ch.toUpperCase());
    if (idx === -1) return ch;
    return shiftChar(ch, shifts[j++ % shifts.length]);
  }).join('');
};

/* -- Atbash -------------------------------------------------- */
const atbash = txt => [...txt].map(ch => {
  const idx = ABC.indexOf(ch.toUpperCase());
  if (idx === -1) return ch;
  const enc = ABC[25 - idx];
  return isLower(ch) ? enc.toLowerCase() : enc;
}).join('');

/* -- AES-256-GCM (browser Web Crypto) ------------------------ */
const buf2b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
const b642buf = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

async function aesEncrypt(txt, keyB64) {
  let keyBytes;
  if (keyB64) keyBytes = b642buf(keyB64);
  else {
    keyBytes = crypto.getRandomValues(new Uint8Array(32));
    keyB64   = buf2b64(keyBytes);
  }
  const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt']);
  const iv  = crypto.getRandomValues(new Uint8Array(12));
  const ct  = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv },
                key,
                new TextEncoder().encode(txt)
              );
  return { ciphertext: buf2b64(ct), iv: buf2b64(iv), key: keyB64 };
}

/* -- RSA-OAEP 2048 (generate sekali, cache di window) -------- */
async function getRsaKeys() {
  if (!window.__rsaKeys) {
    window.__rsaKeys = await crypto.subtle.generateKey(
      { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1,0,1]), hash: 'SHA-256' },
      true,
      ['encrypt', 'decrypt']
    );
  }
  return window.__rsaKeys;
}
async function rsaEncrypt(txt) {
  const { publicKey } = await getRsaKeys();
  const ct = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    new TextEncoder().encode(txt)
  );
  return { ciphertext: buf2b64(ct) };
}

/* ========= handle submit tanpa fetch ========= */
form.addEventListener('submit', async e => {
  e.preventDefault();
  const metode = document.getElementById('metode-select').value;
  const pesan  = pesanInput.value.trim();
  const keyRaw = keyInput.value.trim();

  try {
    let out;
    switch (metode) {
      case 'caesar':
        out = caesar(pesan, parseInt(keyRaw || '0', 10));
        break;
      case 'vigenere':
        out = vigenere(pesan, keyRaw || 'KEY');
        break;
      case 'atbash':
        out = atbash(pesan);
        break;
      case 'aes':
        out = await aesEncrypt(pesan, keyRaw);  // keyRaw optional (Base64 32-byte)
        break;
      case 'rsa':
        out = await rsaEncrypt(pesan);          // key digenerate otomatis
        break;
      default:
        throw new Error('Metode ga dikenal');
    }
    hasilBox.textContent = typeof out === 'string' ? out : JSON.stringify(out, null, 2);
  } catch (err) {
    console.error(err);
    hasilBox.textContent = 'Error: ' + err.message;
  }
});
