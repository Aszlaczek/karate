import { useState, type FormEvent } from "react";
import { feedbackConfig } from "@/data/learning";

export default function FeedbackForm() {
  const [topic, setTopic] = useState(feedbackConfig.topics[0]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const subject = `KIHON — ${topic}`;
  const body = `Temat: ${topic}\n\n${message.trim()}`;
  const emailText = `Do: ${feedbackConfig.email}\nTemat: ${subject}\n\n${body}`;
  const mailto = `mailto:${feedbackConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const validate = () => {
    if (message.trim().length < 10) {
      setError("Opisz propozycję w co najmniej 10 znakach (bez samych spacji).");
      setStatus("");
      return false;
    }
    setError("");
    return true;
  };

  const openEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    window.location.href = mailto;
    setStatus("Wiadomość jest gotowa do otwarcia w poczcie. Wyślij ją w swoim programie pocztowym. Jeśli nic się nie otworzyło, skopiuj treść poniżej.");
  };

  const copyEmail = async () => {
    if (!validate()) return;
    try {
      await navigator.clipboard.writeText(emailText);
      setStatus("Skopiowano adres, temat i treść. Wklej je do nowej wiadomości w swojej poczcie.");
    } catch {
      setStatus("Nie udało się skopiować automatycznie. Rozwiń podgląd poniżej, zaznacz tekst i skopiuj go ręcznie.");
    }
  };

  return (
    <form className="feedback-form" onSubmit={openEmail}>
      <label htmlFor="feedback-topic">Czego dotyczy wiadomość?</label>
      <select id="feedback-topic" value={topic} onChange={(event) => { setTopic(event.target.value); setStatus(""); }}>
        {feedbackConfig.topics.map((item) => <option key={item}>{item}</option>)}
      </select>
      <label htmlFor="feedback-message">Twoja propozycja</label>
      <p id="feedback-help" className="feedback-help">Napisz, co warto dodać lub zmienić. Przy poprawce podaj nazwę techniki albo adres podstrony.</p>
      <textarea id="feedback-message" name="message" rows={7} required minLength={10} maxLength={1200}
        aria-describedby={`feedback-help feedback-count${error ? " feedback-error" : ""}`} aria-invalid={error ? true : undefined}
        value={message} onChange={(event) => { setMessage(event.target.value); setError(""); setStatus(""); }} />
      <p className="feedback-count" id="feedback-count">{message.length} / 1200 znaków</p>
      {error && <p className="feedback-error" id="feedback-error" role="alert">{error}</p>}
      <div className="feedback-actions">
        <button className="primary-button" type="submit">Otwórz wiadomość w poczcie ↗</button>
        <button className="feedback-copy" type="button" onClick={copyEmail}>Kopiuj wiadomość</button>
      </div>
      <p className="feedback-status" role="status">{status}</p>
      <details className="feedback-preview">
        <summary>Podgląd do ręcznego skopiowania</summary>
        <label htmlFor="feedback-preview">Adres, temat i treść wiadomości</label>
        <textarea id="feedback-preview" readOnly rows={9} value={emailText} />
      </details>
    </form>
  );
}
