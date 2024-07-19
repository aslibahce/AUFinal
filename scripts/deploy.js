const hre = require('hardhat');
require('dotenv').config();

// replace the name of the contract with which one you want to deploy!
const contractName = "Advertoken";

async function main() {

  const url = process.env.TESTNET_API_URL;

  let artifacts = await hre.artifacts.readArtifact(contractName);

  const provider = new ethers.providers.JsonRpcProvider(url);

  let privateKey = process.env.TEST_PRIVATE_KEY;

  let wallet = new ethers.Wallet(privateKey, provider);

  // Create an instance of a Faucet Factory
  let factory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);

  let advertoken = await factory.deploy((2 * (10**18)).toString(), 50);

  console.log("Advertoken address:", advertoken.address);

  await advertoken.deployed();



}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });