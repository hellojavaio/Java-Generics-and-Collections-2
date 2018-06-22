《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](05_Arrays.md)

### 通配符与类型参数

`contains` 方法检查集合是否包含给定的对象，并且其泛化 `containsAll` 检查集合是否包含另一个集合的每个元素。 本部分介绍了为这些方法提供通用签名的两种
替代方法。 第一种方法使用通配符，是 `Java` 集合框架中使用的通配符。 第二种方法使用类型参数，通常是更合适的选择。

通配符: 以下是 `Java` 中泛型方法的类型：
  
```java
  interface Collection<E> {
  ...
  public boolean contains(Object o);
  public boolean containsAll(Collection<?> c);
  ...
  }
``` 
  
第一种方法根本不使用泛型！ 第二种方法是我们第一次看到一个重要的缩写。 类型 `Collection <?>` 代表：  
  
```java
  Collection<? extends Object>
```
  
扩展对象是通配符最常用的用法之一，所以提供一个简短的表单来编写它是有意义的.

这些方法让我们测试成员和遏制： 

```java
  Object obj = "one";
  List<Object> objs = Arrays.<Object>asList("one", 2, 3.14, 4);
  List<Integer> ints = Arrays.asList(2, 4);
  assert objs.contains(obj);
  assert objs.containsAll(ints);
  assert !ints.contains(obj);
  assert !ints.containsAll(objs);
```
  
给定的对象列表包含字符串“one”和给定的整数列表，但给定的整数列表不包含字符串“one”，也不包含给定的对象列表。

测试 `ints.contains(obj)` 和 `ints.containsAll(objs)` 可能看起来很愚蠢。当然，整数列表将不包含任意对象，如字符串“one”。 但这是允许的，因为有时这
样的测试可能会成功：  

```java
  Object obj = 1;
  List<Object> objs = Arrays.<Object>asList(1, 3);
  List<Integer> ints = Arrays.asList(1, 2, 3, 4);
  assert ints.contains(obj);
  assert ints.containsAll(objs);
```
  
在这种情况下，对象可能被包含在整数列表中，因为它碰巧是一个整数，并且对象列表可能包含在整数列表中，因为列表中的每个对象碰巧是一个整数。  - 类型参数你
可以合理地选择一个替代设计的集合- 只能测试元素类型的子类型的容器的设计：

```java
  interface MyCollection<E> { // alternative design
  ...
  public boolean contains(E o);
  public boolean containsAll(Collection<? extends E> c);
  ...
  }
```
  
假设我们有一个实现 `MyCollection` 的 `MyList` 类。 现在这些测试是合法的，只有一个方法：

```java
  Object obj = "one";
  MyList<Object> objs = MyList.<Object>asList("one", 2, 3.14, 4);
  MyList<Integer> ints = MyList.asList(2, 4);
  assert objs.contains(obj);
  assert objs.containsAll(ints)
  assert !ints.contains(obj); // 编译报错
  assert !ints.containsAll(objs); // 编译报错
```
  
最后两个测试是非法的，因为类型声明要求我们只能测试一个列表是否包含该列表的一个子类型的元素。所以我们可以检查一个对象列表是否包含整数列表，而不是相
反。
  
两种风格中哪一种更好是味道的问题。第一个允许更多的测试，第二个在编译时捕获更多的错误（同时排除一些明显的测试）。 `Java` 库的设计者选择了第一种更自由
的替代方案，因为在泛型之前使用集合框架的人可能已经编写了诸如 `ints.containsAll(objs)` 之类的测试，并且该人希望该测试在泛型之后保持有效被添加到
`Java`。但是，在设计新的通用库（如 `MyCollection` ）时，如果向后兼容性不太重要，那么在编译时捕获更多错误的设计可能更有意义。
  
可以说，核心包设计师做出了错误的选择。很少需要像 `ints.containsAll(objs)` 这样的测试，而且这样的测试仍然可以通过声明 `int` 具有 `List<Object>` 类
型而不是 `List<Integer>` 类型来允许。在普通情况下捕捉更多的错误可能会更好，而不是允许在一个不常见的情况下进行更精确的打字。
  
同样的设计选择适用于包含 `Object` 或 `Collection<?>` 的其他方法。在他们的签名中，如 `remove`，`removeAll` 和 `retainAll`。

《《《 [下一节](07_Wildcard_Capture.md) <br/>
《《《 [返回首页](../README.md)
