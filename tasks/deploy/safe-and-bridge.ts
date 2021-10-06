import { task, types } from "hardhat/config";

task("Contracts", "Deploys ERC20Safe and the Bridge contract")
  .addParam(
    "relayerAddresses",
    "JSON Array containing all relayer addresses to be added when the Bridge contract is deployed",
  )
  .addOptionalParam("quorum", "Quorum for proposals to be able to execute", 3, types.int)
  .setAction(async (taskArgs, hre) => {
    const relayerAddresses: string[] = JSON.parse(taskArgs.relayerAddresses);
    const quorum = taskArgs.quorum;
    console.log("Relayers used for deploy", relayerAddresses);
    const [adminWallet] = await hre.ethers.getSigners();
    console.log("Admin Public Address:", adminWallet.address);

    const ERC20Safe = await hre.ethers.getContractFactory("ERC20Safe");
    const safeContract = await ERC20Safe.deploy();
    await safeContract.deployed();
    console.log("ERC20Safe deployed to:", safeContract.address);

    const Bridge = await hre.ethers.getContractFactory("Bridge");
    const bridgeContract = await Bridge.deploy(relayerAddresses, quorum, safeContract.address);
    await bridgeContract.deployed();
    console.log("Bridge deployed to:", bridgeContract.address);
    await safeContract.setBridge(bridgeContract.address);

    const fs = require("fs");
    const filename = "setup.config.json";
    const data = {
      erc20Safe: safeContract.address,
      bridge: bridgeContract.address,
      relayers: relayerAddresses,
    };
    fs.writeFileSync(filename, JSON.stringify(data));
  });
