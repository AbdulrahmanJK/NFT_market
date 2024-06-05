import abi from '../abis/src/contracts/Auction.sol/Auction.json';
import address from '../abis/contractAddress.json';
import { getGlobalState, setGlobalState } from '../store';
import { ethers } from 'ethers';
import { checkAuthState, logOutWithCometChat } from './chat';
import axios from 'axios';
import { toast } from 'react-toastify';

const { ethereum } = window;
const ContractAddress = address.address;
const ContractAbi = abi.abi;
let tx;

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);
const connectedAccount = getGlobalState('connectedAccount');
const contract = getGlobalState('contract');

const showErrorToast = (identifier, error) => {
  toast.error(`Error in ${identifier}: ${error.message || error}`);
};

const getEthereumContract = async () => {
  const provider = await new ethers.providers.Web3Provider(ethereum);
  const signer = await provider.getSigner();
  const contract = await new ethers.Contract(ContractAddress, ContractAbi, signer);
  await setGlobalState('contract', contract);
  return contract;
};

const isWallectConnected = async () => {
  try {
    if (!ethereum) {
      alert('Please install Metamask');
      return false;
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    await setGlobalState('connectedAccount', accounts[0]?.toLowerCase());

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase());
      await isWallectConnected();
      await loadCollections();
      await logOutWithCometChat();
      await checkAuthState()
        .then((user) => setGlobalState('currentUser', user))
        .catch((error) => setGlobalState('currentUser', null));
    });

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase());
      return true;
    } else {
      console.log('No accounts found.');
      return false;
    }
  } catch (error) {
    showErrorToast('isWallectConnected', error);
    return false;
  }
};

let isConnecting = false;

const connectWallet = async () => {
  if (await isConnecting) {
    console.log('Запрос на подключение уже выполняется. Пожалуйста, подождите.');
    return;
  }

  try {
    if (!ethereum) throw new Error('Ethereum объект не найден.');

    isConnecting = true;
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    setGlobalState('connectedAccount', accounts[0]);
  } catch (error) {
    toast.error('Plis auth MetaMask');
  } finally {
    isConnecting = false;
  }
};

const createNftItem = async ({ name, description, image, metadataURI, price }) => {
  try {
    if (!ethereum) return alert('Please install Metamask');
    const connectedAccount = getGlobalState('connectedAccount');
    const contract = await getEthereumContract();
    tx = await contract.createAuction(name, description, image, metadataURI, toWei(price), {
      from: connectedAccount,
      value: toWei(0.02),
    });
    await tx.wait();
    await loadAuctions();
  } catch (error) {
    showErrorToast('createNftItem', error);
  }
};

const updatePrice = async ({ tokenId, price }) => {
  try {
    if (!ethereum) return alert('Please install Metamask');
    const connectedAccount = getGlobalState('connectedAccount');
    const contract = await getEthereumContract();
    tx = await contract.changePrice(tokenId, toWei(price), {
      from: connectedAccount,
    });
    await tx.wait();
    await loadAuctions();
  } catch (error) {
    showErrorToast('updatePrice', error);
  }
};

const offerItemOnMarket = async ({ tokenId, biddable, sec, min, hour, day }) => {
  try {
    if (!ethereum) return alert('Please install Metamask');
    const connectedAccount = getGlobalState('connectedAccount');
    const contract = await getEthereumContract();
    tx = await contract.offerAuction(tokenId, biddable, sec, min, hour, day, {
      from: connectedAccount,
    });
    await tx.wait();
    await loadAuctions();
  } catch (error) {
    showErrorToast('offerItemOnMarket', error);
  }
};

const buyNFTItem = async ({ tokenId, price }) => {
  try {
    if (!ethereum) return alert('Please install Metamask');
    const connectedAccount = getGlobalState('connectedAccount');
    const contract = await getEthereumContract();
    tx = await contract.buyAuctionedItem(tokenId, {
      from: connectedAccount,
      value: toWei(price),
    });
    await tx.wait();
    await loadAuctions();
    await loadAuction(tokenId);
  } catch (error) {
    showErrorToast('buyNFTItem', error);
  }
};

const bidOnNFT = async ({ tokenId, price }) => {
  try {
    if (!ethereum) return alert('Please install Metamask');
    const connectedAccount = getGlobalState('connectedAccount');
    const contract = await getEthereumContract();
    tx = await contract.placeBid(tokenId, {
      from: connectedAccount,
      value: toWei(price),
    });

    await tx.wait();
    await getBidders(tokenId);
    await loadAuction(tokenId);
  } catch (error) {
    showErrorToast('bidOnNFT', error);
  }
};

const claimPrize = async ({ tokenId, id }) => {
  try {
    if (!ethereum) return alert('Please install Metamask');
    const connectedAccount = getGlobalState('connectedAccount');
    const contract = await getEthereumContract();
    tx = await contract.claimPrize(tokenId, id, {
      from: connectedAccount,
    });
    await tx.wait();
    await getBidders(tokenId);
  } catch (error) {
    showErrorToast('claimPrize', error);
  }
};

const loadAuctions = async () => {
  try {
    const connectedAccount = getGlobalState('connectedAccount');
    if (!connectedAccount) {
      await connectWallet();
    }

    const contract = await getEthereumContract();
    console.log('Contract:', contract);

    const auctions = await contract.getLiveAuctions();
    console.log('Auctions:', auctions);

    setGlobalState('auctions', structuredAuctions(auctions));
    setGlobalState('auction', structuredAuctions(auctions).sort(() => 0.5 - Math.random())[0]);
  } catch (error) {
    showErrorToast('loadAuctions', error);
    return null;
  }
};

const loadAuction = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask');
    const contract = await getEthereumContract();
    const auction = await contract.getAuction(id);
    setGlobalState('auction', structuredAuctions([auction])[0]);
  } catch (error) {
    showErrorToast('loadAuction', error);
  }
};

const getBidders = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask');
    const contract = await getEthereumContract();
    const bidders = await contract.getBidders(id);
    setGlobalState('bidders', structuredBidders(bidders));
  } catch (error) {
    showErrorToast('getBidders', error);
  }
};

const fetchPinataData = async (tokenURI) => {
  try {
    const response = await fetch(tokenURI);
    if (!response.ok) {
      throw new Error(`Error fetching metadata from ${tokenURI}`);
    }
    const metadata = await response.json();
    return metadata;
  } catch (error) {
    showErrorToast('fetchPinataData', error);
    return {};
  }
};

const loadCollections = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask');
    const contract = await getEthereumContract();
    if (!contract) {
      console.error('Contract object is null');
      return;
    }
    const connectedAccount = await getGlobalState('connectedAccount');
    if (!connectedAccount) {
      console.error('Connected account is null');
      return;
    }
    const collections = await contract.getMyAuctions({ from: connectedAccount });
    const promises = collections.map(async (auction) => {
      const tokenURI = await contract.tokenURI(auction.tokenId);
      if (!tokenURI) {
        console.error('Invalid tokenURI:', tokenURI);
        return null;
      }
      const pinataData = await fetchPinataData(tokenURI);
      return {
        ...auction,
        ...pinataData,
        tokenURI,
      };
    });

    // Wait for all promises to resolve
    const updatedCollections = await Promise.all(promises);
    console.log('blabbalk', updatedCollections);
    // Filter out null values
    const filteredCollections = updatedCollections.filter((auction) => auction !== null);

    // Update global state only after all promises have resolved
    setGlobalState('collections', structuredAuctions(filteredCollections));
  } catch (error) {
    showErrorToast('loadCollections', error);
  }
};

const structuredAuctions = (auctions) =>
  auctions
    .map((auction) => ({
      tokenId: auction.tokenId.toNumber(),
      owner: auction.owner.toLowerCase(),
      seller: auction.seller.toLowerCase(),
      winner: auction.winner?.toLowerCase(),
      name: auction.name,
      description: auction.description,
      duration: Number(auction.duration + '000'),
      image: auction.image,
      price: fromWei(auction.price),
      biddable: auction.biddable,
      sold: auction.sold,
      live: auction.live,
    }))
    .reverse();

const structuredBidders = (bidders) =>
  bidders
    .map((bidder) => ({
      timestamp: Number(bidder.timestamp + '000'),
      bidder: bidder.bidder.toLowerCase(),
      price: fromWei(bidder.price),
      refunded: bidder.refunded,
      won: bidder.won,
    }))
    .sort((a, b) => b.price - a.price);

export {
  isWallectConnected,
  connectWallet,
  createNftItem,
  loadAuctions,
  loadAuction,
  loadCollections,
  offerItemOnMarket,
  buyNFTItem,
  bidOnNFT,
  getBidders,
  claimPrize,
  updatePrice,
};
