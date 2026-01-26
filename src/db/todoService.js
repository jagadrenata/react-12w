import { getDB } from './database'

/**
 * Create - menanbah data baru ke db
 * @param {Object} todo- { title, completed, description}
 * @return {Promise<Number>} - id todo yang baru dibuat
 */
 export const addTodo = async (todo) => {
   // dapatkan instance database 
   const db = await getDB()
   
   // tambahkan timestamp created
   const todoWithTimestamp = {
     ...todo,
     createdAt: new Date().toISOString(),
     updatedAt: new Date().toISOString(),
   }
   
   // buat transaksi dengan mode readwrite (baca tulis) 
   //parameter: nama Object store, mode transaksi
   const tx = db.transaction('todos', 'readwrite')
   
   //dapatkan object store dari transaksi
   const store = tx.objectStore('todos')
 }