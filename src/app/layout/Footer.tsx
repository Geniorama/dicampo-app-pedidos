import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 text-sm text-center p-2">
        Powered By <Link className="underline" href={'https://geniorama.co/'} target="_blank">Geniorama</Link>
    </footer>
  )
}
