import React, { useState } from "react";
import { Button } from "react-bootstrap";

function ProjectList(props) {
  const valueRef = React.useRef();
  const [isloggedIn, setIsLoggedIn] = useState(false);

  if (isloggedIn) {
    return (
      <div>
        <h5> Will Dispaly the project here </h5>
        Loading...
      </div>
    );
  } else {
    return (
      <div className='container'>
        <div>
          <h2>Project list</h2>
          <ul>
            {props.projects.map((project, key) => (
              <div className='list' key={key}>
                <li>
                  <h2> Title:{project.title}</h2>
                  <h5> Proposed by:{project.creator}</h5>
                  <p> Name:{project.title}</p>
                  <p>Details:{project.details}</p>
                  <p>
                    {" "}
                    Fundraised:
                    {props.web3.utils.fromWei(project.fundraised, "ether")}{" "}
                    ethers
                  </p>
                  <p>
                    Due date:
                    {Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }).format(project.duedate * 1000)}
                  </p>
                  <form>
                    <input type='Number' placeholder='ether' ref={valueRef} />
                    <Button
                      name={project.id}
                      onClick={(e) => {
                        e.preventDefault();
                        const value = valueRef.current.value;
                        props.handlefund(e.target.name, value);
                      }}
                      disabled={!project.isexist}>
                      Fund
                    </Button>
                  </form>
                  <hr />
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
export default ProjectList;
