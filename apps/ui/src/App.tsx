import { useState } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Provisions } from "./pages/Provisions";
import { LeadDetail } from "./pages/LeadDetail";

export function App() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "provisions" | "lead">("dashboard");
  const [selectedLeadId, setSelectedLeadId] = useState<string>("test-lead-1");

  const handleNavigate = (page: "dashboard" | "provisions" | "lead", leadId?: string) => {
    setCurrentPage(page);
    if (leadId) {
      setSelectedLeadId(leadId);
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {currentPage === "dashboard" ? (
        <Dashboard />
      ) : currentPage === "provisions" ? (
        <Provisions />
      ) : (
        <LeadDetail leadId={selectedLeadId} />
      )}
    </Layout>
  );
}

