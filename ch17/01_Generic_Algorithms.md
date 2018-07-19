《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](00_The_Collections_Class.md)

### 通用算法

通用算法分为四个主要类别：更改列表中的元素顺序，更改列表内容，查找集合中的极端值以及查找列表中的特定值。它们表示可重用的功能，因为它们可以应用于任何
类型的列表（或在某些情况下适用于集合）。生成这些方法的类型导致了一些相当复杂的声明，因此每个部分都在声明之后简要地讨论这些声明。

### 更改列表元素的顺序

有七种方法以各种方式对列表进行重新排序。 其中最简单的是 `swap`，它交换两个元素，并且在实现 `RandomAccess` 的 `List` 的情况下，执行时间不变。 最
复杂的是排序，它将元素传输到数组中，在时间 `O(n log n)` 中对它们应用合并排序，然后将它们返回到 `List`。 所有其余的方法在时间 `O(n)` 中执行。

```java
void reverse(List<?> list) // 颠倒元素的顺序
void rotate(List<?> list, int distance) // 旋转列表的元素; 索引i处的元素移动到index (distance + i) % list.size()
void shuffle(List<?> list) // 随机排列列表元素
void shuffle(List<?> list, Random rnd) // 用随机性源rnd随机排列列表
<T extends Comparable<? super T>> void sort(List<T> list) // 使用自然顺序排序提供的列表
<T> void sort(List<T> list, Comparator<? super T> c) // 使用提供的顺序对提供的列表进行排序
void swap(List<?> list, int i, int j) // 交换指定位置的元素
```

对于这些方法中的每一种，除了排序和交换，都有两种算法，一种使用迭代，另一种使用随机访问。 方法 `sort` 将 `List` 元素传递给一个数组，在当前实现中它们
使用 `n log n` 性能的 `mergesort` 算法进行排序。 方法交换总是使用随机访问。本节中其他方法的标准实现使用迭代或随机访问，具体取决于列表是否实现了 
`RandomAccess` 接口（请参阅第 `8.3` 节）。 如果是这样，则实现选择随机访问算法; 即使对于没有实现 `RandomAccess` 的列表，但是，如果列表大小低于给定
阈值，则使用随机访问算法，这是通过性能测试在每个方法基础上确定的。

### 更改列表的内容

这些方法改变了列表的一些或全部元素。 该方法拷贝将源列表中的元素转移到目的地列表的初始子列表中（其必须足够长以容纳它们），从而使目的地列表的任何剩余元
素保持不变。方法 `fill` 使用指定对象替换列表中的每个元素，并且 `replaceAll` 将列表中每个值的每次出现替换为另一个值，其中旧值或新值可以为空 - 如果进
行了替换，则返回 `true`。

```java
<T> void copy(List<? super T> dest, List<? extends T> src) // 将所有元素从一个列表复制到另一个列表中
<T> void fill(List<? super T> list, T obj) // 用obj替换列表中的每个元素
<T> boolean replaceAll(List<T> list, T oldVal, T newVal) // 用newVal替换列表中出现的所有oldVal
```

这些方法的签名可以使用 `Get` 和 `Put` 原则来解释（参见第 `2.4` 节）。`2.3` 节讨论了拷贝的签名。它从源列表中获取元素并将它们放入目标中，因此这些列表
的类型分别是 `? extends T` 和 `? super T`。 这符合直觉，源列表元素的类型应该是目标列表的子类型。 虽然复制签名有更简单的选择，但 `2.3` 节规定尽可能
使用通配符扩大了允许的呼叫范围。

对于填充，`Get` 和 `Put` 原则规定，如果要将值放入参数化集合中，应该使用 `super`;对于 `replaceAll`，它指出如果要将值放入并从同一结构中获取值，则不
应使用完全通配符。

### 在集合中查找极端值

方法 `min` 和 `max` 是为此目的提供的，每个方法都有两个重载 - 一个使用元素的自然顺序，一个接受比较器强制排序。 它们以线性时间执行。

```java
<T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll) // 使用自然顺序返回最大元素
<T> T max(Collection<? extends T> coll, Comparator<? super T> comp) // 使用提供的比较器返回最大元素
<T extends Object & Comparable<? super T>>
T min(Collection<? extends T> coll) // 使用自然顺序返回最小元素
<T> T min(Collection<? extends T> coll, Comparator<? super T> comp) // 使用提供的比较器返回最小元素
```

在列表中查找特定值

该组中的方法在 `List` 中找到元素或元素组，再次根据列表的大小以及是否实现 `RandomAccess` 在替代算法之间进行选择。

```java
<T> int binarySearch(List<? extends Comparable<? super T>> list, T key) // 使用二分查找搜索密钥
<T> int binarySearch(List<? extends T> list, T key, Comparator<? super T> c) // 使用二分查找搜索密钥
int indexOfSubList(List<?> source, List<?> target) // 找到匹配目标的源的第一个子列表
int lastIndexOfSubList(List<?> source, List<?> target) // 找到与目标匹配的源的最后一个子列表
```

第一个 `binarySearch` 重载的签名表示可以使用它在对象列表中搜索类型为 `T` 的键，该对象列表中可以具有任何类型，可以与T类型的对象进行比较。第二种类似
于比较器 `min` 和 `max` 的重载，除了在这种情况下，`Collection` 的类型参数必须是键类型的子类型，而该类型又必须是 `Comparator` 的类型参数的子类型。

二进制搜索需要一个排序列表来进行操作。在搜索开始时，搜索值可能出现的索引范围对应于整个列表。二分搜索算法使用采样元素的值来采样该范围中间的元素，以确
定新范围是上一个旧范围的一部分还是元素索引下的部分。第三种可能性是采样值等于搜索值，在这种情况下搜索完成。由于每个步骤将范围的大小减半，因此需要m个步
骤才能在长度为 `2 m` 的列表中找到搜索值，并且长度为n的列表的时间复杂度为 `O(log n)`。

`indexOfSubList` 和 `lastIndexOfSubList` 方法的操作不需要排序列表。他们的签名允许源列表和目标列表包含任何类型的元素（请记住，这两个通配符可能代表
两种不同的类型）。这些签名背后的设计决策与 `Collection` 方法 `containsAll`，`retainAll`和 `removeAll` 背后的设计决策相同（参见第 `2.6` 节）。

《《《 [下一节](02_Collection_Factories.md)      <br/>
《《《 [返回首页](../README.md)
