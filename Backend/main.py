from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.parametros import ParametrosBinomial, ParametrosNormal, ParametrosGeometrica, ParametrosHiperGeo, ParametrosPoisson
from services.distribuciones import calcularBinomial, calcularNormal, calcularGeometrica, calcularHiperGeo, calcularPoisson


app = FastAPI()

origins = [
    "http://localhost:5173",
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