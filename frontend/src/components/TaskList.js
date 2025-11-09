import { useState, useEffect } from "react";
import api from "../api/api";

function WorkflowWithTasks() {
  const [workflows, setWorkflows] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch workflows
    api.get("workflows/")
      .then((res) => setWorkflows(res.data))
      .catch((err) => console.log("Error fetching workflows:", err));

    // Fetch tasks
    api.get("tasks/")
      .then((res) => setTasks(res.data))
      .catch((err) => console.log("Error fetching tasks:", err));
  }, []);

  return (
    <div>
      {workflows.map((wf) => (
        <div key={wf.id}>
          <h2>{wf.name}</h2>
          <ul>
            {tasks
              .filter((tl) => tl.Workflow === wf.id) // match tasks to workflow
              .map((tl) => (
                <li key={tl.id}>
                  {tl.title} - {tl.status}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default WorkflowWithTasks;
