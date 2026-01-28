import './index.scss';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

export default function Spinner({ size = 'md' }: SpinnerProps) {
    return <span className={`custom-spinner ${size}`} />;
}
