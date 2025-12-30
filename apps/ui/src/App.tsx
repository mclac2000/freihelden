import { useState } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Provisions } from "./pages/Provisions";
import { LeadDetail } from "./pages/LeadDetail";

export function App() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "provisions" | "lead">("dashboard");

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === "dashboard" ? (
        <Dashboard />
      ) : currentPage === "provisions" ? (
        <Provisions />
      ) : (
        <LeadDetail />
      )}
    </Layout>
  );
}

