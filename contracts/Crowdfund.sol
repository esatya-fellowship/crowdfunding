// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
contract Crowdfund{    
    enum states{
        start,
        funding,
        end
    }
    struct project {
        string title;
        string details;
        uint256 id;
        uint256 goalamount;
        uint256 fundraised;
        uint256 duedate;
        address  payable creator;
        states state;
        bool isexist;
    }
    
    mapping(uint => project)  public projects;
    uint counter;
    
    event Projectcreated( address projectcreator ,string title, string details,uint256 goal, uint deadline);
    event Projectfunded( address fundingaddress, uint256 fundingamount);
   
    constructor(){
        counter = 0; 
    }
    
    //add project to blockchain
    function addproject( string memory _title, string memory _details,  uint256 _goalamount, uint256 _duedate 
    ) public {
        require(bytes(_title).length>0,"Invaid Title");
        require(_goalamount>0,"Invaid amount");
        require(_duedate>block.timestamp,"Invalid due date");
        counter ++;
        projects[counter] = project(_title, _details ,counter, _goalamount ,0,_duedate, payable(msg.sender),states.start,true);
        emit Projectcreated( msg.sender,_title,_details,_goalamount,_duedate);
        
    }
    
    //fund the project 
    function fundproject(uint256 id ) public payable{

        require(id <= counter,"Invalid id");
        require(projects[id].state != states.end,"Funding isnot available right now");
        require(msg.sender != projects[id].creator,"Project creator cannot fund the project");
        projects[id].fundraised += msg.value;
        projects[id].state = states.funding;
        checkprojecttime(id);

        emit Projectfunded( msg.sender,  msg.value);
    }
    
    //get the list of total project present the blockchain 
    function getprojectdetails(uint256 _id) public view returns(string memory title , string memory details, uint256 id, 
    
        uint256 goalamount,
        uint256 fundraised,
        uint256 duedate,
        address creator, 
        states state,
        bool isexist
        ){
        require(_id <= counter,"Invalid id");
        title = projects[_id].title;
        details = projects[_id].details;
        id = projects[_id].id;
        goalamount = projects[_id].goalamount;
        fundraised = projects[_id].fundraised;
        duedate = projects[_id].duedate;
        creator = projects[_id].creator;
        state = projects[_id].state;
        isexist = projects[_id].isexist;
        return( title, details, id, goalamount,fundraised,duedate,creator,state,isexist);
    } 
    //decide whether to close funding or not
    function checkprojecttime(uint _id) public {
        if(block.timestamp >= projects[_id].duedate || projects[_id].fundraised >= projects[_id].goalamount){
            projects[_id].state = states.end;
            projects[_id].isexist = false;
            transferbalance(_id);
        }
    }
    //get Details of the project 
    function getprojectlist() public view returns(uint){
        return(counter);

    }
    function balancecheck() public view returns(uint){
        return address(this).balance;
    }
    function transferbalance(uint _id) internal   {
        projects[_id].creator.transfer(projects[_id].fundraised);
        
    }
    function checkbalance(address addr) public view returns(uint){
        return addr.balance;
    }
    
}