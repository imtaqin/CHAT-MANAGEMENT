
### Chat Manjemen 

### Persiapan

- Nodejs v.18 (https://nodejs.org/en) atau versi yang paling terbaru
- Server atau komputer lokal ber OS (Linux / Windows )
-  Postman / Rest API Client 

### Penginstallan 

install node terlebih dahulu , lalu pergi ke folder project nya dan buka terminal didalam folder tersebut 

dan ketik 

```bash
npm install
```
setelah semuanya terinstall maka hal selanjutnya adalah memulai aplikasi dengan cara mengetikan lagi di terminal

```bash
npm start
```

## Penggunaan

sebelum memasukan data data akun diharapkan memasukan webhook atau url yang akan di jadikan sebagai penerima chat nya 

saat di mulai akan ada tulisan `server berjalan di port 3000`  , port ini bisa di ubah di file `config.js`
```javascript
module.exports = {

PORT_APPS:  3000,

}
```

lalu masukan webhook url di dalam postman atau rest api client lainnya 
![](https://telegra.ph/file/7a729751883788eb221eb.png)
dengan url : `http://localhost:3000/set_webhook`


### Setting Akun Sosmed

#### - facebook 

sama seperti webhook kita hanya butuh memasukan data akun dengan POST data 

URL : `https://localhost:3000/facebook`
```json
{
"username"  :  "username_facebook",
"password"  :  "password_facebook"
}
```

#### - instagram 
URL : `https://localhost:3000/instagram`
```json
{
"username"  :  "username_instagram",
"password"  :  "password_instagram"
}
```

#### - tiktok 
URL : `https://localhost:3000/tiktok`
```json
{
"username"  :  "username_tiktok",
"password"  :  "password_tiktok"
}
```

#### Telegram

untuk telegram ada 2 step untuk memasukan akun nya 

step pertama adalah memasukan nomor hp terlebih dahulu
URL : `https://localhost:3000/telegram_login`
```json
{
"nohp"  :  "+628xxxxxxxxx"
}
```

kemudian akan ada kode verifikasi yang akan terkirim ke akun telegram seperti ini

![](https://telegra.ph/file/7f55747c43e8cac75ebf3.png)

masukan kode tersebut didalam step kedua 

URL : `https://localhost:3000/telegram_verify`
```json
{
"nohp"  :  "+628xxxxxxxxx",
"code" : "xxxxx"
}
```

#### Gmail

untuk gmail akun yang digunakan untuk login adalah akun google namun password yang akan digunkan adalah sandi aplikasi 

untuk cara membuat sandi aplikasi bisa dilihat di tutorial resmi google nya 

https://support.google.com/accounts/answer/185833?hl=id

atau video https://www.youtube.com/watch?v=OX2g6QB6LWI

kemudian jika sudah masukan detail akun kerest apinya 

URL : `https://localhost:3000/email`

```json
{
"username"  :  "username_gmail",  // email gmail
"password"  :  "password_gmail"  // sandi aplikasi bukan sandi akun
}
```


### Contoh jalannya aplikasi

![enter image description here](https://telegra.ph/file/ffd1bda64e03b05fee47b.png)