import { BrowserRouter } from "react-router";
import ModalHost from "@/app/ModalHost";
import AppRoutes from "@/app/router";
import Footer from "@/features/navigation/components/Footer";
import Header from "@/features/navigation/components/Header";

const App = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <div className="app-shell">
      <Header />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </div>
    <ModalHost />
  </BrowserRouter>
);

export default App;
