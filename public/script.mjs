
/* ---------- elemen dasar ---------- */
const form          = document.getElementById('MyForm');
const jenisSelect   = document.getElementById('jenis-enkripsi');
const metodeWrapper = document.getElementById('metode-enkripsi');
const pesanInput    = document.getElementById('pesan');
const hasilBox      = document.getElementById('hasil-enkripsi');

/* mapping jenis → list metode */
const metodeMap = {
  tradisional: [
    { value: 'caesar',   label: 'Caesar Cipher'   },
    { value: 'vigenere', label: 'Vigenère Cipher' }
  ],
  modern: [
    { value: 'aes', label: 'AES (Base64 demo)' },
    { value: 'rsa', label: 'RSA (Base64 demo)' }
  ]
};

/* ---------- render select metode ---------- */
function renderMetodeSelect(jenis) {
  metodeWrapper.innerHTML = '';                     // kosongkan container

  const select = document.createElement('select');
  select.id = 'metode-select';
  select.className = 'bg-gray-700 text-white w-full p-2 rounded-md';

  metodeMap[jenis].forEach(({ value, label }) => {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = label;
    select.appendChild(o);
  });

  metodeWrapper.appendChild(select);
};

/* render default saat halaman load */
renderMetodeSelect(jenisSelect.value);

/* kalau user ganti jenis → rerender menu metode */
jenisSelect.addEventListener('change', () => {
  renderMetodeSelect(jenisSelect.value);
});

/* ---------- fungsi enkripsi dummy ---------- */
function caesar(str, shift = 3) {
  return str.replace(/[a-z]/gi, c =>
    String.fromCharCode(
      ((c.charCodeAt(0) - (c < 'a' ? 65 : 97) + shift) % 26) +
      (c < 'a' ? 65 : 97)
    )
  );
}

function vigenere(str, key = 'KEY') {
  return str.replace(/[a-z]/gi, (c, i) => {
    const base = c < 'a' ? 65 : 97;
    const k = key[i % key.length].toUpperCase().charCodeAt(0) - 65;
    return String.fromCharCode(((c.charCodeAt(0) - base + k) % 26) + base);
  });
}

/* ---------- handle submit ---------- */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const jenis        = jenisSelect.value;
  const metodeSelect = document.getElementById('metode-select');
  const metode       = metodeSelect.value;
  const pesan        = pesanInput.value.trim();

  if (!pesan) {
    hasilBox.textContent = '⚠️ Pesan kosong!';
    return;
  }

  let hasil = '';

  if (jenis === 'tradisional') {
    if (metode === 'caesar')   hasil = caesar(pesan);
    if (metode === 'vigenere') hasil = vigenere(pesan);
  } else { // modern
    // demo: pakai Base64 biar contoh cepet
    hasil = btoa(pesan);
  }

  hasilBox.textContent = hasil;
});
