from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.parametros import ParametrosBernoulli, ParametrosBinomial, ParametrosNormal, ParametrosGeometrica, ParametrosHiperGeo, ParametrosPoisson, ParametrosUniforme, ParametrosExponencial
from services.distribuciones import calcularBernoulli, calcularBinomial, calcularNormal, calcularGeometrica, calcularHiperGeo, calcularPoisson, calcularUniforme, calcularExponencial


app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API funcionando"}

#discretas

@app.post("/distribuciones/bernoulli")
def bernoulli(params: ParametrosBernoulli):
    return calcularBernoulli(params.p, params.muestra)

@app.post("/distribuciones/binomial")
def binomial(params: ParametrosBinomial):
    n = params.n
    p = params.p
    x = params.x

    return calcularBinomial(n,p,x)

@app.post("/distribuciones/geometrica")
def geometrica(params: ParametrosGeometrica):
    p = params.p
    muestra = params.muestra

    return calcularGeometrica(p, muestra)

@app.post("/distribuciones/hipergeometrica")
def hipergeometrica(params: ParametrosHiperGeo):
    N = params.N
    K = params.K
    n = params.n
    muestra = params.muestra

    return calcularHiperGeo(N,K,n, muestra)

@app.post("/distribuciones/poisson")
def poisson(params: ParametrosPoisson):
    lamb = params.lamb
    muestra = params.muestra

    return calcularPoisson(lamb, muestra)

#continuas


@app.post("/distribuciones/normal")
def normal(params: ParametrosNormal):
    media = params.media
    desviacion = params.desviacion
    muestra = params.muestra

    return calcularNormal(media, desviacion, muestra)

@app.post("/distribuciones/uniforme")
def uniforme(params: ParametrosUniforme):
    a = params.a
    b = params.b
    muestra = params.muestra

    return calcularUniforme(a, b, muestra)

@app.post("/distribuciones/exponencial")
def exponencial(params: ParametrosExponencial):
    media = params.media
    muestra = params.muestra

    return calcularExponencial(media, muestra)