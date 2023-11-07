import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";

function Addproject(props) {
  const [loading, setLoading] = useState(false);
  const nameRef = React.useRef();
  const detailsRef = React.useRef();
  const goalRef = React.useRef();
  const dateRef = React.useRef();
  const handleAdd = () => {
    setLoading(true);
    console.log(loading);
  };
  const handleSubmit = () => {
    setLoading(false);
  };
  const renderButton = () => {
    return (
      <div className='renderbutton'>
        <p>
          <button onClick={handleAdd} color='primary' type='submit'>
            {" "}
            Addproject
          </button>
        </p>
      </div>
    );
  };
  const Addproject = () => {
    if (loading) {
      return (
        <div className='project'>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const name = nameRef.current.value;
              const details = detailsRef.current.value;
              const goal = goalRef.current.value;
              let date = dateRef.current.value;
              date = parseInt((new Date(date).getTime() / 1000).toFixed(0));
              props.addproject(name, details, goal, date);
            }}>
            <label> Name:</label>
            <input
              name='details'
              type='text'
              placeholder='Enter the name of your Project'
              ref={nameRef}
            />
            <br />
            <label> Details:</label>
            <input
              type='text'
              placeholder='Few Details of your Project'
              ref={detailsRef}
            />
            <br />
            <label> Amount to be raised:</label>
            <input type='Number' placeholder='In ether' ref={goalRef} />
            <br />
            <label> Due Date: </label>
            <input type='Date' placeholder='Date' ref={dateRef} />
            <br />
            <button type='submit' color='primary'>
              {" "}
              Submit
            </button>
          </form>
        </div>
      );
    }
  };
  return (
    <div className='Main'>
      {renderButton()}
      {Addproject()}
    </div>
  );
}
export default Addproject;
