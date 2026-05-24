const navItems = [
  { label: "Kalkulator", href: "#kalkulator" },
  { label: "Panduan", href: "#panduan" },
  { label: "Sumber", href: "#sumber" }
];

export function Navbar() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Navigasi utama">
        <a className="brand" href="#top" aria-label="Cek Zakat">
          <span className="brand-mark" aria-hidden="true">
            CZ
          </span>
          <span>Cek Zakat</span>
        </a>
        <div className="nav-links">
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <a className="nav-cta" href="#kalkulator">
          Mulai cek
        </a>
      </nav>
    </header>
  );
}
