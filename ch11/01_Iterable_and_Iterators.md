《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](00_Preliminaries.md)

### 可迭代和迭代器

迭代器是实现接口迭代器的对象

```java
public Iterator<E> {
  boolean hasNext(); // 如果迭代有更多元素，则返回true
  E next(); // 返回迭代中的下一个元素
  void remove(); // 删除迭代器返回的最后一个元素
}
```

迭代器的目的是提供一种统一访问集合元素的方法，因此无论您处理什么类型的集合，并且实现它们，您总是会知道如何依次处理元素。 这曾经需要一些相当笨拙的代
码; 例如，在较早版本的 `Java` 中，您可以编写以下内容来打印集合内容的字符串表示形式：

```java
// coll是指实现Collection的对象
// ----- 不是Java 5的首选成语 -------
for (Iterator itr = coll.iterator() ; itr.hasNext() ; ) {
  System.out.println(itr.next());
}
```

这个奇怪的声明是 `Java 5` 之前的首选语言，因为通过将itr的范围限制在循环体中，它消除了在其他地方意外使用它的可能性。 这段代码的工作原理是任何实现 
`Collection` 的类都有一个迭代器方法，该方法返回适合于该类对象的迭代器。 它已不再是已批准的惯用语，因为 `Java 5` 引入了更好的东西：`foreach` 语句，
您在第I部分中遇到了。使用`foreach`，我们可以更简洁地编写前面的代码：

```java
for (Object o : coll) {
  System.out.println(o);
}
```

这段代码可以与任何实现接口 `Iterable` 的任何东西一起工作 - 也就是说任何可以产生 `Iterator` 的东西。 这是 `Iterable` 的声明:

```java
public Iterable<T> {
  Iterator<T> iterator(); // 在类型T的元素上返回一个迭代器
} 
```

在 `Java 5` 中，`Collection` 接口用于扩展 `Iterable`，所以任何 `set`，`list` 或 `queue` 都可以成为 `foreach` 的目标，就像数组一样。 如果您编写
自己的 `Iterable` 实现，那么也可以使用 `foreach`。 例 `11-1` 给出了 `Iterable` 如何直接实现的一个小例子。 `Counter` 对象用 `Integer` 对象的计数
进行初始化; 它的迭代器以响应 `next()` 的调用的升序返回这些值。

现在，`Counter` 对象可以成为 `foreach` 语句的目标：

```java
int total = 0;
for (int i : new Counter(3)) {
  total += i;
}
assert total == 6;
```

在实践中，以这种方式直接实现 `Iterable` 是很不寻常的，因为 `foreach` 最常用于数组和标准集合类。

框架-`ArrayList`，`HashMap` 等通用集合的迭代器可以通过从单线程代码抛出 `ConcurrentModificationException` 来困扰新手用户。当这些迭代器检测到它们
派生的集合已经在结构上发生了变化（广义地说，这些元素已被添加或删除）时，这些迭代器会抛出此异常。这种行为的动机是迭代器被实现为其底层集合的视图，因
此，如果该集合在结构上发生了变化，则迭代器可能无法在到达集合的已更改部分时继续正常运行。通用集合框架迭代器可以快速失败，而不会让失败的表现延迟，使诊
断变得困难。快速迭代器的方法检查自上次迭代器方法调用后，底层集合没有被结构性更改（由另一个迭代器或集合本身的方法）。如果他们检测到更改，则会抛出 
`ConcurrentModificationException`。虽然这个限制排除了一些合理的程序，但它排除了更多不合适的程序。

例11-1。直接实现 `Iterable`

```java
class Counter implements Iterable<Integer> {
  private int count;
  public Counter(int count) { 
    this.count = count; 
  }
  public Iterator<Integer> iterator() {
    return new Iterator<Integer>() {
      private int i = 0;
      public boolean hasNext() { 
        return i < count; 
      }
      public Integer next() { 
        i++; 
	return i; 
      }
      public void remove(){
        throw new UnsupportedOperationException(); 
      }
    };
  }
}
```

并发集合有处理并发修改的其他策略，例如弱一致的迭代器。 我们在第 `11.5` 节更详细地讨论它们。

《《《 [下一节](02_Implementations.md)      <br/>
《《《 [返回首页](../README.md)
