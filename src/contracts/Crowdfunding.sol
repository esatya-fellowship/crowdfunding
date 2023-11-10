// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

/* 
TODO
    - Create a Project : createProject
    - Fetch all Projects : projects
    - Read a Project : getProjectById
    - Fund an existing Project : fundProject
    - Close the Project manually by owner or if endDate expires : closeProject
    - Get total Contract Balance : balanceOfProjects
    - Dispatch the ethers to project Owner : dispatchFunds
*/
contract Crowdfunding {
  string public name;
  uint256 public projectCount = 0;
  mapping(uint256 => Project) public projects;
  mapping(uint256 => mapping(address => uint256)) contributors;

  struct Project {
    uint256 id;
    string name;
    string desc;
    address owner;
    uint256 endDate;
    bool exists;
    uint256 balance;
    uint256 target;
  }

  event ProjectCreated(
    uint256 id,
    string name,
    string desc,
    address owner,
    uint256 endDate,
    bool exists,
    uint256 balance,
    uint256 target
  );

  event ProjectFunded(
    uint256 id,
    string name,
    string desc,
    address owner,
    uint256 endDate,
    bool exists,
    uint256 balance,
    uint256 target
  );

  event ProjectEnded(uint256 id, string name, uint256 balance);

  constructor() {
    name = 'Marketplace for crowd funding';
  }

  function createProject(
    string memory _name,
    string memory _desc,
    uint256 _endDate,
    uint256 _target
  ) public {
    // Make sure parameters are correct and supplied
    // Require a valid name
    require(bytes(_name).length > 0);
    // Require a valid target
    require(_target > 0);
    // Require a valid endDate
    require(_endDate > 0);
    //Increment Project Count
    projectCount++;
    // Create the project
    projects[projectCount] = Project(
      projectCount,
      _name,
      _desc,
      msg.sender,
      _endDate,
      true,
      0,
      _target
    );
    // trigger an event
    emit ProjectCreated(projectCount, _name, _desc, msg.sender, _endDate, true, 0, _target);
  }

  function getProjectById(uint256 _id)
    public
    view
    returns (
      string memory _name,
      string memory _desc,
      uint256 _target,
      uint256 _endDate,
      address _owner,
      uint256 _balance
    )
  {
    //TODO Check if project Exists
    return (
      projects[_id].name,
      projects[_id].desc,
      projects[_id].target,
      projects[_id].endDate,
      projects[_id].owner,
      projects[_id].balance
    );
  }

  function fundProject(uint256 _id) public payable {
    // Fetch the Project
    Project memory _project = projects[_id];
    //Fetch the Project Owner
    address _owner = _project.owner;
    // Make sure the project has valid ID
    require(_project.id > 0 && _project.id <= projectCount);
    // Check if the Project end Date is greater than now
    require(block.timestamp < _project.endDate, 'Project is closed.');
    // Check if the owner is trying to fund and reject it
    require(_owner != msg.sender, "Owner can't fund the project created by themselves.");
    // Make Sure the Project is active
    require(_project.exists, 'Project Campaign has ended.');
    //Sent ether must be greater than 0
    require(msg.value > 0);
    // Fund it
    _project.balance += msg.value;
    // Update the Project
    projects[_id] = _project;
    // contributors can again send the money
    contributors[_id][msg.sender] += msg.value;
    // Trigger the event
    emit ProjectFunded(
      projectCount,
      _project.name,
      _project.desc,
      msg.sender,
      _project.endDate,
      true,
      _project.balance,
      _project.target
    );
  }

  function closeProject(uint256 _id) public {
    // Fetch the Project
    Project memory _project = projects[_id];
    //Fetch the Project Owner
    address _owner = _project.owner;
    // Check if the owner is trying to close the project
    require(_owner == msg.sender, 'Only Owner can close the project.');
    // Check if the project is open or not
    require(_project.exists == true, 'Project is in open state.');
    // Check endDate
    if (block.timestamp > _project.endDate) {
      _project.exists = false;
      this.dispatchFunds(_project.id);
      projects[_id] = _project;
      emit ProjectEnded(_project.id, _project.name, _project.balance);
    }
    require(block.timestamp <= _project.endDate, 'Project is still active.');
    // Close the project
    _project.exists = false;
    // transfer the fund
    this.dispatchFunds(_project.id);
    projects[_id] = _project;
    // Trigger the Event
    emit ProjectEnded(_project.id, _project.name, _project.balance);
  }

  function balanceOfProjects() public view returns (uint256) {
    return address(this).balance;
  }

  function dispatchFunds(uint256 _id) public payable {
    Project memory _project = projects[_id];
    payable(_project.owner).transfer(_project.balance);
    projects[_id] = _project;
  }
}
