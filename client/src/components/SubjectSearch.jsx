import { useState, useEffect } from "react";
import { searchSubjects } from "../services/api";

export default function SubjectSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch subjects whenever the search term changes (or empty on initial mount)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      searchSubjects(searchTerm)
        .then(setSubjects)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 300); // 300ms debounce to avoid spamming the backend while typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div>
      <h2>Subject Prerequisites</h2>
      
      {/* Search Input Filter */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Filter by subject code or name (e.g. CS101, Math)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px 12px", width: "100%", maxWidth: "400px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      {loading ? (
        <p>Loading subjects...</p>
      ) : subjects.length === 0 ? (
        <p>No subjects found matching "{searchTerm}".</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {subjects.map((subject) => (
            <div 
              key={subject.code} 
              style={{ border: "1px solid #e0e0e0", padding: "15px", borderRadius: "6px", backgroundColor: "#f9f9f9" }}
            >
              <h3 style={{ margin: "0 0 8px 0" }}>{subject.name} ({subject.code})</h3>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#555" }}>
                <strong>Credits:</strong> {subject.credits}
              </p>
              <div>
                <strong>Prerequisites:</strong>
                {subject.prerequisites.length > 0 ? (
                  <ul style={{ margin: "5px 0 0 0", paddingLeft: "20px" }}>
                    {subject.prerequisites.map((prereq, idx) => (
                      <li key={idx}>{prereq}</li>
                    ))}
                  </ul>
                ) : (
                  <span style={{ marginLeft: "8px", color: "#888", italic: "true" }}>None</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}