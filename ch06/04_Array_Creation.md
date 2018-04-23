《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](03_Exception_Handling.md)

### 数组创建

数组通过它们的组件类型来进行通用化，这意味着它们携带有关组件类型的运行时信息。 此实体类型信息用于实例测试和强制转换，还用于检查是否允许分配到数组组
件。

回想一下第 `2.5` 节中的这个例子。

```java
   Integer[] ints = new Integer[] {1,2,3};
   Number[] nums = ints;
   nums[2] = 3.14; // 数组存储异常
```

第一行分配一个新数组，其中指定它是一个整数数组。 第二行将此数组赋给一个包含数字数组的变量; 这是允许的，因为与泛型类型不同，数组是协变的。 第三行的赋
值在运行时引发了一个数组存储异常，因为赋值是 `double` 类型的，并且这与附加到数组的指定类型不兼容。

因为数组必须确定其组件类型，所以创建一个新数组是错误的，除非其组件类型是可验证的。 您可能遇到的两个主要问题是数组的类型是一个类型变量，并且数组的类型
是参数化类型。

考虑以下（不正确）代码将集合转换为数组：

```java
   import java.util.*;
    class Annoying {
      public static <T> T[] toArray(Collection<T> c) {
        T[] a = new T[c.size()]; // 编译错误
	int i=0; for (T x : c) a[i++] = x;
        return a;
      }
    }
```

这是一个错误，因为类型变量不是可确定类型。 尝试编译此代码会报告一个通用数组创建错误：

```java
   % javac Annoying.java
   Annoying.java:4: generic array creation
   T[] a = new T[c.size()]; // 编译错误
		   ^
   1 error
```

我们很快就讨论这个问题的解决方法。

作为第二个示例，请考虑返回包含两个列表的数组的以下（不正确）代码：

```java
   import java.util.*;
    class AlsoAnnoying {
      public static List<Integer>[] twoLists() {
        List<Integer> a = Arrays.asList(1,2,3);
        List<Integer> b = Arrays.asList(4,5,6);
        return new List<Integer>[] {a, b}; // 编译错误
      }
    }
```

这是一个错误，因为参数化类型不是可确定类型。 尝试编译此代码也会报告一个通用数组创建错误：

```java
   % javac AlsoAnnoying.java
   AlsoAnnoying.java:6: generic array creation
   return new List<Integer>[] {a, b}; // 编译错误
							   ^
   1 error
```

我们也很快讨论这个问题的解决方法。

无法创建通用数组是 `Java` 中最严重的限制之一。因为它太讨厌了，所以值得重申其发生的原因：通用数组是有问题的，因为泛型是通过擦除来实现的，但是擦除是有
益的，因为它简化了进化。

最好的解决方法是使用 `ArrayList` 或来自集合框架的其他类优先于数组。我们在 `2.5` 节中讨论了集合类和数组之间的权衡，并且我们注意到在很多情况下集合比数
组更好：因为它们在编译时捕获更多的错误，因为它们提供更多的操作，并且因为它们提供了更多的表示灵活性。到目前为止，数组提供的问题的最佳解决方案是“只是说
不”：使用集合优先于数组。

有时候这不起作用，因为为了兼容性或效率的原因你需要一个数组。这种情况的例子发生在集合框架中：为了兼容性，`toArray` 方法将集合转换为数组;为了提高效
率，通过将列表元素存储在一个数组中来实现类数组列表。我们将在下面的章节中详细讨论这两种情况，以及帮助您避免这些情况的相关陷阱和原则：广告真相原则和不
雅暴露原则。我们也考虑可变参数和通用数组的创建带来的问题。

《《《 [下一节](05_The_Principle_of_Truth_in_Advertising.md)      <br/>
《《《 [返回首页](../README.md)
