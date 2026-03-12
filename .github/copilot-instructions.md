# Instrucciones para GitHub Copilot — vitaglossrd

## Git: Repos y Deploy

**SIEMPRE** que se haga un cambio, el push debe ir a **AMBOS** repositorios al mismo tiempo con un solo comando:

```bash
git push origin main
```

### Repositorios configurados en `origin`:
| Repo | URL | Propósito |
|------|-----|-----------|
| Principal | `git@github-arosadoclud:arosadoclud/vitaglossrd.git` | Deploy → Vercel (frontend) + Railway (backend) |
| Backup | `https://github.com/andyRS/vitaglossrd.git` | Copia de seguridad (andyRS) |

`origin` tiene dos push URLs configuradas, así que `git push origin main` sube a los dos repos simultáneamente.

### SSH
- Alias SSH: `github-arosadoclud` → configurado en `~/.ssh/config`
- Clave privada: `~/.ssh/id_arosadoclud`

---

## Estructura del proyecto

- `frontend/` — React + Vite → desplegado en **Vercel**
- `backend/` — Node.js/Express → desplegado en **Railway**
- `frontend/vercel.json` — configuración de Vercel (rewrites, headers)
- `railway.json` + `nixpacks.toml` — configuración de Railway

## Regla de deploy

Nunca hacer push solo a un repo. Siempre usar `git push origin main` para sincronizar ambos.
