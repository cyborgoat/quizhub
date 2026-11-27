# quizhub

[English](README.md) · [简体中文](README.zh.md)

QuizHub reúne cuestionarios y notas de estudio para [Quizzy](https://github.com/cyborgoat/quizzy), organizados por idioma, área y categoría. Hay ediciones en inglés, chino simplificado y español; las ediciones en chino y español incluyen actualmente contenido sobre inteligencia artificial y psicología.

## Uso

Elige un idioma por directorio de trabajo de Quizzy. Si quieres estudiar con varias ediciones, usa un directorio para cada idioma. Las traducciones comparten los identificadores de origen de los cuestionarios, las preguntas y las notas.

Después de compilar y publicar `dist/` en tu propio alojamiento, los clientes usan rutas bajo tu `QUIZHUB_BASE_URL`:

| Contenido | Ruta |
|---|---|
| Catálogo de idiomas | `locales.json` |
| Feed Atom del idioma | `<idioma>/atom.xml` |
| Manifiesto del idioma | `<idioma>/manifest.json` |
| Feed Atom de categoría | `<idioma>/<categoría>/atom.xml` |

Ejemplos: `es/atom.xml`, `en/ai/atom.xml`, `zh/manifest.json`.

La sincronización automática de Quizzy sigue en desarrollo. Para importar el contenido manualmente, abre el feed y descarga los archivos enlazados. Guarda los cuestionarios JSON en el directorio de trabajo y las notas Markdown en su subdirectorio `knowledge-base/`. Los clientes descubren las ediciones a través de `locales.json`.

## Instalación local

Para editar el contenido o generar los feeds necesitas Node.js 20 o posterior. La compilación usa el historial de Git para determinar la fecha de actualización de cada archivo.

```bash
git clone https://github.com/cyborgoat/quizhub.git
cd quizhub
npm ci
npm run validate
npm run typecheck
npm test
QUIZHUB_BASE_URL=https://example.com/quizhub/ npm run build
```

El contenido en español está en `content/es/` y la compilación genera los archivos publicables en `dist/`. La variable de entorno `QUIZHUB_BASE_URL` es obligatoria y define la URL base que se escribe en los feeds. No envíes nombres de dominio personales a este repositorio.

## Contribuir

Añade los contenidos nuevos primero a la edición en inglés. Las traducciones se pueden incorporar después. Ejecuta `npm run validate` antes de enviar los cambios. Consulta la [guía de contribución](docs/CONTRIBUTING.md) y la [especificación del feed](docs/feed-spec.md), ambas en inglés.

## Licencia

[MIT](LICENSE)
