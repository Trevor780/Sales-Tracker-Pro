export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            color: "#dc2626",
            marginBottom: "1rem",
          }}
        >
          SalesTrack+ Test
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>If you can see this, Next.js routing is working!</p>
        <div
          style={{
            backgroundColor: "#dcfce7",
            border: "1px solid #16a34a",
            color: "#15803d",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          ✅ Basic Next.js app is functional
        </div>
      </div>
    </div>
  )
}
