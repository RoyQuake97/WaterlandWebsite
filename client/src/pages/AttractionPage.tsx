import { useRoute } from 'wouter';
import AttractionDetail from '@/components/attractions/AttractionDetail';

const AttractionPage = () => {
  const [, params] = useRoute('/attraction/:key');
  const key = params?.key;

  if (!key) return null;

  return <AttractionDetail attractionKey={key} />;
};

export default AttractionPage;