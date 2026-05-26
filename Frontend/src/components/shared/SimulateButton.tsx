import styles from '../../styles/MainLayout.module.css';

interface SimulateButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export default function SimulateButton({ onClick, loading = false }: SimulateButtonProps) {
  return (
    <button
      type="button"
      className={styles.simulateButton}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? 'Simulando…' : '▶ Simular'}
    </button>
  );
}
