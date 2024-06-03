---
link: https://juejin.cn/post/7365830295394484243
title: 7 分钟了解 flatMap 的使用及实现原理，并实现一个简易版的 flatMap🥳 写毕业论文时手动获取 BibTex 太麻烦？用 nodejs 写了批量获取命令行工具记一次 win10 下的内存泄漏分析Node+Koa2从零搭建通用API服务——系列1html转图片
description: 命令模式是一种行为型设计模式，它可以将请求封装成一个对象，从而使调用操作的对象和执行操作的对象解耦。命令模式的核心思想是将请求封装成一个对象，从而使命令的发起者和执行者分离。
keywords: 前端,JavaScript,设计模式
author: 首页 首页 沸点 课程 直播 活动 竞赛 商城 App 插件 搜索历史 清空 创作者中心 写文章 发沸点 写笔记 写代码 草稿箱 创作灵感 查看更多 会员 登录 注册
date: 2024-05-07T08:46:56.000Z
publisher: 稀土掘金
stats: paragraph=107 sentences=50, words=366
---

> JavaScript 命令模式实战：打造可撤销的操作命令 - 掘金
>
> https://juejin.cn/post/7365830295394484243

## 一. 前言

在前端开发中，命令模式（Command Pattern）作为一种行为型设计模式，可以帮助我们将请求封装成一个对象，从而实现调用对象和执行对象之间的解耦，方便扩展和修改。

本文将和大家分享 JavaScript 中的命令模式，包括命令模式的定义、核心角色，以及在 JavaScript 中如何实现命令模式。

## 二. 什么是命令模式

### 1. 定义

命令模式是一种行为型设计模式，它可以将请求封装成一个对象，从而使调用操作的对象和执行操作的对象解耦。命令模式的核心思想是将请求封装成一个对象，从而使命令的发起者和执行者分离。

### 2. 核心角色

在命令模式中，通常包括以下几个核心角色：

- **命令接口（Command）**：定义了执行命令的方法，通常包括一个 `execute` 方法。
- **具体命令（Concrete Command）**：实现了命令接口，负责具体的命令执行。
- **调用者（Invoker）**：负责调用命令对象执行请求的对象。
- **接收者（Receiver）**：执行命令的请求操作。

命令模式通过将请求封装成一个对象，实现了命令的发起者和执行者的解耦，同时也支持命令的排队、记录、撤销等操作。

### 3. UML

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f939a9c4ba74811b5ecd0c232615991~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1066&h=514&s=46498&e=png&b=ffffff)

## 三. 实现方式

在 JavaScript 中，可以通过对象和函数的组合来实现命令模式。以下是一种简单的实现方式：

### 1. 定义命令接口

首先，定义一个命令接口，通常包括一个 `execute` 方法，用于执行命令。

```js
class Command {
  execute() {}
}
```

### 2. 定义具体命令

接下来，定义具体的命令，实现 `Command` 接口，并在 `execute` 方法中实现具体的命令逻辑。

```js
class ConcreteCommand extends Command {
  constructor(receiver) {
    super()
    this.receiver = receiver
  }

  execute() {
    this.receiver.action()
  }
}
```

### 3. 定义接收者

接收者负责执行实际的命令操作。

```js
class Receiver {
  action() {
    console.log('接收者执行命令')
  }
}
```

### 4. 定义调用者

调用者负责调用具体的命令对象，并执行命令。

```js
class Invoker {
  constructor(command) {
    this.command = command
  }

  executeCommand() {
    this.command.execute()
  }
}
```

### 5. 使用命令模式

最后，可以创建具体的命令对象、接收者对象和调用者对象，并使用命令模式来执行命令。

```js
const receiver = new Receiver()

const concreteCommand = new ConcreteCommand(receiver)

const invoker = new Invoker(concreteCommand)

invoker.executeCommand()
```

通过上述方式，我们实现了一个简单的命令模式示例。通过这种方式，可以实现命令的封装、调用者和接收者的解耦，以及支持命令的撤销和重做等操作。在实际应用中，我们还可以根据具体业务场景来设计和扩展命令模式，以提高代码的灵活性。

## 四. 简单的播放器应用

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c3fc783c7d84314bd1016c30bf9ea5b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=918&h=676&s=244569&e=png&b=f9f7f6)

下面是一个我在实际项目中使用命令模式的应用场景实例分析：

我们有一个简单的播放器应用，用户可以通过界面上的按钮来控制音乐的播放、暂停、上一首、下一首等操作。因此我选择使用命令模式来实现这个播放器应用，具体步骤如下：

### 1. 创建命令对象

```js
class PlayCommand {
  constructor(player) {
    this.player = player;
  }

  execute() {
    this.player.play();
  }
}

class PauseCommand {
  constructor(player) {
   .player = player;
  }

  execute() {
    this.player.pause();
  }
}

```

### 2. 创建接收者对象（播放器对象）

```js
class Player {
  play() {
    console.log('播放音乐')
  }

  pause() {
    console.log('暂停音乐')
  }
}
```

### 3. 创建调用者对象（按钮对象）

```js
class Button {
  constructor(command) {
    this.command = command
  }

  onClick() {
    this.command.execute()
  }
}

const player = new Player()
const playCommand = new PlayCommand(player)
const pauseCommand = new PauseCommand(player)

const playButton = new Button(playCommand)
const pauseButton = new Button(pauseCommand)

playButton.onClick()
pauseButton.onClick()
```

在上面的示例中，通过使用命令模式，我们实现了按钮与播放器之间的解耦，按钮只需要知道对应的命令对象，而不需要知道具体执行的逻辑。这样可以方便地扩展新的命令，并且可以更好地管理用户操作。

## 五. Canvas 绘图命令实现绘图与撤销

命令模式在前端开发中还有许多其他的应用场景，特别是在撤销操作等方面，通过把命令封装成对象，可以把不同的命令管理起来，带来更加灵活和可控的操作方式。

在 Web 绘图中，Canvas 是我们经常打交道的，Canvas 拥有非常多的 API，因此我们在使用中遗忘是不可避免的，所以使用命令模式可以将不同的绘制图形 API 封装成不同的命令对象，可以实现和具体操作之间的解耦。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e4a688b5c2d46d4b1cdf876d99ca4be~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=788&h=393&s=24857&e=gif&f=27&b=fefefe)

接下来我们来具体分析一下如何使用命令模式实现 Canvas 绘图与撤销的功能时，可以按照以下步骤进行：

### 1. 定义命令接口

首先定义一个命令接口，包括执行命令(`execute`)和撤销命令(`undo`)两个方法。

```js
class Command {
  execute() {}
  undo() {}
}
```

### 2. 编写具体命令类

编写继承自命令接口的具体命令类，例如绘制矩形命令。

```js
class DrawRectCommand extends Command {
  constructor(canvas) {
    super()
    this.canvas = canvas
  }

  execute() {}

  undo() {}
}

class DrawCircleCommand extends Command {
  constructor(canvas) {
    super()
    this.canvas = canvas
  }

  execute() {}

  undo() {}
}
```

### 3. 创建命令队列

创建一个命令队列，用于存储执行的命令，以便实现撤销操作。

```js
class CommandQueue {
  constructor() {
    this.commands = []
  }

  addCommand(command) {
    this.commands.push(command)
  }

  executeCommands() {
    this.commands.forEach((command) => command.execute())
  }

  undoCommands() {
    this.commands.reverse().forEach((command) => command.undo())
  }
}
```

### 4. 实例化绘图功能

在 Canvas 绘图应用中，实例化绘图命令以及命令队列，并根据用户操作执行或者撤销命令。

```js
const canvas = document.getElementById('canvas')
const drawRectangleCommand = new DrawRectangleCommand(canvas)
const drawCircleCommand = new DrawCircleCommand(canvas)
const commandQueue = new CommandQueue()

commandQueue.addCommand(drawRectangleCommand)
commandQueue.executeCommands()

commandQueue.addCommand(drawCircleCommand)
commandQueue.executeCommands()

commandQueue.undoCommands()
```

通过以上步骤，可以利用命令模式来实现 Canvas 绘图与撤销的功能。当用户执行绘图操作时，将对应的命令存储在命令队列中，用户可以随时撤销之前的操作，实现了绘图与撤销的功能。同时你也可以根据业务需求继续完善更加复杂的绘图操作等。

码上掘金演示效果如下：

## 六. 优缺点

通过以上的了解和学习，我们能够清楚的知道命令模式作为一种设计模式，主要作用是将请求封装成一个对象，以便于解耦具体实现，我们调用者其实不关心实现，只关心具体的命令即可。那么它也有一些缺点，下面我来具体分析一下命令模式的优缺点：

### 1. 优点

1. **解耦请求发送者和请求接收者**：命令模式可以将请求发送者和请求接收者解耦，发送者不需要知道接收者的具体实现，只需通过命令对象发送请求。
2. **容易扩展新命令**：由于命令模式将每个请求操作封装成一个对象，因此在需要新增新命令时，只需要新增一个相应的命令类，而无需修改现有的代码。
3. **支持撤销和重做操作**：通过记录命令历史，可以轻松实现请求的撤销和重做操作，增强了系统的灵活性。
4. **支持命令队列**：可以将命令对象保存在队列中，按照一定的顺序执行，实现批处理等功能。
5. **易于实现日志和事务系统**：通过记录执行的命令日志，可以实现日志记录和事务回滚等功能。

### 2. 缺点

1. **可能会产生大量的具体命令类**：如果系统中具有大量的命令操作且每个命令需要单独实现一个具体命令类，可能会导致类的数量过多，增加系统复杂度。
2. **增加了系统的复杂度**：引入命令模式会增加额外的类和对象，可能会使系统结构更加复杂，不适合简单的业务场景。
3. **适用范围有限**：命令模式适用于需要请求发送者和接收者解耦、支持撤销重做等场景，对于简单的请求操作可能显得过于繁琐。

综上所述，命令模式在一些特定的场景下能够发挥其优势，如需支持撤销重做、命令队列等功能时，命令模式是一个不错的选择。但在简单的业务场景或对性能要求较高的场景下，可能并不适合采用命令模式。在实际应用中，需要根据具体情况来评估是否使用命令模式。

## 七. 总结

命令模式是一种行为设计模式，它的核心思想是将请求封装成一个对象，从而使得调用者和接收者解耦。接收者是真正执行命令的对象，而调用者则只需要调用命令对象的方法，而不需要知道具体的实现细节。

实现命令模式的关键通常包括以下几个核心角色：

- **命令接口（Command）**：定义了执行命令的方法，通常包括一个 `execute` 方法。
- **具体命令（Concrete Command）**：实现了命令接口，负责具体的命令执行。
- **调用者（Invoker）**：负责调用命令对象执行请求的对象。
- **接收者（Receiver）**：执行命令的请求操作。

但是，命令模式也有一些缺点，如果我们的代码不规范可能会导致大量的具体命令类，增加系统复杂度，导致执行效率变低，因此在实际应用中，需要根据具体情况来评估是否使用命令模式。

> 本文正在参加金石计划征文活动，如果本文对您有帮助，麻烦点点关注，点点赞，感谢！
