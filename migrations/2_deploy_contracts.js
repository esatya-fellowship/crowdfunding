/* eslint-disable no-undef */
const Crowdfunding = artifacts.require('Crowdfunding');

module.exports = function (deployer) {
    deployer.deploy(Crowdfunding);
};
