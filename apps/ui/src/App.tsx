import { useState } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Provisions } from "./pages/Provisions";

export function App() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "provisions">("dashboard");

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === "dashboard" ? <Dashboard /> : <Provisions />}
    </Layout>
  );
}

