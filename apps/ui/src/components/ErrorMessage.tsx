interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div style={{
      padding: "1rem",
      background: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
      borderRadius: "4px",
      marginBottom: "1rem"
    }}>
      <strong>Fehler:</strong> {message}
    </div>
  );
}

