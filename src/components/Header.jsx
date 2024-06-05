import React from 'react';
import { Link } from 'react-router-dom';
import { connectWallet } from '../services/blockchain';
import { truncate, useGlobalState } from '../store';
import Logo from '../assets/images/LOGO.png';
import { logOutWithCometChat } from '../services/chat';

const Header = () => {
  const [connectedAccount] = useGlobalState('connectedAccount');

  return (
    <nav className='w-4/5 mb-[90px] flex flex-row md:justify-center justify-between items-center py-4 mx-auto'>
      <div className='md:flex-[0.5] flex-initial justify-center items-center'>
        <Link to='/' className='text-white'>
          <img src={Logo} alt='Logo' />
        </Link>
      </div>

      <ul className='md:flex-[0.5] text-white md:flex hidden list-none flex-row justify-between items-center flex-initial'>
        <Link to='/' className='mx-4 cursor-pointer font-archivo font-regular'>
          Market
        </Link>
        <Link to='/collections' className='mx-4 cursor-pointer font-archivo font-regular'>
          Collection
        </Link>
        <Link className='mx-4 cursor-pointer font-archivo font-regular'>Artists</Link>
        <Link className='mx-4 cursor-pointer font-archivo font-regular'>Community</Link>
        {connectedAccount ? (
          <button
            onClick={logOutWithCometChat}
            className=' text-black  bg-white rounded-[18px] px-10 py-3 text-base cursor-pointer font-medium text-center text-xs sm:text-base font-archivo'
          >
            {truncate(connectedAccount, 4, 4, 11)}
          </button>
        ) : (
          <button
            className=' w-[190px] text-black  bg-white rounded-[18px] px-10 py-3 text-base cursor-pointer  font-medium text-center text-xs sm:text-base font-archivo'
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </ul>
    </nav>
  );
};

export default Header;
