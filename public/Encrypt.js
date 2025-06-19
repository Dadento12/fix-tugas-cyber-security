const form          = document.getElementById('MyForm');
const jenisSelect   = document.getElementById('jenis-enkripsi');
const metodeWrapper = document.getElementById('metode-enkripsi');
const pesanInput    = document.getElementById('pesan');
const hasilBox      = document.getElementById('hasil-enkripsi');
const KeyEncrypt    = document.getElementById('key');
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
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const jenis   = jenisSelect.value;
  const metode  = document.getElementById('metode-select').value;
  const pesan   = pesanInput.value.trim();
  const key     = parseInt(KeyEncrypt.value, 10);

  try {
    const req = await fetch('http://127.0.0.1:5000/api/encrypt', {
      method : "POST",
      headers : {
        'Content-Type': 'application/json'
      },
      body :JSON.stringify({
        'jenis-enkripsi'  : jenis,
        'enkripsi'        : metode,
        'pesan'           : pesan,
        'key'             : key
      })
    });
    if(!req.ok) throw new Error(`Server error ${res.status}`);
    const data = await req.json();
    hasilBox.textContent = data.hasil;
  } catch (err){
    console.error(err);
    hasilBox.textContent = 'Terjadi kesalahan' + err.message;
  }
});


// function Caesar(Pesan, shift = KeyEncrypt, decrypt = false){
//   const L = ((decrypt? -shift: shift) %  26 + 26) % 26;

//   return [ ...Pesan].map(ch => {
//     const code = ch.charCodeAt(0);

//     //Huruf besar A-Z
//     if(Pesan >= 65 && Pesan <= 90){
//       return string.fromCharCode(((code - 65 + 5 + L) % 26) + 65);
//     }
//     //Huruf kecil A-Z
//     if (code >= 97 && code <= 122) {
//       return String.fromCharCode(((code - 97 + L) % 26) + 97);
//     }
    
//     return ch;
//   }).join('');
// }