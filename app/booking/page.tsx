import Link from "next/link";
import BookingForm from "@/components/BookingForm";
import "../public-forms.css";

export default function BookingPage() {
  return <main className="public-form-page"><Link href="/" className="form-brand">MIXBEE<span>.</span></Link><div className="public-form-intro"><span>MAKE TIME FOR YOUR SOUND</span><h1>Book a<br/><em>session.</em></h1><p>Tell us what you need and when you'd like to come in. We'll get back to confirm availability.</p></div><BookingForm/><Link href="/" className="form-back">← Back to the studio</Link></main>;
}
