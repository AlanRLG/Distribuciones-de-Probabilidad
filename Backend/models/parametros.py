from pydantic import BaseModel

class ParametrosBinomial(BaseModel):
    n: int        # número de ensayos
    p: float      # probabilidad de éxito
    x: int        # valor a evaluar

class ParametrosPoisson(BaseModel):
    lam: float    # lambda, tasa de ocurrencia
    x: int        # valor a evaluar

class ParametrosNormal(BaseModel):
    media: float
    desviacion: float
    muestra: int

class ParametrosGeometrica(BaseModel):
    p: float            # probabilidad de éxito
    muestra: int        # valor a evaluar