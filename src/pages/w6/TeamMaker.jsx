
import { useState } from 'react';
import { Users, Shuffle, UserCircle, Save, Trash2, FolderOpen, Plus, X } from 'lucide-react';

export default function TeamMaker() {
  const [text, setText] = useState({
    male: "", 
    female: ""
  });
  const [totalTeam, setTotalTeam] = useState(""); 
  const [teams, setTeams] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  
  // Template states
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Kelas 10A",
      male: "Budi\nAndi\nRudi\nDedi\nFarhan",
      female: "Siti\nAni\nDewi\nRina\nLina"
    },
    {
      id: 2,
      name: "Tim Basket",
      male: "Jordan\nLebron\nKobe\nCurry",
      female: "Sue\nDiana\nBreanna\nCandace"
    },
    {
      id: 3,
      name: "Peserta Workshop",
      male: "Ahmad\nBambang\nCharlie\nDavid\nEko",
      female: "Fatimah\nGita\nHani\nIndah\nJulia"
    }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setText(prev => ({ ...prev, [name]: value }));
  };

  const handleTotalTeamChange = (e) => {
    setTotalTeam(e.target.value);
  };
  
  // Load template
  const handleLoadTemplate = (e) => {
    const templateId = parseInt(e.target.value);
    setSelectedTemplate(templateId);
    
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setText({
          male: template.male,
          female: template.female
        });
      }
    }
  };
  
  // Save as new template
  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      alert("Nama template tidak boleh kosong!");
      return;
    }
    
    const newTemplate = {
      id: Date.now(),
      name: newTemplateName,
      male: text.male,
      female: text.female
    };
    
    setTemplates([...templates, newTemplate]);
    setNewTemplateName("");
    setShowSaveModal(false);
    alert(`Template "${newTemplateName}" berhasil disimpan!`);
  };
  
  // Delete template
  const handleDeleteTemplate = (templateId) => {
    if (window.confirm("Yakin ingin menghapus template ini?")) {
      setTemplates(templates.filter(t => t.id !== templateId));
      if (selectedTemplate === templateId) {
        setSelectedTemplate("");
      }
      alert("Template berhasil dihapus!");
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsShuffling(true);

    const maleUsers = text.male.split("\n").map(u => u.trim()).filter(Boolean);
    const femaleUsers = text.female.split("\n").map(u => u.trim()).filter(Boolean);

    const teamCount = parseInt(totalTeam);
    if (isNaN(teamCount) || teamCount <= 0) {
      alert("Jumlah tim tidak valid!");
      setIsShuffling(false);
      return;
    }

    const shuffle = (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    setTimeout(() => {
      const shuffledMales = shuffle(maleUsers);
      const shuffledFemales = shuffle(femaleUsers);

      const resultTeams = Array.from({ length: teamCount }, () => ({ male: [], female: [] }));

      shuffledMales.forEach((user, index) => {
        resultTeams[index % teamCount].male.push(user);
      });

      shuffledFemales.forEach((user, index) => {
        resultTeams[index % teamCount].female.push(user);
      });

      setTeams(resultTeams);
      setIsShuffling(false);
    }, 1000);
  };
  
  return(
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
          <div className="bg-gray-800 text-white px-6 py-4 border-b-4 border-gray-900">
            <h1 className="text-3xl font-bold text-center tracking-wide flex items-center justify-center">
              <Shuffle className="w-8 h-8 mr-3" />
              TEAM SHUFFLE MACHINE
            </h1>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-b-2 border-gray-300">
            <p className="text-center text-gray-700 font-medium">
              Pembuat Tim Otomatis - Versi 1.0
            </p>
          </div>
        </div>

        {/* Template Section */}
        <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
          <div className="bg-indigo-700 text-white px-4 py-2 border-b-2 border-gray-900">
            <h2 className="font-bold flex items-center">
              <FolderOpen className="w-5 h-5 mr-2" />
              TEMPLATE MANAGER
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Load Template */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Pilih Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={handleLoadTemplate}
                  className="w-full px-3 py-2 border-2 border-gray-400 focus:border-indigo-600 focus:outline-none font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
                >
                  <option value="">-- Pilih Template --</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(true)}
                  className="flex-1 bg-green-700 hover:bg-green-800 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-white font-bold py-2 px-4 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-sm flex items-center justify-center transition-all"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
                
                {selectedTemplate && (
                  <button
                    type="button"
                    onClick={() => handleDeleteTemplate(selectedTemplate)}
                    className="flex-1 bg-red-700 hover:bg-red-800 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-white font-bold py-2 px-4 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-sm flex items-center justify-center transition-all"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Template List */}
            {templates.length > 0 && (
              <div className="mt-4 border-t-2 border-gray-300 pt-4">
                <p className="text-xs font-bold text-gray-600 mb-2 uppercase">Saved Templates ({templates.length})</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {templates.map(template => (
                    <div
                      key={template.id}
                      className="bg-indigo-50 border-2 border-indigo-300 px-3 py-2 text-xs font-mono shadow-[2px_2px_0px_0px_rgba(99,102,241,0.5)] flex items-center justify-between"
                    >
                      <span className="truncate">{template.name}</span>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Template Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full">
              <div className="bg-green-700 text-white px-4 py-3 border-b-2 border-gray-900">
                <h3 className="font-bold flex items-center justify-between">
                  <span className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    SAVE NEW TEMPLATE
                  </span>
                  <button onClick={() => setShowSaveModal(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </h3>
              </div>
              
              <div className="p-6">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Nama Template
                </label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Contoh: Kelas 10A"
                  className="w-full px-3 py-2 border-2 border-gray-400 focus:border-green-600 focus:outline-none font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] mb-4"
                />
                
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveTemplate}
                    className="flex-1 bg-green-700 hover:bg-green-800 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-white font-bold py-2 px-4 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-sm transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-white font-bold py-2 px-4 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-sm transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
          <div className="bg-gray-700 text-white px-4 py-2 border-b-2 border-gray-900">
            <h2 className="font-bold flex items-center">
              <UserCircle className="w-5 h-5 mr-2" />
              INPUT DATA ANGGOTA
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              
              {/* Male Input */}
              <div>
                <div className="bg-blue-50 border-2 border-blue-600 px-3 py-2 mb-2 shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]">
                  <label className="font-bold text-blue-800 text-sm uppercase tracking-wide flex items-center">
                    <UserCircle className="w-4 h-4 mr-2" />
                    Anggota Laki-laki
                  </label>
                </div>
                <textarea
                  name="male"
                  value={text.male}
                  onChange={handleChange}
                  rows={10}
                  className="w-full px-3 py-2 border-2 border-gray-400 focus:border-blue-600 focus:outline-none font-mono text-sm bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
                  placeholder="Masukkan nama...&#10;Satu nama per baris"
                />
                <div className="bg-gray-100 border-2 border-gray-400 border-t-0 px-3 py-1">
                  <p className="text-xs font-mono text-gray-700">
                    TOTAL: <strong className="text-blue-600">{text.male.split("\n").filter(Boolean).length}</strong> orang
                  </p>
                </div>
              </div>

              {/* Female Input */}
              <div>
                <div className="bg-pink-50 border-2 border-pink-600 px-3 py-2 mb-2 shadow-[4px_4px_0px_0px_rgba(219,39,119,1)]">
                  <label className="font-bold text-pink-800 text-sm uppercase tracking-wide flex items-center">
                    <UserCircle className="w-4 h-4 mr-2" />
                    Anggota Perempuan
                  </label>
                </div>
                <textarea
                  name="female"
                  value={text.female}
                  onChange={handleChange}
                  rows={10}
                  className="w-full px-3 py-2 border-2 border-gray-400 focus:border-pink-600 focus:outline-none font-mono text-sm bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
                  placeholder="Masukkan nama...&#10;Satu nama per baris"
                />
                <div className="bg-gray-100 border-2 border-gray-400 border-t-0 px-3 py-1">
                  <p className="text-xs font-mono text-gray-700">
                    TOTAL: <strong className="text-pink-600">{text.female.split("\n").filter(Boolean).length}</strong> orang
                  </p>
                </div>
              </div>
            </div>

            {/* Team Count */}
            <div className="mb-6">
              <div className="bg-purple-50 border-2 border-purple-600 px-3 py-2 mb-2 inline-block shadow-[4px_4px_0px_0px_rgba(147,51,234,1)]">
                <label className="font-bold text-purple-800 text-sm uppercase tracking-wide flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Jumlah Tim
                </label>
              </div>
              <input
                type="number"
                value={totalTeam}
                onChange={handleTotalTeamChange}
                min="1"
                className="w-full md:w-48 px-4 py-2 border-2 border-gray-400 focus:border-purple-600 focus:outline-none text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
                placeholder="0"
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isShuffling}
              className="w-full bg-gray-800 hover:bg-gray-900 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none text-white font-bold py-3 px-6 border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider flex items-center justify-center transition-all"
            >
              {isShuffling ? (
                <>
                  <Shuffle className="w-5 h-5 mr-2 animate-spin" />
                  Sedang Mengacak...
                </>
              ) : (
                <>
                  <Shuffle className="w-5 h-5 mr-2" />
                  Acak Tim Sekarang
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {teams.length > 0 && (
          <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-green-700 text-white px-4 py-3 border-b-2 border-gray-900">
              <h2 className="font-bold text-center text-xl uppercase tracking-wide flex items-center justify-center">
                <Users className="w-6 h-6 mr-2" />
                Hasil Pembagian Tim
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team, idx) => (
                  <div 
                    key={idx}
                    className="border-4 border-gray-900 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {/* Team Header */}
                    <div className="bg-gray-800 text-white px-4 py-2 border-b-2 border-gray-900">
                      <h3 className="font-bold text-center uppercase tracking-wide">
                        Team {idx + 1}
                      </h3>
                    </div>
                    
                    <div className="p-4">
                      {/* Male Section */}
                      <div className="mb-3">
                        {team.male.length > 0 ? (
                          <ul className="space-y-1">
                            {team.male.map((name, i) => (
                              <li key={i} className="bg-blue-50 border-2 border-blue-300 px-3 py-2 text-sm font-mono shadow-[2px_2px_0px_0px_rgba(59,130,246,0.5)]">
                                {name}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-400 text-xs italic px-2">- Tidak ada anggota laki-laki -</p>
                        )}
                      </div>

                      {/* Female Section */}
                      <div className="mb-3">
                        {team.female.length > 0 ? (
                          <ul className="space-y-1">
                            {team.female.map((name, i) => (
                              <li key={i} className="bg-pink-50 border-2 border-pink-300 px-3 py-2 text-sm font-mono shadow-[2px_2px_0px_0px_rgba(236,72,153,0.5)]">
                                {name}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-400 text-xs italic px-2">- Tidak ada anggota perempuan -</p>
                        )}
                      </div>

                      {/* Total */}
                      <div className="bg-gray-800 text-white border-2 border-gray-900 px-3 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-center text-xs font-bold uppercase flex items-center justify-center">
                          <Users className="w-4 h-4 mr-2" />
                          Total: {team.male.length + team.female.length} Anggota
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm font-mono">
            © 2024 Team Shuffle Machine - Classic Edition
          </p>
        </div>
      </div>
    </div>
  )
}