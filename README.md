# 我的文档
所有文章存放在 blog 目录。

[进入文章目录](/blog/)

## 更新文章目录

新增或删除 `blog` 目录下的 `.md` 文件后，运行：

```bash
node scripts/update-blog-index.mjs
```

提交到 GitHub 后，GitHub Actions 会自动生成文章目录并发布到 GitHub Pages。
