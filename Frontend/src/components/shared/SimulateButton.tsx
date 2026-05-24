import styles from '../../styles/MainLayout.module.css';

interface SimulateButtonProps {
  onClick: () => void;
}

export default function SimulateButton({ onClick }: SimulateButtonProps) {
  return (
    <button type="button" className={styles.simulateButton} onClick={onClick}>
      ▶ Simular
    </button>
  );
}
