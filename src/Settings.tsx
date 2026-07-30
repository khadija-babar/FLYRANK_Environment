import { useState } from "react";

function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4");
  const [stores, setStores] = useState("");

  const handleSave = () => {
    alert("Settings saved!");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Settings</h1>
      <div style={{ marginBottom: "15px" }}>
        <label>API Key</label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>Model</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        >
          <option>gpt-4</option>
          <option>gpt-3.5</option>
          <option>claude-3</option>
        </select>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>Store URLs (comma separated)</label>
        <textarea
          value={stores}
          onChange={(e) => setStores(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <button onClick={handleSave} style={{ padding: "10px 20px" }}>
        Save
      </button>
    </div>
  );
}

export default Settings;
