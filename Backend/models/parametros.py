from pydantic import BaseModel

class ParametrosBinomial(BaseModel):
    n: int        # número de ensayos
    p: float      # probabilidad de éxito
    x: int        # valor a evaluar

class ParametrosPoisson(BaseModel):
    lam: float    # lambda, tasa de ocurrencia
    x: int        # valor a evaluar



class ParametrosGeometrica(BaseModel):
    p: float            # probabilidad de éxito
    muestra: int        # valor a evaluar

class ParametrosHiperGeo(BaseModel):
    K: int              #pertenecientes a categoria A
    N: int              #size poblacion
    n: int              #size muestra
    muestra: int        # valor a evaluar

class ParametrosPoisson(BaseModel):
    lamb: float            # tasa de aparicion de eventos
    muestra: int        # valor a evaluar

class ParametrosNormal(BaseModel):
    media: float
    desviacion: float
    muestra: int

class ParametrosUniforme(BaseModel):
    a: float
    b: float
    muestra: int    

class ParametrosExponencial(BaseModel):
    media: float
    muestra: int