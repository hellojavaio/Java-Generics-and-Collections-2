# 前言

《《《 [返回首页](./)

## 前言

`Java` 现在支持泛型，这是自从 `Java 1.2` 中增加内部类以来语言最重大的变化 - 有些人会说这是语言中最重大的变化。

假设你想处理列表。有些可能是整数列表，其他列表的字符串，还有其他列表的字符串列表。在泛型之前的`Java`中，这很简单。

你可以用同一个类来表示所有这三个类，名为`List`，它具有 `Object` 类的元素：

```text
list of integers List
list of strings List
list of lists of strings List
```

为了保持简单的语言，你必须自己完成一些工作：你必须跟踪你有一个整数列表（或字符串或字符串列表）的事实，并且当你从 列表你必须把它从对象转换回整数（或字 符串或列表）。

例如，泛型之前的集合框架广泛使用了这个习惯用法。

爱因斯坦被誉为说：“一切应该尽可能简单，但不要简单”。 有人可能会说上面的方法太简单了。

在使用泛型的 `Java` 中，您可以区分不同类型的列表：

```text
list of integers List<Integer>
list of strings List<String>
list of lists of strings List<List<String>>
```

现在编译器会跟踪你是否有一个整数列表（或者字符串或者字符串列表），并且不需要显式的返回整数（或者字符串或者 `List <String>`）。

在某些方面，这与 `Ada` 中的泛型或 `C++` 中的模板类似，但是实际的灵感来自函数式语言（如 `ML` 和 `Haskell`）中的参数多态。

本书的第一部分对泛型进行了全面的介绍。我们讨论泛型和子类型之间的相互作用，以及如何使用通配符和范围;我们描述了演变你的代码的技术;我们解释一下与演员阵 列有关的细微之处;我们处理高级主题，如泛型和安全性之间的交互，以及如何保持二进制兼容性;我们更新常见的设计模式来开发泛型。

有关泛型的文章已经写得很多，而且他们在 `Java` 中的引入引发了一些争议。当然，泛型的设计使它更复杂和动态化：易于演化的代码要求对象不具有描述泛型类型参 数的运行时信息，但是缺少这些信息会将一些你未注意的错误引入，诸如映射和数组创建等操作。对泛型进行权衡处理，解释如何利用自己的优势，解决弱点。第二部分 全面介绍了集合框架。牛顿被誉为说：“如果我看到比别人更远，那是因为我站在巨人的肩膀上”。最好的程序员依这个座右铭生活着，在适当的地方建立和现有的框架上 重用代码。 `Java` 集合框架为许多常见的集合类型提供了可重用的接口和实现，包括 `list`, `set`, `queue`, 和 `map`。还有一个比较值的框架，在排序或构建 有序的树时很有用\(翻注：`Tree`\)。 （当然，并不是所有的程序员都在重复使用，正如计算机科学家汉明所说：“我们不是站在彼此的肩膀上，而是站在彼此的脚趾 上。”）

由于泛型，使用集合的代码更容易阅读，编译器将捕获更多的类型错误。此外，集合提供了使用泛型的极好的例证。有人可能会说，泛型和集合是相互制造的，事实上， 集合的易用性是首先引入泛型的主要原因之一。

`Java5` 和 `Java6` 不仅更新集合框架以利用泛型，还以其他方式增强框架，引入接口和类来支持并发和新的枚举类型。我们相信这些发展标志着编程风格发生转变的 开始，更多地使用了集合框架，尤其是增加了对 `Array` 的使用。在第二部分中，我们从最初的原则来描述整个框架，以帮助您更有效地使用集合，标记 `Java5` 和 `Java6`的新功能。

按照通用术语，我们将 `Java` 的后续版本称为 `1.0` 版本到 `1.4`，然后是 `5` 和 `6`.我们说'泛型之前的Java'通过 `1.4` 来引用 `Java 1.0`，和“泛型的 Java”来指 `Java5` 和 `Java6`。

`Java` 泛型的设计受到以前许多方案的影响，特别是由 `Bracha`，`Odersky`，`Stoutamire` 和 `Wadler` 的 `GJ`; 增加通配符 `GJ`，由 `Igarashi` 和 `Viroli` 提出; 以及 `Torgersen`，`Hansen`，`Ernst`，`von derAhé`，`Bracha` 和 `Gafter` 的通配符的进一步发展。 在 `Java` 社区流程下由 `Bracha` 领导的团队，包括 `Odersky`，`Thorup` 和 `Wadler`（作为 `JSR14`和 `JSR201` 的一部分）进行了泛型的设计。`Odersky` 的 `GJ` 编译器是 `Sun` 当前的 `javac` 编译器的基础。

### 获取示例程序

本书中的一些示例程序可以在线获取:`ftp://ftp.oreilly.com/published/oreilly/javagenerics`

如果您无法通过网络直接获取示例，但可以发送和接收电子邮件，你可以使用ftpmail来获取它们。 为了帮助使用`ftpmail`,发送邮件到 `ftpmail@online.oreilly.com`,没有主题和消息正文中的单词“帮助”。

### 如何联系我们

您可以向发布者提出关于本书的评论和问题

```text
O’Reilly Media, Inc.
1005 Gravenstein Highway North
Sebastopol, CA 95472
(800) 998-9938 (in the United States or Canada)
(707) 829-0515 (international/local)
(707) 829-0104 (fax)
```

`O’Reilly` 有本书的网页，其中列出了勘误表和任何其他信息。您可以访问此页面：`http://www.oreilly.com/catalog/javagenerics`

对本书发表评论或提出技术问题，发送邮件到 `bookquestions@oreilly.com`

有关书籍，会议，软件，资源中心等的更多信息, `O'Reilly` 网络，请参阅 `O'Reilly` 网站: `http://www.oreilly.com`

### 本书中使用的约定

我们使用以下字体和格式约定,代码以固定宽度字体显示，粗体字用于强调

```java
class Client {
   public static void main(String[] args) {
       Stack<Integer> stack = new ArrayStack<Integer>();
       for (int i = 0; i<4; i++) stack.push(i);
       assert stack.toString().equals("stack[0, 1, 2, 3]");
   }
}
```

我们经常包含与适当的主要方法的主体相对应的代码：

```java
Stack<Integer> stack = new ArrayStack<Integer>();
for (int i = 0; i<4; i++) stack.push(i);
assert stack.toString().equals("stack[0, 1, 2, 3]");
```

当代码片段出现在段落中时（如我们在前面的项目中引用主要方法时），代码片段以固定宽度字体打印。

我们经常忽略标准的引入。 使用 `Java` 集合框架的代码或其他实用程序类应该在行之前：

```java
import java.util.*;
```

显示命令行输入和相应输出的示例交互式会话以等宽字体显示，用户提供的输入以一个百分号：

```text
% javac g/Stack.java g/ArrayStack.java g/Stacks.java l/Client.java
Note: Client.java uses unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
```

当用户提供的输入是两行时，第一行以反斜杠结束：

```text
  % javac -Xlint:unchecked g/Stack.java g/ArrayStack.java \
  % g/Stacks.java l/Client.java
  l/Client.java:4: warning: [unchecked] unchecked call
  to push(E) as a member of the raw type Stack
  for (int i = 0; i<4; i++) stack.push(new Integer(i));
```

### 使用代码示例

这本书是为了帮助你完成工作。一般来说，你可以在你的程序和文档中使用这本书的代码。你不需要联系我们除非你正在复制代码的重要部分。例如，编写一个使用本书 中几个代码块的程序并不需要

允许销售或分发 `O'Reilly` 书籍的 `CD-ROM` 例子需要许可。 引用这本书和引用的例子回答一个问题代码不需要权限。 包含大量的示例代码从本书到您的产品的 文档需要许可。

我们建议，但不要求，归属。 标题通常包括标题，作者，出版商和 `ISBN`。 例如：`Maurice`的“ `Java` 泛型和收藏” `Naftalin` 和 `Philip Wadler`。 `Copyright 2006 O'Reilly Media，Inc.，0-596-52775-6`。

如果您觉得您对代码示例的使用不属于合理使用或上述许可，随时联系 `permissions@oreilly.com`。

### Safari® 联机丛书

在您最喜爱的封面上看到 `Safari®` 联机丛书图标时技术书，那就意味着这本书可以通过网上获得 `O'Reilly` 网络 `Safari` 书架。

`Safari` 提供的解决方案比电子书更好。 这是一个虚拟类库，可以让你轻松搜索数以千计的高科技书籍，剪切和粘贴代码示例，下载章节，当您需要最准确，最新的 信息时，快速找到答案。 在 `http://safari.oreilly.com` 免费试用。

### 致谢

`sun` 公司（过去和现在）的人对回答我们的问题非常好。 他们总是乐于解释一个棘手的问题，或者仔细考虑设计的权衡。感谢 `Joshua Bloch`, `Gilad Bracha`, `Martin Buchholz`,`Joseph D. Darcy`, `Neal M.Gafter`, `Mark Reinhold`, `David Stoutamire`, `Scott Violet` 和 `Peter von der Ahé`.

与以下研究人员一起工作非常愉快 `Java` 的泛型设计：`Erik Ernst`, `Christian Plesner Hansen`, `Atsushi Igarashi`,`Martin Odersky`, `Mads Torgersen`,和 `Mirko Viroli`.

我们收到了一些人的意见和帮助。感谢：`Brian Goetz`,`David Holmes`,`Heinz M`.`Kabutz`,`Deepti Kalra`,`Angelika Langer`,`Stefan Liebeg`, `Doug Lea`, `Tim Munro`, `Steve Murphy` 和 `C K Shibin`.

我们喜欢阅读 `Heinz M. Kabutz` 的 `Java` 专家时事通讯和 `Angelika anger` 的 `Java` 泛型问答，都可以在线获得。

我们的编辑 `Michael Loukides` 总是乐于提供好的建议。 `WINDOWS` 软件公司的 `Paul C. Anagnostopoulos` 把我们的 `LATEX` 转换成了照相软件，`JeremyYallop` 制作了索引。

我们的家人让我们保持健康（疯狂）。爱他们，`Adam, Ben`, `Catherine`, `Daniel`, `Isaac`,`Joe`,`Leora`,`Lionel` 和 `Ruth`.

《《《 [下一节](di-yi-bu-fen-fan-xing/)   
 《《《 [返回首页](./)

