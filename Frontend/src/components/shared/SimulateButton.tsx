import styles from '../../styles/MainLayout.module.css';

interface SimulateButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function SimulateButton({ onClick, loading = false, disabled = false }: SimulateButtonProps) {
  return (
    <button
      type="button"
      className={styles.simulateButton}
      onClick={onClick}
      disabled={loading || disabled}
      
    >
      {loading ? 'Simulando…' : '▶ Simular'}
    </button>
  );
}
