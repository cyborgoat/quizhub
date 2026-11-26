# quizhub

[English](README.md)

QuizHub 为 [Quizzy](https://github.com/cyborgoat/quizzy) 提供按语言、领域和类别整理的测验与知识笔记。英文版和简体中文版均包含计算机科学下的人工智能和行为科学下的心理学，各有 4 套测验和 6 篇笔记。

## 使用方法

每个 Quizzy 工作目录使用一种语言。如果要同时学习英文版和中文版，请分别设置工作目录。两个版本共用测验、题目和笔记 ID。

| 内容 | 简体中文 | English |
|---|---|---|
| 全部类别 | [Atom](https://cyborgoat.github.io/quizhub/zh/atom.xml) | [Atom](https://cyborgoat.github.io/quizhub/en/atom.xml) |
| 人工智能 | [Atom](https://cyborgoat.github.io/quizhub/zh/ai/atom.xml) | [Atom](https://cyborgoat.github.io/quizhub/en/ai/atom.xml) |
| 心理学 | [Atom](https://cyborgoat.github.io/quizhub/zh/psychology/atom.xml) | [Atom](https://cyborgoat.github.io/quizhub/en/psychology/atom.xml) |
| 文件清单 | [JSON](https://cyborgoat.github.io/quizhub/zh/manifest.json) | [JSON](https://cyborgoat.github.io/quizhub/en/manifest.json) |

Quizzy 的自动同步功能仍在开发中。目前可以打开订阅源，下载条目链接的文件。将测验 JSON 文件放在工作目录中，将 Markdown 笔记放在该目录的 `knowledge-base/` 子目录中。客户端可以通过[语言索引](https://cyborgoat.github.io/quizhub/locales.json)发现各个版本。

## 本地开发

编辑内容和运行构建工具需要 Node.js 20 或更高版本。构建会从 Git 历史中读取文件的更新时间。克隆仓库后，在仓库根目录运行以下命令。

```bash
git clone https://github.com/cyborgoat/quizhub.git
cd quizhub
npm ci
npm run typecheck
npm run validate
npm test
npm run build
```

内容按 `content/<语言>/<领域>/<类别>/` 组织，英文使用 `en`，简体中文使用 `zh`。测验存放在 `quizzes/`，笔记存放在 `knowledge-base/`。构建产物位于 `dist/`。可以通过环境变量 `QUIZHUB_BASE_URL` 设置构建产物中的站点地址。

## 贡献

新增内容先提交到英文版，翻译可以随后补充。提交前请运行 `npm run validate`。文件格式、翻译要求和审阅流程见[简体中文贡献指南](docs/zh/CONTRIBUTING.md)，客户端实现细节见[订阅源规范（英文）](docs/feed-spec.md)。

## 许可证

[MIT](LICENSE) © 2026 Junxiao Guo
