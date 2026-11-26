---
id: ai-scaled-dot-product-attention
title: Atención por producto escalar escalado
tags: [transformers, attention]
linkedQuizQuestions:
  - quizId: ai-transformers
    questionId: scaling-factor
  - quizId: ai-transformers
    questionId: causal-mask
  - quizId: ai-transformers
    questionId: positional-encoding
createdAt: 2026-11-14T00:00:00Z
updatedAt: 2026-11-14T00:00:00Z
---

## Idea principal

Cada token genera una consulta, una clave y un valor. Los pesos de atención se obtienen aplicando la función softmax a las similitudes entre consultas y claves. La salida es la suma ponderada de los valores.

$$\text{Attention}(Q,K,V)=\text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

## Detalles

- Dividir por $\sqrt{d_k}$ evita que los productos escalares grandes saturen la función softmax.
- Una **máscara causal** asigna $-\infty$ a las puntuaciones de las posiciones futuras e impide que el decodificador atienda a ellas.
- Como el mecanismo de atención es insensible al orden, se añade información posicional a las entradas.
