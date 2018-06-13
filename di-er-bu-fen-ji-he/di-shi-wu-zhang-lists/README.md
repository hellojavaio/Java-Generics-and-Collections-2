# 第十五章\(Lists\)

《《《 [返回首页](../../)   
 《《《 [上一节](../di-shi-si-zhang-queues/14.5-bi-jiao-dui-lie-shi-xian.md)

## Lists

列表可能是实践中使用最广泛的 `Java` 集合。 一个列表是一个集合，与集合不同 - 它可以包含重复项，而不像一个队列 - 可以使用户完全可见并控制其元素的排序。

集合框架接口是 `List`（请参见图 `15-1`）。除了从 `Collection` 继承的操作外，`List` 接口还包含以下操作：

![](../../.gitbook/assets/15_1.png)

图 `15-1`. `List`

**位置访问**方法，根据它们在数字中的位置访问元素

```java
   void add(int index, E e) // 在给定索引处添加元素e
   boolean addAll(int index, Collection<? extends E> c) // 在给定索引处添加c的内容
   E get(int index)       // 返回具有给定索引的元素
   E remove(int index)    // 删除具有给定索引的元素
   E set(int index, E e)  // 用e替换给定索引的元素
```

**搜索**列表中搜索指定对象并返回其数字位置的搜索方法。 如果对象不存在，则这些方法返回 `-1`：

```java
   int indexOf(Object o)     // o的第一次出现的返回索引
   int lastIndexOf(Object o) // 返回最后一次出现的索引
```

**范围视图**一种获取列表范围视图的方法：

```java
   List<E> subList(int fromIndex, int toIndex) // 返回列表的一部分视图
```

方法 `subList` 的工作方式与 `SortedSet` 上的 `subSet` 操作类似（参见 `13.2` 节），但使用列表中元素的位置而不是它们的值：返回的列表包含从 `fromIndex` 开始的列表元素，直到但不包括 `toIndex`。 返回的列表没有单独的存在 - 它只是从中获取它的列表的一部分的视图，因此其中的更改反映在原始列表中。 但是，与 `subSet` 有一个重要的区别， 您对子列表所做的更改会写入后备列表，但反过来并不总是如此。 如果通过直接调用其中一个“结构更改”方法（第 `12.1` 节）将元素插入到支持列表或从支持列表中删除，则任何后续使用该子列表的尝试都将导致 `ConcurrentModificationException` 异常。

**listIterator** 返回 `ListIterator` 的方法，它是一个具有扩展语义的 `Iterator`，以利用列表的顺序特性：

```java
   ListIterator<E> listIterator() // 为此列表返回一个ListIterator，最初位于索引0处
   ListIterator<E> listIterator(int indx) // 为此列表返回一个ListIterator，最初位于index indx
```

`ListIterator` 添加的方法支持以相反顺序遍历列表，更改列表元素或添加新元素，并获取迭代器的当前位置。`ListIterator` 的当前位置始终位于两个元素之间，因此在长度为n的列表中，有 `n + 1` 个有效列表迭代器位置，从 `0`（第一个元素之前）到 `n`（最后一个之后）。`listIterator` 的第二个重载使用提供的值将 `listIterator` 的初始位置设置为这些位置之一（调用没有参数的 `listIterator` 与提供参数 `0` 相同）

向 `Iterator` 方法 `hasNext`，`next` 和 `remove`，`ListIterator` 添加以下方法：

```java
   public interface ListIterator<E> extends Iterator<E> {
     void add(E e);             // 将指定的元素插入列表中
     boolean hasPrevious();     // 如果此列表迭代器具有相反方向的其他元素，则返回true
     int nextIndex();             // 返回下一次调用返回的元素的索引
     E previous();                 // 返回列表中的前一个元素
     int previousIndex();         // 返回后续调用返回的元素索引
     void set(E e);             // 用指定的元素替换next或previous返回的最后一个元素
   }
```

![](../../.gitbook/assets/15_1%20%281%29.png)

图 `15-2`. `ListIterator` 操作

图 `15-2` 显示了三个元素的列表。考虑位置 `2` 处的迭代器，它可以从其他位置移动，或者通过调用 `listIterator(2)` 创建。这个迭代器的大部分操作的效果是直观的;在当前迭代器位置（位于索引 `1` 和 `2` 之间的元素之间）添加插入元素，`hasPrevious` 和 `hasNext` 返回 `true`，`previous` 和 `next` 分别返回索引 `1` 和 `2` 处的元素，而 `previousIndex` 和 `nextIndex` 自身返回这些索引。在列表的极端位置，图中的 `0` 和 `3`，`previousIndex` 和 `nextIndex` 分别返回 `-1` 和 `3`（列表的大小），分别返回前一个或下一个，将引发 `NoSuchElementException`。

操作设置和删除工作的方式不同。它们的效果不取决于迭代器的当前位置，而是取决于它的“当前元素”，使用下一个或上一个遍历的最后一个：`set` 替换当前元素，`remove` 将其删除。如果没有当前元素，或者因为迭代器刚刚创建，或者因为当前元素已被删除，这些方法将抛出 `IllegalStateException`。

《《《 [下一节](15.1-shi-yong-list-de-fang-fa.md)   
 《《《 [返回首页](../../)

