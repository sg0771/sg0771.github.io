# 我的文档
所有文章存放在 blog 目录。

[进入文章目录](/blog/)

## 更新文章目录

新增或删除 `blog` 目录下的 `.md` 文件后，运行：

```bash
npm run update:index
```

提交到 GitHub 后，GitHub Actions 会自动生成文章目录并发布到 GitHub Pages。

## Cloudflare Pages

Root directory 留空，框架预设选择 `None`。

构建命令：

```bash
npm run build
```

输出目录：

```text
dist
```

Node.js 版本由仓库根目录的 `.node-version` / `.nvmrc` 固定为 `22.16.0`。
