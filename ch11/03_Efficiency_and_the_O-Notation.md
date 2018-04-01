## 效率与Ο符号

在最后一节中，我们讨论了不同的实现对于不同的操作是“好的”。一个好的算法在使用两种资源时很经济：时间和空间。集合的实现通常使用与集合大小成正比的空间，但是访问和更新所需的时间可能会有很大差异，所以这将是我们的主要关心。很难说一个程序执行的速度有多快，因为这取决于很多因素，包括程序员省外的一些因素，比如编译代码的质量和硬件的速度。即使我们忽略了这些并且仅仅考虑算法的执行时间如何依赖于它的数据，详细的分析可能是复杂的。在 `Donald Knuth` 的经典着作“排序和搜索”（`Addison-Wesley`）中提供了一个相对简单的例子， `Knuth` 的名义 `MIX` 机器上的多列表插入排序程序的最坏情况执行时间推导为

```
   3.5N²  + 24.5N + 4M + 2
```

其中N是正在排序的元素的数量，M是列表的数量。

作为描述算法效率的简便方式，这不是很方便。很明显，我们需要更广泛的刷子以供一般使用。最常用的是 `Onotation`（发音为“big-oh notation”）.`O-notation` 是一种以抽象的方式描述算法性能的方式，不需要详细预测特定程序的精确性能运行在特定的机器上我们使用它的主要原因是它给了我们一种描述算法的执行时间如何依赖于它的数据集的大小的方式，假设数据集足够大。例如，在以前的表达式中前两项对 `N` 的低值是可比较的;事实上，对于 `N <8`，第二项更大，但随着 `N` 增长，第一项越来越支配表达式，并且在达到 `100` 时，第一项是第二项的 `15` 倍，使用非常广泛的刷子，我们说这个算法的最坏情况需要时间 `O`（`N²`），我们不关心系数太多，因为它不对我们想要的唯一最重要的问题做出任何改变询问任何算法：数据大小增加时的运行时间会发生什么情况 - 例如，当它加倍时？对于最差的插入排序，答案是运行时间增加四倍。这使得`O`（`N²`）比我们在本书中实际使用的任何情况都糟糕。

表 `11-1`。 一些常见的运行时间


时间       |通用名称  |如果N加倍，则会影响运行时间|示例算法
---        |---      |---                      |---
O(1)       |常量     | 不变                     |插入散列表（第 `13.1` 节）
O(log N)   |对数的   |不断增加                  |插入树中（第`13.2.2`节）
O(N)       |线性     |加倍                      |线性搜索
O(N log N) |---      |加倍加上与`N`成比例的量    |合并排序（`17.1.1`节）       
O(N²)      |二次方   |增加了四倍                |冒泡排序
































