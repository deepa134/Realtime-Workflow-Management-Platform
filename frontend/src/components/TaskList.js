import { useState, useEffect } from "react";
import api from "../api/api";
import "../styles.css";

function WorkflowWithTasks() {
  const [workflows, setWorkflows] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get("workflows/")
      .then((res) => setWorkflows(res.data))
      .catch((err) => console.log("Error fetching workflows:", err));

    api.get("tasks/")
      .then((res) => setTasks(res.data))
      .catch((err) => console.log("Error fetching tasks:", err));
  }, []);

  return (
    <div className="dashboard-container">
      {workflows.map((wf) => (
        <div key={wf.id} className="workflow-card">
          <h2>{wf.name}</h2>
          <div className="task-grid">
            {tasks
              .filter((tl) => tl.Workflow === wf.id)
              .map((tl) => (
                <div key={tl.id} className="task-card">
                  <b>{tl.title}</b>
                  <p>Status: <span className={`badge ${tl.status}`}>{tl.status}</span></p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default WorkflowWithTasks;
