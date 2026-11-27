# quizhub

[English](README.md) · [简体中文](README.zh.md)

QuizHub reúne cuestionarios y notas de estudio para [Quizzy](https://github.com/cyborgoat/quizzy), organizados por idioma, área y categoría. Hay ediciones en inglés, chino simplificado y español; las ediciones en chino y español incluyen actualmente contenido sobre inteligencia artificial y psicología.

## Uso

Elige un idioma por directorio de trabajo de Quizzy. Si quieres estudiar con varias ediciones, usa un directorio para cada idioma. Las traducciones comparten los identificadores de origen de los cuestionarios, las preguntas y las notas.

| Contenido | Español |
|---|---|
| Todas las categorías | [Atom](https://cyborgoat.github.io/quizhub/es/atom.xml) |
| Inteligencia artificial | [Atom](https://cyborgoat.github.io/quizhub/es/ai/atom.xml) |
| Psicología | [Atom](https://cyborgoat.github.io/quizhub/es/psychology/atom.xml) |
| Manifiesto | [JSON](https://cyborgoat.github.io/quizhub/es/manifest.json) |

La sincronización automática de Quizzy sigue en desarrollo. Para importar el contenido manualmente, abre el feed y descarga los archivos enlazados. Guarda los cuestionarios JSON en el directorio de trabajo y las notas Markdown en su subdirectorio `knowledge-base/`. Los clientes pueden encontrar las ediciones disponibles en el [catálogo de idiomas](https://cyborgoat.github.io/quizhub/locales.json).

## Instalación local

Para editar el contenido o generar los feeds necesitas Node.js 20 o posterior. La compilación usa el historial de Git para determinar la fecha de actualización de cada archivo.

```bash
git clone https://github.com/cyborgoat/quizhub.git
cd quizhub
npm ci
npm run validate
npm run typecheck
npm test
npm run build
```

El contenido en español está en `content/es/` y la compilación genera los archivos publicables en `dist/`. La variable de entorno `QUIZHUB_BASE_URL` permite cambiar la URL base que se escribe en los feeds.

## Contribuir

Añade los contenidos nuevos primero a la edición en inglés. Las traducciones se pueden incorporar después. Ejecuta `npm run validate` antes de enviar los cambios. Consulta la [guía de contribución](docs/CONTRIBUTING.md) y la [especificación del feed](docs/feed-spec.md), ambas en inglés.

## Licencia

[MIT](LICENSE) © 2026 Junxiao Guo
