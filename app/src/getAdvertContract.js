import { ethers } from 'ethers';
import AdvertContract from './artifacts/contracts/Advert.sol/Advertoken.json';

const AdvertContractAddress = "0x27481fE1C63Cb6edaD59D0Cd65E95cA5676dc9eb";

export default async function getAdvertContract(signer) {
    return new ethers.Contract(AdvertContractAddress, AdvertContract.abi, signer);
}



