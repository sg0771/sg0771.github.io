# Claude Code 和 Codex 对接国内模型教程

很多人想学 AI 编程，想耍一耍目前最流行的 Claude Code 和 Codex 编程工具，结果一上手就卡在了第一步。

要么没有国外的订阅账号，登录都登录不上；要么好不容易开通了，发现官方额度死贵，对话一会儿额度就耗光了；再加上时不时还有封号的风险，整的提心吊胆。

咱们怎么能因为「用不了工具」这种事，就把学 AI 编程的劲头给浇灭了呢！

其实 Claude Code 和 Codex 都支持切换模型，咱们用国内的大模型（比如 DeepSeek、Qwen、智谱 GLM）来驱动它们就行，量大管饱，不用魔法，也不怕封号。

这篇文章我就手把手教你，用一个开源神器 **CC Switch**，几分钟带你把国内模型接到 Claude Code 和 Codex 里。我会以 DeepSeek 为例，看完你就能跑通整套流程，想换哪家模型都是一样的操作。

点个收藏，咱们开始~



## CC Switch 是什么

Claude Code、Codex 这些命令行工具，每一个的配置格式都不一样。如果你想给它们换个模型供应商，得自己去翻文档，手动编辑 JSON、TOML 或者 `.env` 文件，填一堆 Base URL、API Key、模型名之类的参数。说不定改错一个字符就跑不起来，想在几个模型之间来回切换就更麻烦了。。。

CC Switch 就是来解决这个痛点的。它是一个免费开源的跨平台桌面工具，用一个可视化界面统一管理 Claude Code、Codex、Gemini CLI、OpenCode 等多个 AI 编程工具的配置。

> 开源指路：[https://github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)

![](https://pic.yupi.icu/1/1780312934749-a570e124-074c-40fe-924b-5f9719e45e56.png)

CC Switch 内置了 50 多个供应商预设，DeepSeek、Qwen、Kimi、智谱 GLM、MiniMax 这些都有，你不用自己手动改配置文件，点几下就能一键切换模型，还能从系统托盘里快速切换。

![](https://pic.yupi.icu/1/image-20260601193909067.png)

下面我就用它来带大家实操一遍。



## 安装 CC Switch

到 [CC Switch 官网](https://ccswitch.io) 或者 [GitHub Releases 页面](https://github.com/farion1231/cc-switch/releases/latest)，根据你的操作系统选择对应的安装方式。

![](https://pic.yupi.icu/1/1780310254037-fb0cd631-17e9-45cf-b1c2-963d18cbf99d.png)

Mac 用户推荐直接用 Homebrew 一行命令安装，装完直接就能用：

```bash
brew install --cask cc-switch
```

![](https://pic.yupi.icu/1/1780310254160-ed387f10-f656-429f-a41d-8e288b8e3be2.png)

Windows 用户从 Releases 页面下载 `.msi` 安装包，双击运行即可；Linux 用户根据发行版选择 `.deb`、`.rpm` 或 `.AppImage`。

安装完成后启动 CC Switch，主界面会出现在桌面或者系统托盘里。

下面我们就分别给 Claude Code 和 Codex 接上 DeepSeek 了。不过在那之前，得先把 DeepSeek 的 API Key 准备好。



## 准备大模型 API Key

不管接哪个工具，都得先有一个 DeepSeek 的 API Key。

到 [DeepSeek 开放平台](https://platform.deepseek.com) 注册登录，进入 API keys 页面，点击创建一个新的 key。

![](https://pic.yupi.icu/1/image-20260601194058029.png)

注意，key 只会在创建时完整显示这一次，记得当场复制保存好，后面在 CC Switch 里要用到它。



## 把 DeepSeek 接入 Claude Code

我们先从简单的 Claude Code 开始。



### 先装好 Claude Code

简单介绍一下 Claude Code。它是 Anthropic 推出的 AI 编程工具，直接在终端里运行，你跟它聊天描述需求，它就能自主分析项目、写代码、跑命令、修 Bug，全程自主执行。

![](https://pic.yupi.icu/1/1780310254072-69c9a86c-ede2-40e7-807c-13684461d4c2.png)

安装 Claude Code 很简单，先确保电脑里有 Node.js 环境，没有的话去 [Node 官网](https://nodejs.org/en/download) 下个傻瓜式安装包。然后一行命令搞定：

```bash
npm install -g @anthropic-ai/claude-code
```

装好后在终端输入 `claude` 就能进入对话界面，首次使用需要登录。但很多同学没有 Anthropic 的官方账号，登录这步就卡住了，根本没法直接用。

别急，下面就用 CC Switch 把它切换成 DeepSeek。



### 用 CC Switch 切换模型

打开 CC Switch，在顶部应用栏选择 **Claude**，然后点击「添加供应商」：

![](https://pic.yupi.icu/1/1780310658228-ffa4ff69-342c-4244-82e3-2204dad61e97.png)

在预设的模型供应商列表里选择 **DeepSeek**：

![](https://pic.yupi.icu/1/1780310679329-e280982b-da09-4f4e-8861-d943f39f17ed.png)

接下来填写刚才在 DeepSeek 开放平台创建好的 API Key：

![](https://pic.yupi.icu/1/1780310750547-43515207-6f23-45b7-a62f-56370070da4f.png)

其余字段基本不用动，CC Switch 的 DeepSeek 预设已经帮你把模型都配好了，里面内置了 DeepSeek-V4-Pro 和 DeepSeek-V4-Flash 两个版本，主模型默认就是 Pro，相比 Flash，它的 Agent 能力和复杂推理更强，更适合写代码。

如果你想用上 DeepSeek V4 的百万 tokens 超长上下文，还能在这里直接勾选开启 1M 模式，告诉 Claude Code 这个模型能吃下这么长的上下文，不用自己去改配置。

![](https://pic.yupi.icu/1/1780310818585-ecfe1960-f1cd-4a31-a1e7-f1da199c17d9.png)

填完点右下角的「添加」按钮。这里能看到 Claude Code 的 JSON 配置文件，CC Switch 干的活儿就是帮你可视化地修改它，省去手动编辑的麻烦。

![](https://pic.yupi.icu/1/1780310894533-0153954b-e19f-4e96-93a5-de8208e08c01.png)

最后点击启用 DeepSeek 模型：

![](https://pic.yupi.icu/1/1780310914775-338bbb35-872d-46ad-9cbf-5731341a3942.png)

重新进入 Claude Code，左上角能看到当前用的模型。我们让它自报家门，输入一句：你是什么模型？

AI 能正常给出回复，就说明切换成功了：

![](https://pic.yupi.icu/1/1780311048597-711eca09-fe5c-4d0a-bb01-7c9bbfcb033c.png)

你可能会发现，用 CC Switch 给 Claude Code 接 DeepSeek，整套流程格外简单。这是因为 DeepSeek 提供了兼容 Anthropic 协议的接口，而 Claude Code 本身就是按这个协议来通信的，CC Switch 直接把配置写进 `settings.json` 就能用了。



## 二、把 DeepSeek 接到 Codex

搞定 Claude Code，我们再来看 Codex。它是 OpenAI 推出的 AI 编程工具，最近的热度堪称炸裂。

![](https://pic.yupi.icu/1/1780311345253-521a8636-47ec-4d53-bb1a-e350748e2085-20260601194352039.png)

Codex 有两种形态，一种是在终端里跑的命令行版 Codex CLI，一种是带图形界面的桌面 APP。

命令行版的安装方式跟 Claude Code 类似，一行命令就能搞定：

```bash
npm install -g @openai/codex
```

装好后在终端输入 `codex` 就能进入对话界面，首次使用同样需要登录 OpenAI 账号。没有账号的话，就要用 CC Switch 来切换模型。

![](https://pic.yupi.icu/1/1780311431037-8b655299-d1f1-4ff5-a845-988c0980c4ca.png)

至于 Codex 桌面 APP 的安装和基础玩法，前段时间我刚出过一套《保姆级的视频 + 图文教程》，需要的同学直接到我的 [鱼皮 AI 导航](https://ai.codefather.cn/library/2058749249474023425) 自取：

![](https://pic.yupi.icu/1/image-20260601194545597.png)



### Codex 接入原理

既然 Codex 的配置都放在 `~/.codex/config.toml` 这个文件里，那我直接把里面的接口地址 `base_url` 改成 DeepSeek 的不就行了？

能想到这说明你很聪明，但是这么干大概率会翻车，直接给你报一个 404 错误。

问题出在协议上。Codex 用的是 OpenAI 的 **Responses API**，而 DeepSeek 这些国内模型走的是 **Chat Completions API**，这俩压根儿不是一套东西。就好比你打电话，号码是拨通了，可你说中文、对方只懂法语，照样聊不到一块儿去。

![](https://pic.yupi.icu/1/01_%E7%94%B5%E8%AF%9D%E6%AF%94%E5%96%BB-%E5%8D%8F%E8%AE%AE%E6%A0%BC%E5%BC%8F%E4%B8%8D%E9%80%9A_compressed_v2.png)

所以 Codex 接国内模型，关键在于中间得有个「翻译」，把 Codex 发出的请求转换成 DeepSeek 能听懂的格式。

好在 CC Switch 已经把这件事给我们办妥了。它的「本地路由」功能会在你电脑上起一个轻量级的代理服务，请求的流转过程是这样的：

```plain
Codex → CC Switch → DeepSeek → CC Switch → Codex
```

整个转发对 Codex 完全透明，它自己还以为在访问 OpenAI 官方接口呢，实际上请求已经被 CC Switch 偷偷转给 DeepSeek 了。这样既保留了 Codex 的原汁原味体验，又能用上便宜的国内模型，岂不美哉？

![](https://pic.yupi.icu/1/02_CC_Switch%E6%9C%AC%E5%9C%B0%E8%B7%AF%E7%94%B1%E5%8D%8F%E8%AE%AE%E8%BD%AC%E6%8D%A2%E6%B5%81%E7%A8%8B_compressed_v3.png)



### 用 CC Switch 配置

打开 CC Switch，在顶部应用栏切换到 **Codex**，点击「添加供应商」：

![](https://pic.yupi.icu/1/1780311605982-1c994d40-c7f4-48df-817c-bed2b6c31fab.png)

在预设里搜索并选择 **DeepSeek**，跟前面给 Claude Code 配置时的步骤一样：

![](https://pic.yupi.icu/1/1780311659008-be813d0f-d761-435f-a7cb-a74899214864.png)

填入你的 DeepSeek API Key，其余字段保持默认：

![](https://pic.yupi.icu/1/1780311678381-5d244f5c-6943-43ba-a6c3-a2a29960d907.png)

跟 Claude Code 一样，模型这些 CC Switch 都已经预设好了，其他字段不用动。

要特别注意的是，这一步的关键是得 **开启「本地路由映射」**，然后点右下角的「添加」按钮保存就好。

![](https://pic.yupi.icu/1/1780311713574-2317e9a2-ece4-4c4d-a188-4d6735402c6a.png)

回到主页后，选择启用 DeepSeek：

![](https://pic.yupi.icu/1/1780311910051-908552fe-d168-4df1-9a08-3c9e6f1e4d0d.png)

但是到目前为止，我们还不能在 Codex 中正常使用 DeepSeek，对话会直接报前面说的 404 错误：

![](https://pic.yupi.icu/1/1780311879234-642050c1-2333-4d8e-866d-1abc9197d7dd.png)



### 开启本地路由

切换到 DeepSeek 后，系统会提示你开启路由。点击左上角的「设置」按钮进入设置页面：

![](https://pic.yupi.icu/1/1780311968017-bf4e43f6-736e-4ba7-9ce9-5a9ca2763910.png)

找到路由设置菜单，把本地路由的「路由总开关」打开，然后选择启用 Codex 路由：

![](https://pic.yupi.icu/1/1780312030888-cdfafb55-0a3f-4fd7-bdc5-785eb3cd9bc8.png)

这一步就是让 CC Switch 的本地代理正式接管 Codex 的请求，前面说的协议转换全靠它。

大功告成！

重新打开 Codex CLI，就能看到已经切换为 DeepSeek 模型了。同样让它自报家门，能正常对话就说明切换成功了：

![](https://pic.yupi.icu/1/1780312108872-2c760023-290a-4e7a-b8d0-be36159900da.png)

你会发现，AI 嘴上还说自己是基于 GPT-5 的 Codex。这是因为 Codex 会给模型注入一套自己的系统提示词，让它默认以为自己是官方模型，但实际干活的底层已经换成 DeepSeek 了。

再来试试 Codex 桌面 APP。因为它和命令行版共用 `~/.codex` 这套配置，CC Switch 切换之后直接打开就能用，同样问它是什么模型，底层跑的也是 DeepSeek：

![](https://pic.yupi.icu/1/1780312248394-f117f7bb-1372-4a73-91e7-2b6c171cef6f.png)

如果想改回来，反向操作即可，把路由关掉、再启用默认配置就行：

![](https://pic.yupi.icu/1/1780312343473-b43668a4-cb80-4f60-8fce-e7aa93e7753e.png)

怎么样，是不是比想象中简单多了？

可能你已经买了其他平台的 Coding Plan，比如智谱 GLM、Qwen、Kimi、MiniMax 等等。

想对接别家大模型的话，操作几乎一模一样。在 CC Switch 里选对应的供应商预设（没有预设就自定义一个），把人家给你的专属 Base URL 和 API Key 填进去就行。对接 Claude Code 能直接生效，对接 Codex 时记得同样开启本地路由。



## 最后哔哔

看到这里你会发现，现在学 AI 编程的门槛真的低到不能再低了。

一个开源工具 + 国内大模型，几分钟就能把官方收费、还要魔法的 Claude Code、Codex 跑起来，成本可能就是官方的零头。说真的，工具和模型都不该成为你学习路上的拦路虎。

所以别再用「我没账号、用不起」当借口了，配好环境，赶紧上手把工具用起来才是。



## 写在最后

这篇文章手把手带大家用 CC Switch 把国内大模型（以 DeepSeek 为例）接入了 Claude Code 和 Codex，从安装工具到配置模型再到开启路由，几分钟就能跑通。

学会了这些内容，你就能用便宜的国内模型来驱动主流 AI 编程工具，不用再因为账号和成本问题而止步不前。

如果你想继续学习 AI 编程的更多实战技巧，可以阅读本教程经验技巧板块的其他文章。
