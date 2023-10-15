import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployRPSFactory: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, getChainId } = hre;
    const { deploy } = deployments;

    // fallback to hardhat node signers on local network
    const deployer = (await getNamedAccounts()).deployer ?? (await hre.ethers.getSigners())[0].address;
    const chainId = Number(await getChainId());
    console.log("Deploying to %s with deployer %s", chainId, deployer);

    await deploy("RPSFactory", {
        from: deployer,
        args: [],
        log: true,
    });
};

deployRPSFactory.tags = ["RPSFactory"];

export default deployRPSFactory;