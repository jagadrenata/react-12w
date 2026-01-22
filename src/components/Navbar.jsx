export default function Navbar() {
  return (
    <nav className="bg-green-600 fixed top-0 left-0 w-screen">
      <div className="container mx-auto bg-amber-100 flex items-center justify-between">
        <h2>YOUR COMPANY</h2>
        <div>
          <ul className="flex gap-6">
            <li>Home</li>
            <li>Home</li>
            <li>Home</li>
          </ul>
          
          <button className="rotate-90">|||</button>
        </div>
      </div>
    </nav>
  )
}