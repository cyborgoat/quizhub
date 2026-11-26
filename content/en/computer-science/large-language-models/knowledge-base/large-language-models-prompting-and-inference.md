---
id: large-language-models-prompting-and-inference
title: Prompting, Retrieval, and LLM Inference
tags: [large-language-models, prompting, retrieval]
linkedQuizQuestions:
  - quizId: large-language-models-prompting-and-inference
    questionId: large-language-models-system-message
  - quizId: large-language-models-prompting-and-inference
    questionId: large-language-models-tool-calling
  - quizId: large-language-models-prompting-and-inference
    questionId: large-language-models-retrieval-quality
  - quizId: large-language-models-prompting-and-inference
    questionId: large-language-models-streaming
  - quizId: large-language-models-prompting-and-inference
    questionId: large-language-models-output-validation
createdAt: 2026-11-26T00:00:00Z
updatedAt: 2026-11-26T00:00:00Z
---

## Prompts are part of the application

System and user messages provide different context in many chat interfaces, but exact behavior depends on the model and API. Clear instructions, examples, and constrained output formats can improve reliability; they cannot guarantee a correct response. Validate structured output against a schema before using it downstream.

Retrieval-augmented generation supplies relevant passages at inference time. Quality depends on retrieval coverage, ranking, chunking, and whether the model uses the evidence faithfully. Tool calling is a control-flow pattern: validate arguments, authorize actions, and treat tool results as untrusted input.

## Separate latency from correctness

Streaming can improve perceived responsiveness by returning partial output, but partial text may still be incomplete or invalid. Measure end-to-end latency and quality, apply timeouts and safe fallbacks, and distinguish generation success from successful completion of the application task.
