import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  console.log("Starting deployment...");

  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();

  await nftMarketplace.waitForDeployment();

  const address = await nftMarketplace.getAddress();
  console.log(`NFTMarketplace deployed to ${address}`);

  const frontendConfigPath = path.join(process.cwd(), "frontend", ".env.local");
  fs.writeFileSync(
    frontendConfigPath,
    `VITE_MARKETPLACE_ADDRESS=${address}\nVITE_PINATA_API_KEY=\nVITE_PINATA_SECRET_KEY=\n`
  );
  
  console.log(`Frontend environment variables updated at ${frontendConfigPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
