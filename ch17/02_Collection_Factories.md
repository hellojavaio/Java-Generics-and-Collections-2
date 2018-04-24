《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](01_Generic_Algorithms.md)

### 收集工厂

`Collections` 类提供了创建某些包含零个或多个对同一对象的引用的集合的简便方法。 最简单的这种集合是空的：

```java
   <T> List<T> emptyList() // 返回空列表（不可变）
   <K,V> Map<K,V> emptyMap() // 返回空映射（不可变）
   <T> Set<T> emptySet() // 返回空集（不可变的)
```

空集合在实现返回值集合的方法时很有用，它们可以用来表示没有值返回。 每个方法都返回一个对 `Collection` 的单例内部类的实例的引用。 因为这些实例是不可变的，所以它们可以安全地共享，所以调用其中一个工厂方法不会导致创建对象。 在泛型之前，`Collections` 字段 `EMPTY_SET`，`EMPTY_LIST` 和 `EMPTY_MAP` 通常用于 `Java` 中的相同目的，但现在用处不大，因为它们的原始类型在使用时会生成未经检查的警告。

`Collections` 类还为您提供了创建仅包含单个成员的集合对象的方法：

```java
   <T> Set<T> singleton(T o) // 返回只包含指定对象的不可变集合
   <T> List<T> singletonList(T o) // 返回只包含指定对象的不可变列表
   <K,V> Map<K,V> singletonMap(K key, V value) // 返回一个不可变的映射，只将键 K 映射到值 V.
```

同样，这些可以用于为接受值集合的方法提供单个输入值。

最后，可以创建一个包含给定对象的许多副本的列表。

```java
   <T> List<T> nCopies(int n, T o) // 返回一个不可变列表，其中包含对对象 o 的 n 个引用
```

由于 `nCopies` 生成的列表是不可变的，它只需要包含一个物理元素来提供所需长度的列表视图。这样的列表通常被用作构建进一步集合的基础 - 例如，作为构造函数或 `addAll` 方法的参数。

《《《 [下一节](03_Wrappers.md)      <br/>
《《《 [返回首页](../README.md)