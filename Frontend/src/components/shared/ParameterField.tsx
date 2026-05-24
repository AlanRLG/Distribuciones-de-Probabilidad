import type { InputHTMLAttributes } from 'react';
import styles from '../../styles/MainLayout.module.css';

interface ParameterFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function ParameterField({ label, id, ...inputProps }: ParameterFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {label}
      </label>
      <input id={id} className={styles.parameterInput} {...inputProps} />
    </div>
  );
}
