《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](03_Wrappers.md)

### 其他方法

`Collections` 类提供了许多实用方法，其中一些我们已经看到使用。 我们在这里按字母顺序审查它们。

**addAll**

```java
   <T> boolean addAll(Collection<? super T> c, T... elements) // 将所有指定的元素添加到指定的集合中。
```

我们已经多次使用这种方法作为初始化具有单独元素的集合或数组内容的方便和有效的方式。

**asLifoQueue**

```java
   <T> Queue<T> asLifoQueue(Deque<T> deque) // 返回 Deque 作为后进先出（Lifo）队列的视图。
```

回顾第 `14` 章，虽然队列可以对其元素施加各种不同的排序，但没有提供 `LIFO` 排序的标准队列实现。另一方面，排队实现都支持 `LIFO` 排序，如果元素从出列队列的同一端移除因为他们被添加。`asLifo` `Queue` 方法允许您通过简洁的 `Queue` 界面使用此功能。

**disjoint**

```java
   boolean disjoint(Collection<?> c1, Collection<?> c2) // 如果 c1 和 c2 没有共同的元素，则返回 true
```

使用这种方法需要小心; 实现可以迭代两个集合，在另一个集合中测试一个元素用于包含。 因此，如果两个集合以不同方式确定包含，则此方法的结果是未定义的。例如，如果一个集合是一个 `SortedSet`，其中包含是由自然顺序或比较器决定的，另一个集合是一个集合，其中包含由其元素的 `equals` 方法决定，则可能出现这种情况。

**enumeration**

```java
   <T> Enumeration<T> enumeration(Collection<T> c) // 返回指定集合上的枚举
```

这个方法提供了与 `API` 的互操作，这些 `API` 的方法接受 `Enumeration` 类型的参数，这是 `Iterator` 的一个传统版本。 它返回的 `Enumeration` 与 `C` 提供的 `Iterator` 以相同的顺序产生相同的元素。 此方法与方法列表形成一对，方法列表将 `Enumeration` 值转换为 `ArrayList`。

**frequency**

```java
   int frequency(Collection<?> c, Object o) // 返回 c 中等于 o 的元素数目
```

如果提供的值 `o` 为空，则频率返回集合 `c` 中的空元素数。

**list**

```java
   <T> ArrayList<T> list(Enumeration<T> e) // 返回一个 ArrayList，其中包含由指定的 Enumeration 返回的元素
```

提供此方法的 `API` 与其方法返回 `Enumeration` 类型（`Iterator` 旧版本）的结果的 `API` 互操作。 它返回的 `ArrayList` 包含与 `e` 提供的相同顺序的相同元素。 此方法与枚举方法形成一对，该枚举将框架集合转换为 `Enumeration`。

**newSetFromMap**

```java
   <E> Set<E> newSetFromMap(Map<E, Boolean> map) // 返回由指定 map 支持的集合。
```

正如我们前面看到的，许多集合（如 `TreeSet` 和 `NavigableSkipListSet`）都是由映射实现的，并共享其排序，并发性和性能特征。 然而，某些地图（如 `WeakHashMap` 和 `IdentityHashMap`）没有标准的 `Set` 等价物。`newSetFromMap` 方法的目的是为这些地图提供等效的 `Set` 实现。`newSetFromMap` 方法包装其参数，该参数在提供时必须为空，并且不应直接访问。 此代码显示了使用它创建弱 `HashSet` 的标准习惯用法，其中元素通过弱引用保存：

```java
   Set<Object> weakHashSet = Collections.newSetFromMap(new WeakHashMap<Object, Boolean>());
```

**reverseOrder**

```java
   <T> Comparator<T> reverseOrder() // 返回一个反转自然顺序的比较器
```

此方法提供了一种按照自然顺序排序或维护 `Comparable` 对象集合的简单方法。 这是一个使用的例子：

```java
   SortedSet<Integer> s = new TreeSet<Integer>(Collections.reverseOrder());
   Collections.addAll(s, 1, 2, 3);
   assert s.toString().equals("[3, 2, 1]");
```

这种方法还有另一种形式。

```java
   <T> Comparator<T> reverseOrder(Comparator<T> cmp)
```

此方法与前一个方法相似，但不是颠倒对象集合的自然顺序，而是颠倒比较器作为其参数提供的顺序。 它提供 `null` 的行为对于 `Collections` 类的方法来说是不寻常的。`Collections` 的约定指出，如果提供给它们的集合或类对象为 `null`，则它的方法抛出 `NullPointerException`，但如果此方法提供 `null`，则返回与 `reverseOrder()` 的调用相同的结果 - 也就是说，它返回一个 `Comparator`，它颠倒了一组对象的自然顺序。

结论这完成了我们对由 `Collections` 类提供的便捷方法的介绍，以及我们对集合框架的讨论。 我们提供了集合，集合，列表，队列和地图，并为您提供了所需的信息，以选择最适合您需求的接口和实现。

泛型和改进的集合框架可能是 `Java` 自成立以来最重大的变化。我们对这些变化感到非常兴奋，并希望我们已将这些兴奋传达给了您。我们希望您会看到泛型和集合很好地融合在一起为您的 `Java` 编程技巧提供强大的补充。


《《《 [返回首页](../README.md)