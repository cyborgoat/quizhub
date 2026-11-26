---
id: ai-gradient-descent
title: Descenso del gradiente
tags: [machine-learning, optimization]
linkedQuizQuestions:
  - quizId: ai-ml-basics
    questionId: gradient-descent-step
createdAt: 2026-11-14T00:00:00Z
updatedAt: 2026-11-14T00:00:00Z
---

## Idea principal

El descenso del gradiente minimiza una función de pérdida $L(\theta)$ mediante pasos sucesivos en el sentido *opuesto* al del gradiente.

$$\theta \leftarrow \theta - \eta \nabla_\theta L(\theta)$$

La tasa de aprendizaje $\eta$ determina el tamaño del paso.

## Puntos clave

- Si $\eta$ es demasiado grande, los pasos pueden sobrepasar el mínimo o el método puede divergir. Si es demasiado pequeña, la convergencia es lenta.
- Las variantes **estocásticas** y **por minilotes** estiman el gradiente a partir de un subconjunto de los datos para ganar velocidad a costa de introducir ruido.
- Los métodos con momento y los optimizadores como Adam ajustan el paso a partir de gradientes anteriores.
