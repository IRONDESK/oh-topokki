import { theme } from '@/style/theme.css';

type Props = {
  color?: 'primary' | 'white';
  size?: number;
  thick?: number;
};

function Spinner(props: Props) {
  const { color = 'primary', size = 24, thick = 2 } = props;
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '100%',
        border: `${thick}px solid ${theme.color.primary['200']}`,
        borderRightColor: theme.color.primary['600'],
        animation: 'spin 1s linear infinite',
      }}
    ></div>
  );
}

export default Spinner;
