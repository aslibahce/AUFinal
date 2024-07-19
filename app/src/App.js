import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import getAdvertContract from './getAdvertContract';
import Advert from './Advert';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function addAddvert(signer, amount, text) {
  const advertContract = await getAdvertContract(signer);
  const txApprovement = await advertContract.approve(advertContract.address, amount);
  await txApprovement.wait();
  const addAdvertTnx = await advertContract.add(amount, text);
  await addAdvertTnx.wait();
}

export async function getAdverts(signer) {
  debugger
  const advertContract = await getAdvertContract(signer);
  const adverts = await advertContract.getAll();
  debugger
  return adverts.map(advert => ({
    id: advert.toString()
  }))
}

export async function getContractBalance(signer) {
    const advertContract = await getAdvertContract(signer);
    const balance = await advertContract.balanceOf(advertContract.address);
    return balance.toString() / (10**18);
}

export async function showAdvert(signer, id) {
  const advertContract = await getAdvertContract(signer);
  try {
    const txShowAd = await advertContract.showAd(id);
    await txShowAd.wait();
    const result = await advertContract.getAdText(id);
    debugger;
    return result;
  }
  catch(err) {
    alert(err);
  }
}

function App() {
  const [adverts, setAdverts] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [balance, setContractBalance] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      const providerSigner = provider.getSigner();
      setSigner(providerSigner);
      const adverts = await getAdverts(providerSigner);
      setAdverts(adverts);
      const balance = await getContractBalance(providerSigner);
      setContractBalance(balance);
    }
    getAccounts();
  }, [account]);

  async function alertFunction(id) {
    const accounts = await provider.send('eth_requestAccounts', []);
    setAccount(accounts[0]);
    const providerSigner = provider.getSigner();
    setSigner(providerSigner);
    const adText = await showAdvert(providerSigner, id);
    alert(adText);
  }

  async function newAdvert() {
    debugger
    const adText = document.getElementById('adText').value;
    const value = (document.getElementById('at').value * (10**18)).toString();
    
    await addAddvert(signer, value, adText);
  
    const adverts = await getAdverts(signer);
    setAdverts(adverts);
    const balance = await getContractBalance(signer);
    setContractBalance(balance);
 
  }

  return (
    <>
    <div className="contract"> <h1> Contract Balance: {balance} (AT) </h1></div> <br/>
      <div className="contract">
        <h1> New Advert </h1>
        <label>
          Advert Text
          <input type="text" id="adText" />
        </label>

        <label>
          Advert Limit (AT)
          <input type="text" id="at" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newAdvert();
          }}
        >
          Publish Advert
        </div>
      </div>

     

      <div className="existing-contracts">
        <h1> Advert List </h1>

        <div id="container">
          { 
          adverts.map((advert) => {
            return <Advert key={advert.id.toString()} {...advert} alertFunction={alertFunction}  />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
