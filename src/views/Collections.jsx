import { useEffect } from 'react';
import Empty from '../components/Empty';
import { useGlobalState } from '../store';
import Artworks from '../components/Artworks';
import { loadCollections } from '../services/blockchain';

const Collections = () => {
  const [collections] = useGlobalState('collections');

  useEffect(() => {
    const fetchData = async () => {
      await loadCollections();
    };

    fetchData();
  }, []);

  return (
    <div>
      {collections.length > 0 ? <Artworks auctions={collections} title='My Collections' showOffer={true} /> : <Empty />}
    </div>
  );
};

export default Collections;
