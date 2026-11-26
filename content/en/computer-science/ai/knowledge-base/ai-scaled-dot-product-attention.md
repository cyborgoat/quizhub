---
id: ai-scaled-dot-product-attention
title: Scaled Dot-Product Attention
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

## Key idea

Each token produces a query, key and value. Attention weights are a softmax over query-key similarity, and the output is the weighted sum of values:

$$\text{Attention}(Q,K,V)=\text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

## Details

- Dividing by $\sqrt{d_k}$ stops large dot products from saturating the softmax.
- A **causal mask** sets scores for future positions to $-\infty$ so a decoder cannot look ahead.
- Attention is order-agnostic, so positional information is added to the inputs.
