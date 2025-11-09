import api from "../api/api";
import {useState,useEffect} from "react";
function WorkflowList()
{
const[workflows,setworkflows]=useState([]);
useEffect(()=>
{
    api.get("workflows/")
    .then((response)=>setworkflows(response.data))
    .catch((error)=>console.error("Error fetching workflows:",error));
},[]);
return(
    <div>
        <h2>workflow list</h2>
        {workflows.map((wf)=>
        <h1>{wf.name}</h1>)}
    </div>
);
}
export default WorkflowList;