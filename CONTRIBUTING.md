# Politicas de contribucion

## Ramas
- main: version estable. Solo recibe Pull Requests desde develop.
- develop: integracion. Recibe Pull Requests desde ramas feature.
- feature/<nombre-corto>: una rama por tarea nueva.
- fix/<nombre-corto>: una rama por correccion.

## Commits
Formato: tipo: descripcion corta
Tipos: feat, fix, ci, docs, chore, test
Ejemplo: ci: agrega pipeline de build y test

## Pull Requests
- Siempre hacia develop (o de develop hacia main).
- Minimo 1 aprobacion de otro integrante del equipo.
- El pipeline de CI debe estar en verde.
- No se permite push directo ni force push a main ni a develop.
