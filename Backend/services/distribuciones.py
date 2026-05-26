import numpy as np
from scipy import stats

#discretas

def calcularBernoulli(p, muestra):
    datos = np.random.binomial(1, p, muestra)

    mediaDatos = datos.mean()
    varDatos = datos.var()
    desvStdDatos = datos.std()

    mediaCalc = p
    varCalc = p * (1 - p)
    desvStdCalc = np.sqrt(varCalc)

    return {
        "simulado": {
            "media": float(mediaDatos),
            "varianza": float(varDatos),
            "desviacion_estandar": float(desvStdDatos),
            "datos": datos.tolist(),
        },
        "teorico": {
            "media": float(mediaCalc),
            "varianza": float(varCalc),
            "desviacion_estandar": float(desvStdCalc),
        },
    }


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


def calcularHiperGeo(N,K,n, muestra):

    # Primero creas el generador
    rng = np.random.default_rng()
    #acomodo para generar una distribucion geometrica
    datos = rng.hypergeometric( nbad= N-K , ngood=K , nsample=n ,  size=muestra)

    # Estadisticas simuladas
    mediaDatos = datos.mean()
    varDatos = datos.var()
    desvStdDatos = datos.std()

    #valores teoricos
    mediaCalc = n * (K/N)
    varianzaCalc = n * (K/N) * ((N-K)/N) * ((N-n)/(N-1))
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


def calcularPoisson(lamb, muestra):

    # Primero creas el generador
    rng = np.random.default_rng()
    #acomodo para generar una distribucion geometrica
    datos = rng.poisson( lam=lamb, size=muestra)

    # Estadisticas simuladas
    mediaDatos = datos.mean()
    varDatos = datos.var()
    desvStdDatos = datos.std()

    #valores teoricos
    mediaCalc = lamb
    varianzaCalc = lamb
    desvStdCalc = np.sqrt(lamb)


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



#continuas


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


def calcularUniforme(a, b, muestra):

    # Datos simulados
    rng = np.random.default_rng()
    datos = rng.uniform(low=a, high=b, size=muestra)

    # Estadisticas simuladas
    mediaDatos = datos.mean()
    varDatos = datos.var()
    desvStdDatos = datos.std()

    #valores teoricos
    mediaCalc = (a+b)/2
    varianzaCalc = ((b-a)**2)/12 
    desvStdCalc = np.sqrt(varianzaCalc)

    # Curva teorica para graficar
    x_vals = np.linspace(a - 1, b + 1, 200)
    y_vals = stats.uniform.pdf(x_vals, loc=a, scale=b-a)


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
            "x_vals": x_vals.tolist(),  # eje X de la campana
            "y_vals": y_vals.tolist()   # eje Y de la campana
        }

    }


def calcularExponencial(media, muestra):
    lamb = 1/media

    # Datos simulados
    rng = np.random.default_rng()
    datos = rng.exponential(scale=media, size=muestra)

    # Estadisticas simuladas
    mediaDatos = datos.mean()
    varDatos = datos.var()
    desvStdDatos = datos.std()

    #valores teoricos
    mediaCalc = 1/lamb                      #aqui se puede alternar a media
    varianzaCalc = 1/(lamb**2)              #aqui se puede alternar a media**2
    desvStdCalc = np.sqrt(varianzaCalc)     #aqui media

    # Curva teorica para graficar
    x_vals = np.linspace(0, media * 5, 200)  # empieza en 0, nunca negativo
    y_vals = stats.expon.pdf(x_vals, scale=media)


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
            "x_vals": x_vals.tolist(),  # eje X de la campana
            "y_vals": y_vals.tolist()   # eje Y de la campana
        }

    }