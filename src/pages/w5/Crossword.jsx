import React, { useState } from 'react';
import html2canvas from 'html2canvas';

// Komponen utama aplikasi
export default function CrosswordGenerator() {
  // State untuk menyimpan input teks dari user
  const [inputText, setInputText] = useState('');
  
  // State untuk menyimpan data crossword (grid dan kata-kata)
  const [crosswordData, setCrosswordData] = useState(null);
  
  // State untuk loading indicator
  const [loading, setLoading] = useState(false);
  
  // State untuk statistik
  const [stats, setStats] = useState({
    totalWords: 0,
    gridSize: '0×0',
    placedWords: 0
  });

  /**
   * Fungsi untuk parsing input text menggunakan regex
   * Format: JAWABAN / Soal atau petunjuk
   * @param {string} text - Teks input dari user
   * @returns {Array} Array berisi object {answer, clue}
   */
  const parseInput = (text) => {
    // Split text berdasarkan newline untuk mendapat array baris
    const lines = text.trim().split('\n');
    const entries = [];
    
    // Regex pattern: menangkap semua karakter sebelum "/" sebagai jawaban,
    // dan setelah "/" sebagai soal
    const regex = /^(.+?)\s*\/\s*(.+)$/;

    // Loop setiap baris untuk di-parse
    lines.forEach(line => {
      // Match baris dengan regex pattern
      const match = line.trim().match(regex);
      
      if (match) {
        // match[1] = jawaban (grup pertama dalam regex)
        // Uppercase dan hapus spasi dari jawaban
        const answer = match[1].trim().toUpperCase().replace(/\s+/g, '');
        
        // match[2] = soal/petunjuk (grup kedua dalam regex)
        const clue = match[2].trim();
        
        // Hanya tambahkan jika jawaban dan soal tidak kosong
        if (answer && clue) {
          entries.push({ answer, clue });
        }
      }
    });

    return entries;
  };

  /**
   * Fungsi untuk membuat grid teka-teki silang
   * @param {Array} entries - Array berisi {answer, clue}
   * @returns {Object} Object berisi grid dan words yang sudah ditempatkan
   */
  const createCrosswordGrid = (entries) => {
    // Sort entries berdasarkan panjang kata (terpanjang dulu)
    // Ini memudahkan penempatan kata panjang sebagai anchor
    entries.sort((a, b) => b.answer.length - a.answer.length);
    
    // Buat grid 2D dengan ukuran maksimal 30x30
    const maxSize = 30;
    
    // Array.fill(null) membuat array berisi null
    // .map() untuk membuat array 2D (grid)
    const grid = Array(maxSize).fill(null).map(() => Array(maxSize).fill(null));
    
    // Array untuk menyimpan kata yang sudah berhasil ditempatkan
    const placed = [];

    // Tempatkan kata pertama (terpanjang) secara horizontal di tengah grid
    if (entries.length > 0) {
      const first = entries[0];
      
      // Hitung posisi start agar kata berada di tengah grid
      const startRow = Math.floor(maxSize / 2);
      const startCol = Math.floor((maxSize - first.answer.length) / 2);
      
      // Loop setiap huruf dan tempatkan di grid
      for (let i = 0; i < first.answer.length; i++) {
        grid[startRow][startCol + i] = first.answer[i];
      }
      
      // Simpan informasi kata yang sudah ditempatkan
      placed.push({
        word: first.answer,
        clue: first.clue,
        row: startRow,
        col: startCol,
        direction: 'across', // horizontal
        number: 1 // nomor urut untuk soal
      });
    }

    // Mulai nomor dari 2 karena kata pertama sudah pakai nomor 1
    let wordNumber = 2;
    
    // Loop untuk kata kedua dan seterusnya
    for (let i = 1; i < entries.length; i++) {
      const entry = entries[i];
      
      // Variable untuk menyimpan penempatan terbaik
      let bestPlacement = null;
      let bestScore = -1;

      // Coba tempatkan kata baru dengan mencari perpotongan
      // dengan kata yang sudah ada
      for (const placedWord of placed) {
        // Loop setiap huruf di kata baru
        for (let j = 0; j < entry.answer.length; j++) {
          // Loop setiap huruf di kata yang sudah ada
          for (let k = 0; k < placedWord.word.length; k++) {
            // Jika ada huruf yang sama, coba tempatkan di sini
            if (entry.answer[j] === placedWord.word[k]) {
              let row, col, direction;
              
              // Jika kata yang sudah ada horizontal (across),
              // tempatkan kata baru secara vertikal (down)
              if (placedWord.direction === 'across') {
                direction = 'down';
                // Hitung posisi row: mundur sebanyak index huruf yang match
                row = placedWord.row - j;
                // Column sama dengan posisi huruf yang match
                col = placedWord.col + k;
              } else {
                // Sebaliknya, jika kata yang ada vertikal,
                // tempatkan kata baru horizontal
                direction = 'across';
                row = placedWord.row + k;
                col = placedWord.col - j;
              }

              // Cek apakah kata bisa ditempatkan di posisi ini
              if (canPlaceWord(grid, entry.answer, row, col, direction, maxSize)) {
                // Hitung score penempatan (random untuk simplicity)
                const score = calculatePlacementScore(row, col, direction, entry.answer.length);
                
                // Simpan jika ini penempatan terbaik sejauh ini
                if (score > bestScore) {
                  bestScore = score;
                  bestPlacement = { row, col, direction };
                }
              }
            }
          }
        }
      }

      // Jika ditemukan penempatan yang valid
      if (bestPlacement) {
        // Tempatkan kata di grid
        placeWord(grid, entry.answer, bestPlacement.row, bestPlacement.col, bestPlacement.direction);
        
        // Simpan info kata yang sudah ditempatkan
        placed.push({
          word: entry.answer,
          clue: entry.clue,
          row: bestPlacement.row,
          col: bestPlacement.col,
          direction: bestPlacement.direction,
          number: wordNumber++
        });
      }
    }

    // Dapatkan batas area yang terisi (untuk trim grid)
    const bounds = getGridBounds(grid, maxSize);
    
    // Trim grid agar hanya area yang terisi saja
    const trimmedGrid = trimGrid(grid, bounds, maxSize);

    // Adjust posisi semua kata setelah trim
    // Kurangi dengan offset minRow dan minCol
    placed.forEach(p => {
      p.row -= bounds.minRow;
      p.col -= bounds.minCol;
    });

    return { grid: trimmedGrid, words: placed };
  };

  /**
   * Fungsi untuk cek apakah kata bisa ditempatkan di posisi tertentu
   * @param {Array} grid - Grid 2D
   * @param {string} word - Kata yang mau ditempatkan
   * @param {number} row - Posisi row awal
   * @param {number} col - Posisi column awal
   * @param {string} direction - 'across' atau 'down'
   * @param {number} maxSize - Ukuran maksimal grid
   * @returns {boolean} True jika bisa ditempatkan
   */
  const canPlaceWord = (grid, word, row, col, direction, maxSize) => {
    // Validasi posisi tidak boleh negatif
    if (row < 0 || col < 0) return false;

    // Loop setiap huruf dalam kata
    for (let i = 0; i < word.length; i++) {
      // Hitung posisi cell untuk huruf ke-i
      const r = direction === 'across' ? row : row + i;
      const c = direction === 'across' ? col + i : col;

      // Validasi tidak keluar dari grid
      if (r >= maxSize || c >= maxSize) return false;

      // Jika cell sudah terisi dan bukan huruf yang sama, return false
      if (grid[r][c] !== null && grid[r][c] !== word[i]) {
        return false;
      }

      // Cek cell di atas dan bawah (untuk kata horizontal)
      // atau kiri-kanan (untuk kata vertikal)
      // Pastikan tidak ada huruf yang bersebelahan kecuali di perpotongan
      if (direction === 'across') {
        // Cek atas
        if ((r > 0 && grid[r-1][c] !== null && grid[r-1][c] !== word[i]) ||
            // Cek bawah
            (r < maxSize-1 && grid[r+1][c] !== null && grid[r+1][c] !== word[i])) {
          // Kecuali jika ini adalah perpotongan (cell sudah ada huruf yang sama)
          if (grid[r][c] !== word[i]) return false;
        }
      } else { // direction === 'down'
        // Cek kiri
        if ((c > 0 && grid[r][c-1] !== null && grid[r][c-1] !== word[i]) ||
            // Cek kanan
            (c < maxSize-1 && grid[r][c+1] !== null && grid[r][c+1] !== word[i])) {
          if (grid[r][c] !== word[i]) return false;
        }
      }
    }

    return true;
  };

  /**
   * Fungsi untuk menempatkan kata di grid
   * @param {Array} grid - Grid 2D
   * @param {string} word - Kata yang mau ditempatkan
   * @param {number} row - Posisi row awal
   * @param {number} col - Posisi column awal
   * @param {string} direction - 'across' atau 'down'
   */
  const placeWord = (grid, word, row, col, direction) => {
    // Loop setiap huruf
    for (let i = 0; i < word.length; i++) {
      // Hitung posisi untuk huruf ke-i
      const r = direction === 'across' ? row : row + i;
      const c = direction === 'across' ? col + i : col;
      
      // Tempatkan huruf di grid
      grid[r][c] = word[i];
    }
  };

  /**
   * Fungsi untuk menghitung score penempatan kata
   * (Implementasi sederhana dengan random, bisa diperbaiki)
   */
  const calculatePlacementScore = (row, col, direction, length) => {
    // Return random score antara 0-1
    // Bisa diubah menjadi algoritma yang lebih kompleks
    // misalnya prioritas tengah grid, minimasi overlap, dll
    return Math.random();
  };

  /**
   * Fungsi untuk mendapatkan batas area yang terisi di grid
   * @param {Array} grid - Grid 2D
   * @param {number} maxSize - Ukuran grid
   * @returns {Object} {minRow, maxRow, minCol, maxCol}
   */
  const getGridBounds = (grid, maxSize) => {
    // Inisialisasi dengan nilai ekstrem
    let minRow = maxSize, maxRow = 0, minCol = maxSize, maxCol = 0;

    // Loop seluruh grid
    for (let i = 0; i < maxSize; i++) {
      for (let j = 0; j < maxSize; j++) {
        // Jika cell terisi
        if (grid[i][j] !== null) {
          // Update batas minimum dan maksimum
          minRow = Math.min(minRow, i);
          maxRow = Math.max(maxRow, i);
          minCol = Math.min(minCol, j);
          maxCol = Math.max(maxCol, j);
        }
      }
    }

    return { minRow, maxRow, minCol, maxCol };
  };

  /**
   * Fungsi untuk trim grid hanya area yang terisi
   * @param {Array} grid - Grid original
   * @param {Object} bounds - Batas {minRow, maxRow, minCol, maxCol}
   * @returns {Array} Grid yang sudah di-trim
   */
  const trimGrid = (grid, bounds) => {
    const trimmed = [];
    
    // Loop dari minRow sampai maxRow
    for (let i = bounds.minRow; i <= bounds.maxRow; i++) {
      const row = [];
      
      // Loop dari minCol sampai maxCol
      for (let j = bounds.minCol; j <= bounds.maxCol; j++) {
        row.push(grid[i][j]);
      }
      
      trimmed.push(row);
    }
    
    return trimmed;
  };

  /**
   * Handler untuk generate crossword
   */
  const generateCrossword = () => {
    // Parse input text menjadi array entries
    const entries = parseInput(inputText);

    // Validasi minimal ada 1 entry
    if (entries.length === 0) {
      alert('Masukkan minimal satu soal dengan format: jawaban / soal');
      return;
    }

    // Set loading state
    setLoading(true);
    
    // Update stats total words
    setStats(prev => ({ ...prev, totalWords: entries.length }));

    // Gunakan setTimeout untuk memberikan delay dan loading effect
    setTimeout(() => {
      // Generate crossword grid
      const data = createCrosswordGrid(entries);
      
      // Simpan ke state
      setCrosswordData(data);
      
      // Update stats
      setStats({
        totalWords: entries.length,
        gridSize: `${data.grid.length}×${data.grid[0].length}`,
        placedWords: data.words.length
      });
      
      // Matikan loading
      setLoading(false);
    }, 500);
  };

  /**
   * Handler untuk export ke gambar PNG
   */
  const exportToImage = () => {
    // Validasi crossword sudah dibuat
    if (!crosswordData) {
      alert('Buat TTS terlebih dahulu!');
      return;
    }

    // Ambil element container crossword
    const element = document.querySelector('.crossword-container');

    // Gunakan html2canvas untuk convert element ke canvas
    // scale: 2 untuk kualitas lebih baik
    html2canvas(element, { scale: 2 }).then(canvas => {
      // Convert canvas ke data URL (base64)
      const dataUrl = canvas.toDataURL('image/png');
      
      // Buat element link untuk download
      const link = document.createElement('a');
      link.download = 'teka-teki-silang.png';
      link.href = dataUrl;
      
      // Trigger click untuk download
      link.click();
    });
  };

  /**
   * Handler untuk export ke PDF
   */
  const exportToPDF = () => {
    // Validasi crossword sudah dibuat
    if (!crosswordData) {
      alert('Buat TTS terlebih dahulu!');
      return;
    }

    // Ambil element container
    const element = document.querySelector('.crossword-container');

    // Convert element ke canvas dulu
    html2canvas(element, { scale: 2 }).then(canvas => {
      // Import jsPDF dari window (sudah di-load via CDN)
      const { jsPDF } = window.jspdf;
      
      // Convert canvas ke image data
      const imgData = canvas.toDataURL('image/png');
      
      // Buat PDF instance (portrait, mm, A4)
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Hitung dimensi image agar fit di halaman A4
      const imgWidth = 190; // lebar dalam mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Tambahkan image ke PDF (x=10mm, y=10mm dari kiri-atas)
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Save PDF
      pdf.save('teka-teki-silang.pdf');
    });
  };

  /**
   * Handler untuk clear/reset semua
   */
  const clearAll = () => {
    setInputText('');
    setCrosswordData(null);
    setStats({
      totalWords: 0,
      gridSize: '0×0',
      placedWords: 0
    });
  };

  /**
   * Komponen untuk render grid crossword
   */
  const CrosswordGrid = ({ data }) => {
    const { grid, words } = data;

    // Buat grid untuk menyimpan nomor di setiap cell
    const numberGrid = Array(grid.length).fill(null).map(() => 
      Array(grid[0].length).fill(0)
    );
    
    // Assign nomor ke cell yang merupakan awal kata
    words.forEach(w => {
      numberGrid[w.row][w.col] = w.number;
    });

    return (
      <div className="crossword-container inline-block bg-white p-8 rounded-xl">
        {/* Grid Container */}
        <div 
          className="inline-grid gap-0.5 bg-black p-0.5 border-4 border-black"
          style={{ gridTemplateColumns: `repeat(${grid[0].length}, 35px)` }}
        >
          {/* Loop setiap row */}
          {grid.map((row, i) => (
            // Loop setiap column dalam row
            row.map((cell, j) => {
              const num = numberGrid[i][j];
              const isFilled = cell === null;
              
              return (
                <div
                  key={`${i}-${j}`}
                  className={`w-[35px] h-[35px] relative flex items-center justify-center font-bold text-sm border border-gray-300 ${
                    isFilled ? 'bg-transparent border-none' : 'bg-white'
                  }`}
                >
                  {/* Nomor di pojok kiri atas cell */}
                  {num > 0 && (
                    <span className="absolute top-0.5 left-0.5 text-[9px] font-bold text-purple-600">
                      {num}
                    </span>
                  )}
                </div>
              );
            })
          ))}
        </div>

        {/* Clues Section */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          {/* Mendatar (Across) */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-purple-600 font-bold text-xl mb-4">Mendatar</h3>
            {words.filter(w => w.direction === 'across').map(w => (
              <div key={w.number} className="py-2 border-b border-gray-300 last:border-b-0">
                <strong>{w.number}.</strong> {w.clue}
              </div>
            ))}
          </div>

          {/* Menurun (Down) */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-purple-600 font-bold text-xl mb-4">Menurun</h3>
            {words.filter(w => w.direction === 'down').map(w => (
              <div key={w.number} className="py-2 border-b border-gray-300 last:border-b-0">
                <strong>{w.number}.</strong> {w.clue}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 p-5">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-2">🧩 Pembuat Teka-Teki Silang</h1>
          <p className="text-lg opacity-90">Buat teka-teki silang otomatis dari teks dengan mudah</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 p-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Input Card */}
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
              <h2 className="text-purple-600 font-bold text-2xl mb-4">📝 Input Soal & Jawaban</h2>
              
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-4 text-sm text-yellow-800">
                <strong>Format:</strong> jawaban / soal<br />
                Contoh: INDONESIA / Negara kepulauan terbesar di dunia
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full min-h-[300px] p-4 border-2 border-gray-300 rounded-xl font-mono text-sm resize-y focus:outline-none focus:border-purple-600 transition-colors"
                placeholder="Masukkan soal dan jawaban Anda di sini...
Contoh:
KOMPUTER / Perangkat elektronik untuk mengolah data
PROGRAMMING / Kegiatan membuat kode untuk software
INDONESIA / Negara kepulauan terbesar di dunia
JAVASCRIPT / Bahasa pemrograman untuk web"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={generateCrossword}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  🎯 Buat TTS
                </button>
                <button
                  onClick={clearAll}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
              <h2 className="text-purple-600 font-bold text-2xl mb-4">📊 Statistik</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold">{stats.totalWords}</div>
                  <div className="text-sm opacity-90 mt-1">Total Kata</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold">{stats.gridSize}</div>
                  <div className="text-sm opacity-90 mt-1">Ukuran Grid</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold">{stats.placedWords}</div>
                  <div className="text-sm opacity-90 mt-1">Kata Terisi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
              <h2 className="text-purple-600 font-bold text-2xl mb-4">🎨 Hasil TTS</h2>
              
              {loading && (
                <div className="text-center py-8 text-purple-600 font-bold">
                  ⏳ Membuat teka-teki silang...
                </div>
              )}

              <div className="text-center overflow-x-auto">
                {crosswordData && <CrosswordGrid data={crosswordData} />}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={exportToPDF}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  📄 Export PDF
                </button>
                <button
                  onClick={exportToImage}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  🖼️ Export Gambar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}