---
id: ai-overfitting-regularization
title: Sobreajuste y regularización
tags: [machine-learning, generalization]
linkedQuizQuestions:
  - quizId: ai-ml-basics
    questionId: regularization-techniques
  - quizId: ai-ml-basics
    questionId: bias-variance
  - quizId: ai-ml-basics
    questionId: test-set-tuning
createdAt: 2026-11-14T00:00:00Z
updatedAt: 2026-11-14T00:00:00Z
---

## Idea principal

Un modelo se **sobreajusta** cuando aprende el ruido de los datos de entrenamiento y generaliza mal. La señal típica es un error de entrenamiento bajo y un error de validación mucho mayor.

## Técnicas para reducir el sobreajuste

| Técnica | Cómo ayuda |
|---|---|
| Decaimiento de pesos L2 | Penaliza los pesos grandes |
| Dropout | Desactiva unidades al azar durante el entrenamiento |
| Detención temprana | Detiene el entrenamiento cuando la pérdida de validación deja de mejorar |
| Más datos o aumento de datos | Dificulta la memorización |

## Buenas prácticas de evaluación

Ajusta el modelo con un conjunto de validación e informa una sola vez del resultado en el conjunto de prueba. Consultar repetidamente el conjunto de prueba hace que el resultado final sea demasiado optimista.
