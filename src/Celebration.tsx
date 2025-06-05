import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

export default function Celebration({ color }: { color: string }) {
  const { width, height } = useWindowSize();
  return <Confetti width={width} height={height} colors={[color]} />;
}
