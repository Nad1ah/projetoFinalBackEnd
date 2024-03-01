import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PollsList() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    axios.get("/polls").then((response) => {
      setPolls(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Polls</h1>
      <ul>
        {polls.map((poll) => (
          <li key={poll._id}>
            <Link to={`/polls/${poll._id}`}>{poll.question}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PollsList;
