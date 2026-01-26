import { openDB } from "idb"

// Nama daabase
const DB_NAME =  "MyAppDB"
// Versi datdabase
const DB_VERSION = 1

/**
 * inisialisasi dan membuka koneksi database
 * fungsi ini akan membuat database bary atau upgrade jika versi berubah
*/
export async function initDB() {
  // openDB menerima parameter
  // 1. Nama db 
  // 2. versi db 
  // 3. Object kongfigurasi dengan callback upgrade
  const db = await openDB(DB_NAME, DB_VERSION, {
    // callback ini dipanggil saat database dibuat atau di upgrade
    upgrade(db, oldVersion, newVersion, transaction) {
      //cek apakah object store sudah ada 
      if(!db.objectStoreNames.contains("todos")) {
        //membuat object store 
        // parameter kedua { keypath: "id" } menentukan primary key 
        // { autoincrement: true } id otomatis bertambah
        const store = db.createObjectStore("todos", {
          keyPath: "id",
          autoIncrement: true,
        })
        
        //membuat index untuk pencarian cepat
        // createIndex(namaIndex, propertim opsi) 
        store.createIndex("title", "title", { unique: false })
        store.createIndex("completed", "completed", { unique: false})
        store.createIndex("createdAt", "createdAt", { unique: false })
      }
      
      // contoh object store lain (users)
    }
  })
  
  return db
}

export async function getDB() {
  return await openDB(DB_NAME, DB_VERSION)
}