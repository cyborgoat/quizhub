---
id: natural-language-processing-text-foundations
title: Text Processing and Tokenization
tags: [natural-language-processing, tokenization, text-processing]
linkedQuizQuestions:
  - quizId: natural-language-processing-text-foundations
    questionId: natural-language-processing-sentence-tokenization
  - quizId: natural-language-processing-text-foundations
    questionId: natural-language-processing-lemmatization
  - quizId: natural-language-processing-text-foundations
    questionId: natural-language-processing-n-gram
  - quizId: natural-language-processing-text-foundations
    questionId: natural-language-processing-language-identification
  - quizId: natural-language-processing-text-foundations
    questionId: natural-language-processing-oov-problem
createdAt: 2026-11-26T00:00:00Z
updatedAt: 2026-11-26T00:00:00Z
---

## Preprocessing choices shape the task

Tokenization divides text into units such as sentences, words, or subwords. Punctuation, abbreviations, scripts, and language-specific conventions make boundaries nontrivial. Lemmatization maps inflected forms to a lemma using linguistic information; stemming usually applies simpler rules and can produce non-words.

An n-gram is a sequence of adjacent tokens and can capture local patterns, but longer context requires more data and sparse representations can become difficult to manage. Out-of-vocabulary issues arise when a system encounters forms not represented by its vocabulary; subword methods reduce but do not eliminate coverage and segmentation challenges.

## Preserve the original context

Language identification and normalization should account for code-switching, names, and nonstandard text. Keep preprocessing consistent between training and inference, and evaluate whether transformations remove distinctions important to the application.
