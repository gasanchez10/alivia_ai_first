# Alivia AI — Frontend mock

Plataforma demo para residentes y estudiantes de medicina en LATAM: ronda clínica, PubMed, biblioteca, planes de manejo y toolkit de evidencia.

## Demo en vivo

Tras el primer push a `main`, habilita **GitHub Pages** en el repo:

**Settings → Pages → Build and deployment → Source: GitHub Actions**

URL esperada: **https://gasanchez10.github.io/alivia_ai_first/**

Alternativa (URL más limpia, sin subpath): importa el repo en [Vercel](https://vercel.com) — detecta Vite automáticamente.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Guía interactiva

Tras iniciar sesión, una barra inferior recorre **29 pasos** por todos los módulos y capacidades. Usa **Ocultar guía** para desactivarla; el botón **Ver guía** la reactiva.

## Login demo

Cualquier email con contraseña `demo123` inicia sesión mock.

## Estructura

| Módulo | Ruta |
|--------|------|
| Landing | `/` |
| App | `/app` |
| Ronda | `/app/ronda` |
| Biblioteca | `/app/biblioteca` |
| Planes de manejo | `/app/tareas` |

## Documentación

Ver `docs/PLATFORM_FEATURES.md` para contexto de producto.
