import api from "../api/api";
import { useState, useEffect } from "react";
import "../styles.css";

function WorkflowList() {
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    api.get("workflows/")
      .then((response) => setWorkflows(response.data))
      .catch((error) => console.error("Error fetching workflows:", error));
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Workflow List</h2>
      <div className="workflow-grid">
        {workflows.map((wf) => (
          <div key={wf.id} className="workflow-card">
            <h4>{wf.name}</h4>
            <p>{wf.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkflowList;
