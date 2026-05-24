import numpy as np
from scipy import stats

def calcularBinomial(n, p, x):

    # muestra = 1000 significa que repites el experimento 1000 veces
    datos = np.random.binomial(n,p,x)   #genera una distribucion binomial con esos parametros   
    
    #datos calculados en base a los datos generados
    mediaDatos = datos.mean()
    varDatos = datos.var()
    desvStdDatos = datos.std()
    
    #datos calculados teoricamente
    mediaCalc = n*p
    varCalc = n * p * (1-p)
    desvStdCalc = np.sqrt(varCalc)
    
    #se pasa a lista de python porque los ndarray de np no son serializables en fastAPI
    datos.tolist()

    
    return {
        "simulado": {
            "media": mediaDatos,
            "varianza": varDatos,
            "desviacion_estandar": desvStdDatos,
            "datos": datos.tolist()
        },
        "teorico": {
            "media": mediaCalc,
            "varianza": varCalc,
            "desviacion_estandar": desvStdCalc
        }
    }


def calcularGeometrica(probabilidad, muestra):

    # Primero creas el generador
    rng = np.random.default_rng()
    #acomodo para generar una distribucion geometrica
    datos = rng.geometric(p=probabilidad, size=muestra)

    # Estadisticas simuladas
    mediaDatos = datos.mean()
    varDatos = datos.var()
    desvStdDatos = datos.std()

    #valores teoricos
    mediaCalc = 1 / probabilidad
    varianzaCalc = (1-probabilidad) / (probabilidad**2)
    desvStdCalc = np.sqrt(varianzaCalc)


    return {
        "simulado": {
            "media": mediaDatos,
            "varianza": varDatos,
            "desviacion_estandar": desvStdDatos,
            "datos": datos.tolist()
            
        },

        "teorico": {
            "media": mediaCalc,
            "varianza": varianzaCalc,
            "desviacion_estandar": desvStdCalc,
        }

    }


def calcularNormal(media, desviacion, muestra):

    # Datos simulados
    datos = np.random.normal(loc=media, scale=desviacion, size=muestra)

    # Estadisticas simuladas
    mediaDatos = datos.mean()
    varDatos = datos.var()
    desvStdDatos = datos.std()

    # Curva teorica para graficar
    x_vals = np.linspace(media - 4*desviacion, media + 4*desviacion, 200)
    y_vals = stats.norm.pdf(x_vals, loc=media, scale=desviacion)


    return {
        "simulado": {
            "media": mediaDatos,
            "varianza": varDatos,
            "desviacion_estandar": desvStdDatos,
            "datos": datos.tolist()
            
        },

        "teorico": {
            "media": media,
            "varianza": desviacion**2,
            "desviacion_estandar": desviacion,
            "x_vals": x_vals.tolist(),  # eje X de la campana
            "y_vals": y_vals.tolist()   # eje Y de la campana
        }

    }