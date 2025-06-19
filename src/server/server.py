from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#Halaman utama
@app.route("/")
def home():
    return render_template('index.html')

#api untuk encryption
@app.route("routes/API/", methods=['POST'])
def encrypt():
    data =  request.get_json(force=True)
    jenis = data.get('jenis-enkripsi')
    metode = data.get('enkripsi')
    pesan = data.get('pesan', '')
    key = data.get('key')

    if jenis == "Tradisional":
        match metode:
            case "caesar":
                hasil = caesar()
            case 'vigenere':
                hasil =  caesar()
            case 'atbash' :
                hasil = caesar()
            case _:
                return jsonify({'error' : 'Metode tradisional  tidak dikenali'}), 400   
    elif jenis == 'modern':
        match metode:
            case 'aes':
                hasil = aes(pesan, key)
            case 'rsa':
                hasil = rsa(pesan, key)
            case _:
                return jsonify({'error' : 'Metode tradisional  tidak dikenali'}), 400
    else:
        return jsonify({'error': 'Jenis enkripsi tidak dikenali'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)