import { toast } from 'react-toastify';
import { BsArrowRightShort } from 'react-icons/bs';
import PlaceHolderLogo from '../assets/images/placeholder.svg';
import BackGroundSphere from '../assets/images/Sphere.svg';

import { setGlobalState, useGlobalState } from '../store';
import { loginWithCometChat, signUpWithCometChat } from '../services/chat';

const Hero = () => {
  return (
    <div className='flex flex-col items-start md:flex-row w-4/5 mx-auto mt-11'>
      <Banner />
      <Bidder />
    </div>
  );
};

const Bidder = () => (
  <div
    className=' bg-white 
      rounded-xl py-3 px-3 w-[367px] '
  >
    <img src={PlaceHolderLogo} alt='nft' className=' w-[343px]  ' />
    <div
      className='
      flex flex-row justify-between items-center'
    >
      <div className='text-base font-normal  font-archivo text-gray-900 opacity-50 text-black'>
        Current Bid
        <div className='font-bold text-center text-black'>2.231 ETH</div>
      </div>
      <div className='text-base font-normal font-archivo text-gray-900 opacity-50 text-black'>
        Auction End
        <div className='font-bold text-center text-black'>20:10</div>
      </div>
    </div>
  </div>
);

const Banner = () => {
  const [currentUser] = useGlobalState('currentUser');

  const handleLogin = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await loginWithCometChat()
          .then((user) => {
            setGlobalState('currentUser', user);
            console.log(user);
            resolve();
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      }),
      {
        pending: 'Signing in...',
        success: 'Logged in successful 👌',
        error: 'Error, are you signed up? 🤯',
      }
    );
  };

  const handleSignup = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await signUpWithCometChat()
          .then((user) => {
            console.log(user);
            resolve(user);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      }),
      {
        pending: 'Signing up...',
        success: 'Signned up successful 👌',
        error: 'Error, maybe you should login instead? 🤯',
      }
    );
  };

  return (
    <div
      className='flex flex-col md:flex-row w-full justify-between 
        items-center mx-auto '
    >
      <div className=''>
        <h1 className=' uppercase text-white font-semibold text-5xl py-1 font-spaceGrotesk font-bold'>
          Discover, Collect
        </h1>
        <h1 className=' uppercase font-semibold text-4xl mb-5 text-white py-1 font-spaceGrotesk font-bold'>
          and Sell
          <span className=' uppercase text-[#FE7762] px-1 font-spaceGrotesk font-bold'> NFTS</span>
        </h1>
        <p className='text-white font-archivo font-light'>More than 100+ NFT available for</p>
        <p className='text-white mb-11 font-archivo font-light '>collect & sell, get your NFT now.</p>
        <div className='flex flew-row text-5xl mb-4'>
          {!currentUser ? (
            <div className='flex justify-between items-center space-x-2 rounded-2xl py-1.5 px-1.5 w-[330px] h-[66px] bg-[#191A1E]'>
              <button
                className='text-white text-lg p-2 bg-[#FE7762] rounded-[18px] px-10.5 py-4.5 w-36 h-14 
                flex flex-row justify-center items-center'
                onClick={handleLogin}
              >
                Login Now
              </button>
              <button
                className='text-white text-lg p-2 flex flex-row 
                justify-center items-center rounded-[18px] px-10.5 py-4.5 w-36 h-14'
                onClick={handleSignup}
              >
                Signup Now
              </button>
            </div>
          ) : (
            <button
              className='text-white text-lg p-2 bg-green-500 rounded-[18px] px-10.5 py-4.5 w-36 h-14 
              flex flex-row justify-center items-center '
              onClick={() => setGlobalState('boxModal', 'scale-100')}
            >
              Create NFT
              <BsArrowRightShort className='font-bold animate-pulse' />
            </button>
          )}
        </div>
        <div className='flex items-center justify-between w-[456px] h-[70px] '>
          <div>
            <p className='text-white font-bold uppercase font-archivo text-4xl font-bold '>100k+</p>
            <small className='text-gray-300 uppercase'>Auction</small>
          </div>
          <div>
            <p className='text-white font-bold uppercase font-archivo text-4xl font-bold'>210k+</p>
            <small className='text-gray-300 uppercase'>Rare</small>
          </div>
          <div>
            <p className='text-white font-bold uppercase font-archivo text-4xl font-bold'>120k+</p>
            <small className='text-gray-300 uppercase'>Artist</small>
          </div>
        </div>
      </div>
      <div className='absolute right-0 top-0 w-auto h-auto'>
        <img src={BackGroundSphere} alt='nft' className='w-[899px]  ' />
      </div>
    </div>
  );
};

export default Hero;
