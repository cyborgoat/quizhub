# 内容贡献指南

[English](../CONTRIBUTING.md)

内容存放在 `content/<语言>/<领域>/<类别>/`。目前支持 `en`（英语）、`zh`（简体中文）和 `es`（西班牙语）。可用领域和类别见[分类配置](../../scripts/lib/categories.ts)。

## 测验

测验存放在 `content/<语言>/<领域>/<类别>/quizzes/<测验 ID>.json`，遵循 [Quizzy 测验格式](https://github.com/cyborgoat/quizzy/blob/main/docs/quiz-format.md)。

- `id` 必须与文件名去掉扩展名后的部分一致，并以类别 ID 加连字符开头，例如 `ai-ml-basics`。
- 题型包括单选题 `single_choice`（`answerIndex`）、多选题 `multiple_choice`（`answerIndices`，须包含全部正确选项且不能重复）和判断题 `true_false`（布尔值 `answer`）。
- 每套测验建议包含 20–30 道题，并混合题型；每道题都应提供清晰的解析。
- 为每道题填写 `explanation`。缺失时，验证工具会给出警告。
- 题干、选项和解析支持 Markdown、代码块和 KaTeX。JSON 字符串中的反斜杠需要转义，例如 `"$\\theta$"`。
- 标签用小写英文字母或数字，单词之间用连字符分隔。

## 知识笔记

笔记存放在 `content/<语言>/<领域>/<类别>/knowledge-base/<笔记 ID>.md`，遵循 [Quizzy 知识笔记格式](https://github.com/cyborgoat/quizzy/blob/main/docs/knowledge-format.md)。

- 文件开头元数据中的 `id` 必须与文件名去掉扩展名后的部分一致，并以类别 ID 加连字符开头。
- `createdAt` 和 `updatedAt` 使用带时区的 ISO 8601 时间戳。修改笔记时更新 `updatedAt`。
- 用 `linkedQuizQuestions` 关联笔记所解释的题目。可以关联其他领域的题目，但测验和题目必须存在于同一语言版本中。

## 翻译

新增内容先提交到 `content/en/`，译文可以在后续的拉取请求中提交。将英文文件复制到目标语言的相同类别下，并翻译标题、描述、题干、选项、解析和笔记正文。

文件名、ID、类别、标签、题型、选项顺序、答案和笔记中的题目关联应与英文原文保持一致。翻译笔记前，请确认其关联的测验在目标语言版本中已经存在或将一并提交。

## 提交前检查

```bash
npm ci
npm run validate
npm test
npm run build
```

测验和笔记中的事实须由人工核对，包括借助语言模型起草的内容。审阅译文时，还要对照原文检查用词、正确答案和解析。对不属于常识的论断，请在拉取请求中注明来源。

## 新增领域和类别

在 `DOMAINS` 中添加领域 ID 和各语言的显示名称。在 `CATEGORIES` 中为每个类别设置全局唯一的 ID、所属领域和各语言的显示名称。创建 `content/en/<领域>/<类别>/`，并为要发布的译文创建相应目录。值得拥有独立订阅源的主题优先设为单独类别；更细的子主题则使用测验和标签表示。
