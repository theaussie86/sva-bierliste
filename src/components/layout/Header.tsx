import Link from "next/link";

export function Header() {
  return (
    <header className="bg-sva-dark text-white py-4 px-6 md:px-12 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-white">SV</span>
          <span className="text-sva-green ml-1">Amendingen</span>
        </div>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wide">
        <Link href="/" className="hover:text-sva-green transition-colors">
          Home
        </Link>
        <Link href="/login" className="hover:text-sva-green transition-colors">
          Login
        </Link>
        <Link
          href="https://www.sv-amendingen-fussball.de/"
          target="_blank"
          className="bg-sva-green hover:bg-green-700 text-white px-4 py-2 rounded-sm transition-colors border border-sva-green hover:border-green-700"
        >
          SVA News
        </Link>
      </nav>
    </header>
  );
}
