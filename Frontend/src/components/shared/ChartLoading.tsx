import styles from '../../styles/MainLayout.module.css';

export default function ChartLoading() {
  return (
    <div
      className={styles.chartHero}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
      }}
    >
      Simulando con el backend…
    </div>
  );
}
