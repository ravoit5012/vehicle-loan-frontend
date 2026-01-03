import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#222" }}>
      <Link href="/" style={{ marginRight: 20 }}>Home</Link>
      <Link href="/loans" style={{ marginRight: 20 }}>Loans</Link>
      <Link href="/agents" style={{ marginRight: 20 }}>Agents</Link>
      <Link href="/login">Login</Link>
    </nav>
  );
}
