/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));

/// Openzeppelin test-helper
const { time } = require('@openzeppelin/test-helpers');

/// Artifact of smart contracts 
const PayrollMining = artifacts.require("PayrollMining");
const MemberRegistry = artifacts.require("MemberRegistry");
const WorkRewardToken = artifacts.require("WorkRewardToken");


/***
 * @dev - Execution COMMAND: $ truffle test ./test/test-local/Referral.test.js
 **/
contract("PayrollMining", function(accounts) {
    /// Acccounts
    let deployer = accounts[0];
    let user1 = accounts[1];
    let user2 = accounts[2];
    let user3 = accounts[3];

    /// Global Tokenization contract instance
    let payrollMining;
    let memberRegistry;
    let workRewardToken;

    /// Global variable for each contract addresses
    let PAYROLL_MINING;
    let MEMBER_REGISTRY;
    let WORK_REWARD_TOKEN;

    describe("Check state in advance", () => {
        it("Check all accounts", async () => {
            console.log('\n=== accounts ===\n', accounts, '\n========================\n');
        }); 
    }); 

    describe("Setup smart-contracts", () => {
        it("Deploy the MemberRegistry contract instance", async () => {
            memberRegistry = await MemberRegistry.new({ from: deployer });
            MEMBER_REGISTRY = memberRegistry.address;
        });

        it("Deploy the WorkRewardToken contract instance", async () => {
            workRewardToken = await WorkRewardToken.new({ from: deployer });
            WORK_REWARD_TOKEN = workRewardToken.address;
        });

        it("Deploy the PayrollMining contract instance", async () => {
            payrollMining = await PayrollMining.new(MEMBER_REGISTRY, WORK_REWARD_TOKEN, { from: deployer });
            PAYROLL_MINING = payrollMining.address;
        });
    });

    describe("Preparation for testing", () => {
        it("1000 $WORK should be transferred into user1 wallet address", async () => {
            const amount = web3.utils.toWei('1000', 'ether');
            let txReceipt = await workRewardToken.transfer(user1, amount);
        });

        it("3 users (wallet addresses) register as a member", async () => {
            let txReceipt1 = await memberRegistry.registerMember(user1, 0);  /// [Note]: MemberType is "Employee"
            let txReceipt2 = await memberRegistry.registerMember(user2, 1);  /// [Note]: MemberType is "Coalition"
            let txReceipt3 = await memberRegistry.registerMember(user3, 2);  /// [Note]: MemberType is "Staker"
        });
    });

    describe("Payroll Mining", () => {
        it("Update 'Payroll Mining Block' when specified-condition is fulfilled.", async () => {
            /// [Todo]:
            let txReceipt = await payrollMining.updateBlock({ from: deployer });
        });     
    });

});
