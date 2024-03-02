import { Contract, ContractRunner } from "ethers";
import abi from "./abi.json";

export function getContract(signer: ContractRunner) {
    return new Contract(
        "0x81cb69089160cBA0F366d992Ec230efC7AFCc8b4",
        abi as any,
        signer
    );
}