import styles from '../../styles/MainLayout.module.css';

interface SimulationErrorProps {
  message: string;
}

export default function SimulationError({ message }: SimulationErrorProps) {
  return (
    <p className={styles.distributionDescription} style={{ color: '#f87171' }}>
      {message}
    </p>
  );
}
