import { feedbackConfig } from "@/data/learning";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import FeedbackForm from "@/features/feedback/components/FeedbackForm";

export default function FeedbackPage() {
  useDocumentTitle("Zgłoś pomysł lub poprawkę | Kihon");
  return (
    <div className="section learning-page">
      <header className="learning-heading">
        <p className="learning-eyebrow">Twój pomysł / wspólny rozwój</p>
        <h1>Co możemy<br /><em>zrobić lepiej?</em></h1>
        <p>Zaproponuj poradnik, zgłoś poprawkę lub opisz brakującą funkcję. Każda konkretna wskazówka pomaga rozwijać KIHON.</p>
      </header>
      <div className="feedback-layout">
        <aside className="feedback-info">
          <h2>Napisz do nas</h2>
          <a href={`mailto:${feedbackConfig.email}`}>{feedbackConfig.email}</a>
          <p>Formularz przygotuje wiadomość w Twojej aplikacji pocztowej. Sprawdź ją i naciśnij „Wyślij” w poczcie.</p>
          <p>Korzystasz z poczty w przeglądarce? Skopiuj wiadomość i wklej ją do nowego e-maila.</p>
        </aside>
        <FeedbackForm />
      </div>
    </div>
  );
}
