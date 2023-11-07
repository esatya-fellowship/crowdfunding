import React, { useState, useEffect } from "react";
import "./App.css";
import Project from "./Project";
import Addproject from "./Addproject";
import getWeb3 from "./getWeb3";
import CrowdfundContract from "./contracts/Crowdfund.json";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [crowdfund, setCrowdfund] = useState({});
  const [projects, setProjects] = useState([]);
  const [web3, setWeb3] = useState();

  const getweb3data = async () => {
    const web3 = await getWeb3();
    //get the address from metamask
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    //get the network id
    const networkid = await web3.eth.net.getId();
    console.log(networkid);
    const networkdeployed = CrowdfundContract.networks[networkid];
    console.log(networkdeployed.address);
    // get the contract instance
    const instance = await new web3.eth.Contract(
      CrowdfundContract.abi,
      networkdeployed.address
    );
    console.log(instance);
    setCurrentAccount(accounts[0]);
    setCrowdfund({ ...instance });
    setWeb3(web3);

    // getProjectdetails();
    const result = await instance.methods.getprojectlist().call();
    console.log(result);
    const projectlist = [];
    for (let i = 1; i <= result; i++) {
      const project = await instance.methods.getprojectdetails(i).call();
      projectlist.push(project);
    }
    setProjects(projectlist);

    console.log(crowdfund);
  };

  const addproject = async (title, details, goal, duedate) => {
    try {
      console.log(duedate);
      const result = await crowdfund.methods
        .addproject(title, details, goal, duedate)
        .send({ from: currentAccount });
      console.log(result);
      // await getweb3data();
      getProjectdetails();
    } catch (error) {
      alert("console");
      console.log(error);
    }
  };

  const getProjectdetails = async () => {
    console.log(crowdfund);
    const result = await crowdfund.methods.getprojectlist().call();
    console.log(result);
    const projectlist = [];
    for (let i = 1; i <= result; i++) {
      const project = await crowdfund.methods.getprojectdetails(i).call();
      projectlist.push(project);
    }
    setProjects(projectlist);
  };
  const handlefund = async (id, value) => {
    try {
      value = web3.utils.toWei(value, "ether");
      await crowdfund.methods
        .fundproject(id)
        .send({ from: currentAccount, value: value });
      await getweb3data();
    } catch (error) {
      console.log(error);
    }
  };
  const balancecheck = async () => {
    // event.preventDefault();
    const res = await crowdfund.methods.balancecheck().call();
    console.log(res);
  };
  useEffect(() => {
    getweb3data();
  }, []);

  return (
    <div className='main'>
      <h1> CrowdFunding</h1>
      <div className='details'>
        <p>Lets utilize Ether and blockchain to fund the needy Project.</p>
      </div>
      <Addproject addproject={addproject} />
      <br />
      <Project
        handlefund={handlefund}
        balancecheck={balancecheck}
        projects={projects}
        web3={web3}
      />
    </div>
  );
}
export default App;
//contract updated
