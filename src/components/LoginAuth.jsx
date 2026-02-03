import { useState, useEffect, useRef, useMemo } from 'react';

const LoginAuth = ({ handleLogin }) => {
  const [password, setPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    passwordInputRef.current.focus();
    setPassword(localStorage.getItem('password'))
    setHashedPassword(md5Hash(password))
    console.log(hashedPassword)
    if (hashedPassword === '1b199') {
      setAuthenticated(true);
    } 
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('password', password)
    
    setHashedPassword(md5Hash(password))
    if (hashedPassword === '1b199') {
      setAuthenticated(true);
      handleLogin();
      alert('password benar');
    } else {
      alert('password salah');
    }
  };
  
  
  function md5Hash(string) {
    let hash = 0;
    if (string.length === 0) return hash;
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }


  let isAuthenticated = useMemo(() => authenticated ? '-top-screen' : 'top-0', [authenticated])

  return (<>
    {authenticated ? (
      <div></div>
    ) : (
     <div className={`${isAuthenticated} fixed z-100 left-0 h-screen w-screen bg-black/90 flex items-center justify-center`}>
        <form onSubmit={handleSubmit} className="w-200 flex flex-col bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl text-center font-semibold">masukkan password untuk masuk</h2>
          <input
            ref={passwordInputRef}
            value={password}
            type="password"
            className="shadow border-1 p-2 rounded-md"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-orange-500 p-2 rounded-md text-white" type="submit">
            submit
          </button>
        </form>
      </div>
    )
    }
  </>
  );
};

export default LoginAuth;
