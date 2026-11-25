import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import "../public-forms.css";

export default function ContactPage() {
  return <main className="public-form-page"><Link href="/" className="form-brand">MIXBEE<span>.</span></Link><div className="public-form-intro"><span>LET'S TALK SOUND</span><h1>Get in<br/><em>touch.</em></h1><p>Questions about recording, production or working with the studio? Send us a message.</p></div><ContactForm/><Link href="/" className="form-back">← Back to the studio</Link></main>;
}
