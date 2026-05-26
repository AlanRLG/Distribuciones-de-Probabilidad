import type { BackendSimulationResponse } from './types';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export async function checkApiHealth(): Promise<string> {
  const response = await fetch(`${API_URL}/`);
  if (!response.ok) {
    throw new Error('No se pudo conectar con el backend');
  }
  const data = (await response.json()) as { message: string };
  return data.message;
}

async function postDistribution(body: unknown, endpoint: string): Promise<BackendSimulationResponse> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Error del servidor (${response.status})`;
    try {
      const errorData = (await response.json()) as { detail?: unknown };
      if (Array.isArray(errorData.detail)) {
        message = errorData.detail.map((item) => String((item as { msg?: string }).msg ?? item)).join(', ');
      } else if (typeof errorData.detail === 'string') {
        message = errorData.detail;
      }
    } catch {
      // usar mensaje genérico
    }
    throw new Error(message);
  }

  return response.json() as Promise<BackendSimulationResponse>;
}

export const distributionApi = {
  bernoulli: (p: number, muestra: number) =>
    postDistribution({ p, muestra }, '/distribuciones/bernoulli'),

  binomial: (n: number, p: number, muestra: number) =>
    postDistribution({ n, p, x: muestra }, '/distribuciones/binomial'),

  poisson: (lamb: number, muestra: number) =>
    postDistribution({ lamb, muestra }, '/distribuciones/poisson'),

  geometrica: (p: number, muestra: number) =>
    postDistribution({ p, muestra }, '/distribuciones/geometrica'),

  normal: (media: number, desviacion: number, muestra: number) =>
    postDistribution({ media, desviacion, muestra }, '/distribuciones/normal'),

  exponencial: (media: number, muestra: number) =>
    postDistribution({ media, muestra }, '/distribuciones/exponencial'),

  uniforme: (a: number, b: number, muestra: number) =>
    postDistribution({ a, b, muestra }, '/distribuciones/uniforme'),
};
