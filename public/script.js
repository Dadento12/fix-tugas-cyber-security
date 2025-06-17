const form          = document.getElementById('MyForm');
const jenisSelect   = document.getElementById('jenis-enkripsi');
const metodeWrapper = document.getElementById('metode-enkripsi');
const pesanInput    = document.getElementById('pesan');
const hasilBox      = document.getElementById('hasil-enkripsi');

/* map jenis → list metode */
const methodMap = {
  tradisional: [
    { value: 'caesar',   label: 'Caesar Cipher'   },
    { value: 'vigenere', label: 'Vigenère Cipher' },
    { value: 'atbash',   label: 'Atbash Cipher'   }
  ],
  modern: [
    { value: 'aes', label: 'AES (Base64 demo)' },
    { value: 'rsa', label: 'RSA (Base64 demo)' }
  ]
};

/* ---------- render select metode ---------- */
function renderMetodeSelect(jenis) {
  metodeWrapper.innerHTML = ''; // Menghilangkan element bawaan

  const select = document.createElement('select');
  select.id        = 'metode-select';
  select.className = 'rounded-md w-full h-10 bg-gray-600 text-white px-3 focus:outline-none';

  methodMap[jenis].forEach(({ value, label }) => {
    const o   = document.createElement('option');
    o.value   = value;
    o.textContent = label;    // Merender text content
    select.appendChild(o);
  });

  metodeWrapper.appendChild(select);
}

/* render awal saat page load */
renderMetodeSelect(jenisSelect.value);

/* ganti list metode tiap jenis berubah */
jenisSelect.addEventListener('change', () => {
  renderMetodeSelect(jenisSelect.value);
});

/* Melakukan handle submit tanpa reload halaman */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const jenis   = jenisSelect.value;
  const metode  = document.getElementById('metode-select').value;
  const pesan   = pesanInput.value.trim();
  hasilBox.textContent = `(${jenis}‑${metode}) → ${pesan}`;
});
