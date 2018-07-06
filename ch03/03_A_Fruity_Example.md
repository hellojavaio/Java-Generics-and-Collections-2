《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](02_Maximum_of_a_Collection.md)

### 水果相关示例

`Comparable <T>` 接口可以很好地控制可以和不可以比较的内容。确保我们有一个带有 `Apple` 和 `Orange` 子类的 `Fruit` 类。 根据我们的设置，我们可能会
禁止苹果与橘子进行比较，或者我们可能允许进行比较。

例 `3-2` 禁止苹果与橘子的比较。 以下是它声明的三个类：

```java
class Fruit {...}
class Apple extends Fruit implements Comparable<Apple> {...}
class Orange extends Fruit implements Comparable<Orange> {...}
```

每个水果都有一个名称和一个大小，如果两个水果具有相同的名称和大小，则两个水果相等。 遵循良好的做法，我们还定义了一个 `hashCode` 方法，以确保相同的对
象具有相同的哈希码。 通过比较苹果的大小来比较苹果，橙子也是如此。 自 `Apple` 实现了接口 `Comparable<Apple>` 很明显，你可以比较苹果和苹果，但不能与
橙子比较。 测试代码建立三个列表，其中一个是苹果，一个是橘子，另一个是混合水果。 我们可能会发现前两个列表中的最大值，但试图在编译时查找混合列表的最大
值表示错误。

例 `3-1` 允许比较苹果和橙子。 将这三个类声明与以前给出的类声明进行比较（突出显示示例示例 `3-2` 和示例 `3-1` 之间的所有区别）：

```java
class Fruit implements Comparable<Fruit> {...}
class Apple extends Fruit {...}
class Orange extends Fruit {...}
```

和以前一样，每个水果都有一个名字和一个大小，如果两个水果有相同的名字和相同的大小，它们是相等的。 现在通过忽略他们的名字和比较他们的大小来比较任何两种
水果。 由于 `Fruit` 实现了 `Comparable <Fruit>`，所以可以比较任何两个水果。 现在测试代码可以找到所有三个列表中的最大值，包括将苹果与橙子混合在一起
的列表。

回想一下，在上一节的结尾，我们继承了 `compareTo` 的类型签名以使用 `super`：

```java
<T extends Comparable<? super T>> T max(Collection<? extends T> coll)
```

第二个例子说明了为什么需要这个通配符。 如果我们想比较两个桔子，我们在前面的代码中将T代入橙色：

```java
Orange extends Comparable<? super Orange>
```

这是事实，因为以下两点都成立：

```java
Orange extends Comparable<Fruit> and Fruit super Orange
```

如果没有 `super` 通配符，查找 `List <Orange>` 的最大值将是非法的，即使找到 `List <Fruit>` 的最大值是允许的。

还要注意这里使用的自然顺序与等号不一致（参见第 `3.1` 节）。 两个不同名字但大小相同的水果比较相同，但它们并不相同。

《《《 [下一节](04_Comparator.md)      <br/>
《《《 [返回首页](../README.md)
