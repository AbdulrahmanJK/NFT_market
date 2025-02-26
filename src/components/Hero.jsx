import { toast } from 'react-toastify';
import { BsArrowRightShort } from 'react-icons/bs';
import PlaceHolderLogo from '../assets/images/placeholder.svg';
import { CONSTANTS } from '../services/chat';
import { getGlobalState, setGlobalState, useGlobalState } from '../store';
import { loginWithCometChat, signUpWithCometChat } from '../services/chat';
import { isWallectConnected } from '../services/blockchain';
import { CometChat } from '@cometchat-pro/chat';



const Hero = () => {
  return (
    <div className='flex flex-col items-start md:flex-row w-4/5 mx-auto '>
      <Banner />
      <Bidder />
    </div>
  );
};

const Bidder = () => (
  <div
    className=' bg-white 
      rounded-xl py-3 px-3  '
  >
    <img src={PlaceHolderLogo} alt='nft' className=' w-[500px]  ' />
    <div
      className='
      flex flex-row justify-between items-center'
    >
      <div className='text-base font-normal  font-archivo text-gray-900 opacity-50 '>
        Current Bid
        <div className='font-bold text-center text-black'>2.231 ETH</div>
      </div>
      <div className='text-base font-normal font-archivo text-gray-900 opacity-50 '>
        Auction End
        <div className='font-bold text-center text-black'>20:10</div>
      </div>
    </div>
  </div>
);
const Banner = () => {
  const [currentUser] = useGlobalState('currentUser');
  isWallectConnected;

  const handleLogin = async () => {
    if (await isWallectConnected()) {
      await toast.promise(
        new Promise(async (resolve, reject) => {
          await loginWithCometChat()
            .then((user) => {
              if (user) {
                setGlobalState('currentUser', user);
                console.log(user);
                resolve();
              } else {
                reject(new Error('Login failed: User is undefined'));
              }
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        }),
        {
          pending: 'Signing in...',
          success: 'Logged in successfully 👌',
          error: 'Error, are you signed up wallet? 🤯',
        }
      );
    } else {
      toast.error('Auth wallet');
    }
  };

  const loginWithCometChat = async () => {
    const authKey = CONSTANTS.Auth_Key;
    const UID = getGlobalState('connectedAccount');

    return new Promise(async (resolve, reject) => {
      await CometChat.login(UID, authKey)
        .then((user) => resolve(user))
        .catch((error) => {
          showErrorToast('loginWithCometChat', error);
          reject(error);
        });
    });
  };

  const showErrorToast = (identifier, error) => {
    const errorMessage = error.message || JSON.stringify(error);
    toast.error(`Error in ${identifier}: ${errorMessage}`);
  };

  const handleSignup = async () => {
    if (await isWallectConnected()) {
      await toast.promise(
        new Promise(async (resolve, reject) => {
          await signUpWithCometChat()
            .then((user) => {
              if (user) {
                console.log(user);
                resolve(user);
              } else {
                reject(new Error('Signup failed: User is undefined'));
              }
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        }),
        {
          pending: 'Signing up...',
          success: 'Signed up successfully 👌',
          error: 'Error, maybe you should login instead? 🤯',
        }
      );
    } else {
      toast.error('Auth wallet');
    }
  };

  return (
    <div
      className='flex flex-col md:flex-row w-full justify-between 
        items-center mx-auto '
    >
      <div className=''>
        <h1 className=' uppercase leading-none text-white font-semibold text-[60px] font-spaceGrotesk '>
          Discover, Collect
        </h1>
        <h1 className=' uppercase  leading-none font-semibold mb-[30px] text-[60px] text-white font-spaceGrotesk '>
          and Sell
          <span className='text-[60px] uppercase text-[#FE7762] px-1 font-spaceGrotesk '> NFTS</span>
        </h1>
        <p className='text-white font-archivo text-[20px] font-light'>More than 100+ NFT available for</p>
        <p className='text-white mb-[30px] font-archivo text-[20px] font-light '>collect & sell, get your NFT now.</p>
        <div className='flex flew-row text-5xl mb-[70px]'>
          {!currentUser ? (
            <div className='flex justify-between rounded-2xl items-centerrounded-2xl py-1.5 px-1.5 w-[330px] h-[66px] bg-[#191A1E]'>
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
        <div className='flex items-center justify-between mb-[78px] w-[456px] h-[70px] '>
          <div>
            <p className='text-white font-bold uppercase font-archivo text-[40px] font-bold '>100k+</p>
            <small className='text-gray-300 uppercase'>Auction</small>
          </div>
          <div>
            <p className='text-white font-bold uppercase font-archivo text-[40px] font-bold'>210k+</p>
            <small className='text-gray-300 uppercase'>Rare</small>
          </div>
          <div>
            <p className='text-white font-bold uppercase font-archivo text-[40px] font-bold'>120k+</p>
            <small className='text-gray-300 uppercase'>Artist</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
