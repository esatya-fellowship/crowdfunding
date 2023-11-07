var Crowdfund = artifacts.require("./Crowdfund.sol");

module.exports = function(deployer) {
  deployer.deploy(Crowdfund);
};
