《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](02_Implementing_Map.md)

### SortedMap和NavigableMap

![](16_5.png)

图 `16-5` SortedMap

像 `SortedSet` 一样，子接口 `SortedMap`（参见图 `16-5`）增加了它的合约，保证其迭代器将按照升序键顺序遍历映射。它的定义类似于 `SortedSet` 的定义，`firstKey` 和 `headMap` 方法对应于 `SortedSet` 方法 `first` 和 `headSet`。同 `SortedSet` 一样，`SortedMap` 接口已经在 `Java 6` 中通过子接口 `NavigableMap` 进行了扩展（参见图 `16-6`）。由于相同的原因，此部分的结构类似于第 `13.2` 节：`SortedMap` 已被 `NavigableMap` 过时，但可能有帮助对于目前阻止开发人员使用 `Java 6` 来分别处理两个接口。

`SortedMap` 对其按键进行排序，无论是自然排序还是比较器排序;但无论哪种情况，比较方法都必须与 `equals` 相一致，因为 `SortedMap` 将使用比较来确定密钥何时已经位于地图中。

由 `SortedMap` 接口定义的额外方法分为三组：

**获取第一个和最后一个要素**

```java
   K firstKey()
   K lastKey()
```

如果该集合为空，则这些操作会引发 `NoSuchElementException`。

**检索比较器**

```java
   Comparator<? super K> comparator()
```

此方法返回映射的键比较器（如果它已被赋予），而不是依赖于键的自然排序。 否则，它返回 `null`。

**查找子序列**

```java
   SortedMap<K,V> subMap(K fromKey, K toKey)
   SortedMap<K,V> headMap(K toKey)
   SortedMap<K,V> tailMap(K fromKey)
```

这些操作就像 `SortedSet` 中的相应操作一样：关键参数本身不必存在于映射中，并且返回的集合包含 `fromKey` - 如果实际上它存在于映射中 - 并且不包含 `toKey`。

### NavigableMap

![](16_6.png)

图 `16-6` NavigableMap

`NavigableMap`（参见图 `16-6` ）扩展并替换 `SortedMap`，就像 `NavigableSet` 替换 `SortedSet` 一样。 其方法几乎与 `NavigableSet` 的方法完全一致，将地图视为一组由 `Map.Entry` 对象表示的键值关联。 因此，当 `NavigableSet` 方法返回该集合的元素时，相应的 `NavigableMap` 方法将返回 `Map.Entry` 类型的结果。 到目前为止，这种类型的对象只能通过遍历由 `Map.entrySet` 返回的集合来获得，并且在映射的并发修改面前被指定为无效。该规范不适用于新方法返回的 `Map.Entry` 对象，`NavigableMap` 的契约通过指定由其方法返回的 `Map.Entry` 对象是反映地图在生成时的状态的快照对象，并且不支持 `setValue`。

`NavigableMap` 添加的方法可以分为四组。

**获取第一个和最后一个要素**

```java
   Map.Entry<K,V> pollFirstEntry()
   Map.Entry<K,V> pollLastEntry()
   Map.Entry<K,V> firstEntry()
   Map.Entry<K,V> lastEntry()
```

前两种方法类似于 `NavigableSet` 中的 `pollFirst` 和 `pollLast`。后两个是因为 `NavigableMap` 中关于使地图条目可用的重点需要与从 `SortedMap` 继承的第一个和最后一个密钥返回方法相对应的入口返回方法。

**获取范围视图**

```java
   NavigableMap<K,V> subMap(
   K fromKey, boolean fromInclusive, K toKey, boolean toInclusive)
   NavigableMap<K,V> headMap(K toKey, boolean inclusive)
   NavigableMap<K,V> tailMap(K fromKey, boolean inclusive)
```

像 `NavigableSet` 方法一样，这些方法比 `SortedMap` 的范围视图方法提供了更大的灵活性。 这些方法不是总是返回一个半开的间隔，而是接受用于确定是否包含定义间隔的一个或多个键的布尔参数。

**获得最接近的比赛**

```java
   Map.Entry<K,V> ceilingEntry(K Key)
   K ceilingKey(K Key)
   Map.Entry<K,V> floorEntry(K Key)
   K floorKey(K Key)
   Map.Entry<K,V> higherEntry(K Key)
   K higherKey(K Key)
   Map.Entry<K,V> lowerEntry(K Key)
   K lowerKey(K Key)
```

这些与 `NavigableSet` 的相应最接近匹配方法类似，但它们返回 `Map.Entry` 对象。 如果您想要属于这些条目之一的密钥，请使用相应的便捷键返回方法，同时允许地图避免不必要的创建 `Map.Entry` 对象的性能优势。

**浏览 Map**

```java
   NavigableMap<K,V> descendingMap() // 返回 Map 的逆序视图
   NavigableSet<K> descendingKeySet() // 返回一个反序键集
```

还有一个新的方法被定义为获得键的 `NavigableSet`：

```java
   NavigableSet<K> navigableKeySet() // 返回一个前向顺序键集
```

您可能想知道为什么从 `Map` 继承的方法 `keySet` 不能简单地使用协变返回类型来重写，以返回 `NavigableSet`。 事实上，`NavigableMap.keySet` 的平台实现返回一个 `NavigableSet`。但是存在一个兼容性问题：如果 `TreeMap.keySet` 的返回类型从 `Set` 更改为 `NavigableSet`，则覆盖该方法的任何现有 `TreeMap` 子类现在将无法编译，除非它们也更改了返回类型。（这一点与 `8.4` 节中讨论的相似。）

### TreeMap

`SortedMap` 是通过 `TreeMap` 在集合框架中实现的。 当我们讨论 `TreeSet` 时，我们遇到了树作为存储元素的数据结构（请参阅第 `13.2.2` 节）。 实际上，`TreeSet` 的内部表示只是一个 `TreeMap`，其中每个键都与相同的标准值相关联，因此第 `13.2.2` 节中给出的红黑树的机制和性能的解释同样适用于此处。

`TreeMap` 的构造函数除了标准的构造函数之外，还包括一个允许您提供一个 `Comparator` 的构造函数，另一个允许您从另一个 `SortedMap` 创建一个，同时使用相同的比较器和相同的映射：

```java
   public TreeMap(Comparator<? super K> comparator)
   public TreeMap(SortedMap<K, ? extends V> m)
```

请注意，这些构造函数中的第二个与 `TreeSet` 的相应构造函数有类似的问题（请参阅第 `13.2.2` 节），因为标准转换构造函数始终使用键的自然顺序，即使其参数实际上是 `SortedMap`。

`TreeMap` 与 `TreeSet` 具有相似的性能特征：基本操作（`get`，`put` 和 `remove`）在 `O(log n)` 时间执行）。 集合视图迭代器是快速失败的。

《《《 [下一节](04_ConcurrentMap.md)      <br/>
《《《 [返回首页](../README.md)