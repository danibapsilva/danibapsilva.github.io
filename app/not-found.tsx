import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-24">
      <p className="label">404</p>
      <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.02em]">Nothing here.</h1>
      <Link href="/" className="mt-6 inline-block text-accent underline">
        Back to the start
      </Link>
    </section>
  );
}
