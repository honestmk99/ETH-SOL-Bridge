import { task } from "hardhat/config";

task(
  "add-to-whitelist",
  "Whitelists a new address in the bridge. Requires setup.config.json to be present (created with the deploy script)",
)
  .addParam("address", "Address of the ERC20 token to be whitelisted")
  .setAction(async (taskArgs, hre) => {
    const tokenAddress = taskArgs.address;
    const [adminWallet] = await hre.ethers.getSigners();
    const fs = require("fs");
    const config = JSON.parse(fs.readFileSync("setup.config.json", "utf8"));
    const safeAddress = config["erc20Safe"];
    const safeContractFactory = await hre.ethers.getContractFactory("ERC20Safe");
    const safe = safeContractFactory.attach(safeAddress).connect(adminWallet);
    await safe.whitelistToken(tokenAddress, 0);
    console.log("Token whitelisted: ", tokenAddress);
  });
