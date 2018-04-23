《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](04_Array_Creation.md)

### 广告中的真理原则

在前面的章节中我们看到，将集合转换为数组的简单方法将不起作用。 我们可能会尝试的第一个解决方案是添加一个未经检查的演员表，但我们很快会看到，这导致更令
人困惑的问题。 正确的解决方案需要我们去反思。 由于将任何泛型结构转换为数组时都会出现相同的问题，因此值得了解这些问题及其解决方案。 我们将研究上一节中
的静态 `toArray` 方法的变体; 相同的想法适用于集合框架的 `Collection` 接口中的 `toArray` 方法。

这里是第二次尝试将集合转换为数组，这次使用未经检查的转换，并添加了测试代码：

```java
   import java.util.*;
    class Wrong {
      public static<T> T[] toArray(Collection<T> c) {
        T[] a = (T[])new Object[c.size()]; // 未经检查的转换
        int i=0; for (T x : c) a[i++] = x;
        return a;
      }
      public static void main(String[] args) {
        List<String> strings = Arrays.asList("one","two");
        String[] a = toArray(strings); // 类抛出错误
      }
    }
```

上一节中的代码使用短语 `new T[c.size()]` 创建数组，导致编译器报告通用数组创建错误。 新代码改为分配一个对象数组并将其转换为 `T []` 类型，这会导致编
译器发出未经检查的强制转换警告：

```java
   % javac -Xlint Wrong.java
   Wrong.java:4: warning: [unchecked] 未经检查的转换
   found : java.lang.Object[]
   required: T[]
		  T[] a = (T[])new Object[c.size()]; // 未经检查的转换
					   ^
   1 warning
```

正如你从这个程序选择的名字中猜出的那样，这个警告不应该被忽略。 事实上，运行这个程序给出了以下结果：

```java
   % java Wrong
   Exception in thread "main" java.lang.ClassCastException: [Ljava.lang.Object;
		   at Wrong.main(Wrong.java:11)
```

难懂的短语 `[Ljava.lang.Object` 是数组的指定类型，其中 `[L` 表示它是引用类型的数组，而 `java.lang.Object` 是数组的组件类型。 类转换错误消息引用包
含对 `toArray` 的调用的行。 此错误消息可能会令人困惑，因为该行看起来不包含演员表！

为了看看这个程序出了什么问题，让我们看看程序是如何使用擦除来翻译的。 删除删除集合和列表中的类型参数，重新设置类型变量 `T` 与 `Object` 的出现位置，并
在调用 `toArray` 时插入相应的强制转换，从而生成以下等效代码：

```java
   import java.util.*;
    class Wrong {
      public static Object[] toArray(Collection c) {
        Object[] a = (Object[])new Object[c.size()]; // unchecked cast
        int i=0; for (Object x : c) a[i++] = x;
        return a;
      }
      public static void main(String[] args) {
        List strings = Arrays.asList(args);
        String[] a = (String[])toArray(strings); // class cast error
      }
    }
```

类型擦除将未选中的转换转换为 `T []` 转换为 `Object []` 的转换，并在调用 `toArray` 时将转换插入 `String []`。 运行时，这些转换中的第一个成功。 但
即使该数组只包含字符串，但它的通用类型表明它是一个 `Object` 数组，因此第二次投射失败。

为了避免这个问题，你必须坚持以下原则：
  > 广告中的真理原则：数组的指定类型必须是其静态类型的擦除子类型。

在 `toArray` 本身内部遵循这个原则，其中 `T` 的删除是 `Object`，但不在主方法内，其中 `T` 已经绑定到 `String`，但是数组的指定类型仍然是 `Object`。

在我们看到如何根据这个原则创建数组之前，还有一点值得强调。回想一下，泛型为 `Java` 伴随着 `cast-iro` 保证：只要没有未经检查的警告，通过擦除插入的转换
将不会失败。上述原则说明了相反的情况：如果有未经检查的警告，则通过擦除插入的演员可能会失败。此外，失败的演员可能会在源代码的不同部分，而不是负责未经
检查的警告！这就是为什么生成未经检查的警告的代码必须非常谨慎地编写。

**数组生成数组** 1732年托马斯富勒说，“这是赚钱的钱”，他注意到赚钱的一种方式是已经有钱。同样，获取一个通用类型的新数组的一种方法是已经有一个这种类型
的数组。然后，可以从旧的数组中复制新数组的特定类型信息。

因此，我们改变了以前的方法来取两个参数，一个集合和一个数组。如果数组足够大以容纳集合，则集合将被复制到数组中。否则，将使用反射来分配与旧的相同通用类
型的新数组，然后将该集合复制到新数组中。

以下是实施替代方案的代码：

```java
   import java.util.*;
    class Right {
      public static <T> T[] Array(toCollection<T> c, T[] a) {
        if (a.length< c.size())
        a = (T[])java.lang.reflect.Array. // unchecked cast
        newInstance(a.get Class().getComponentType(), c.size());
        int i=0; for (T x : c) a[i++] = x;
        if (i< a.length) a[i] = null;
        return a;
      }
      public static void main(String[] args) {
        List<String> strings = Arrays.asList("one", "two");
        String[] a = toArray(strings, new String[0]);
        assert Arrays.toString(a).equals("[one, two]");
        String[] b = new String[] { "x","x","x","x" };
        toArray(strings, b);
        assert Arrays.toString(b).equals("[one, two, null, x]");
      }
    }
```

这使用反射库中的三个方法来分配一个与旧数组具有相同组件类型的新数组：方法 `getClass`（在 `java.lang.Object` 中）返回表示数组类型的 `Class` 对象 
`T []` ;方法 `getComponentType`（来自 `java.lang.Class`）返回表示数组的组件类型 `T` 的第二个 `Class` 对象; `newInstance`（在 
`java.lang.reflect.Array` 中）方法分配一个具有给定组件类型和大小的新数组，同样是 `T []` 类型。调用 `newInstance` 的结果类型是 `Object`，因此需要
使用未经检查的强制转换将结果转换为正确的类型 `T []`。

在 `Java 5` 中，类 `Class` 已更新为泛型类 `Class<T>`;稍后更多。

（一个微妙的观点：在调用 `newInstance` 时，为什么是结果类型 `Object` 而不是 `Object []`？因为通常 `newInstance` 可能会返回一个基本类型的数组，例
如 `int []`，它是 `Object` 的子类型，但而不是 `Object []`。但是，这里不会发生，因为类型变量  `T` 必须代表引用类型。）

新数组的大小被视为给定集合的大小。如果旧数组的大小足以容纳集合，并且剩余空间，则在集合之后立即写入 `null` 以标记其结尾。

测试代码创建一个长度为 `2` 的字符串列表，然后执行两个演示调用。既没有遇到前面描述的问题，因为根据广告中的真理原理，返回的数组具有指定类型 
`String []`。第一个调用传递一个长度为零的数组，因此该列表被复制到一个新分配的数组中长度二。第二次调用传递一个长度为四的数组，所以列表被复制到现有数
组中，并且在末尾写入一个空值; `null` 之后的原始数组内容不受影响。实用方法 `toString`（在 `java.util.Arrays` 中）用于将数组转换为断言中的字符串。

集合框架包含两个将集合转换为数组的方法，类似于我们刚刚讨论的那个：

```java
   interface Collection<E> {
   ...
     public Object[] toArray();
     public <T> T[] toArray(T[] a)
   }
```

第一个方法返回一个带有指定组件类型 `Object` 的数组，而第二个方法从参数数组中复制指定组件类型，就像上面的静态方法一样。 就像那种方法一样，如果有空间
的话，它会把集合复制到数组中（如果有空间的话，它会在集合的末尾写入一个空值），否则就分配一个新的数组。 对第一个方法 `c.toArray()` 的调用返回与使用空
对象 `c.toArray(new Object [0])` 的第二个方法调用相同的结果。 这些方法将在第 `12` 章开头进一步讨论。

通常在遇到这种设计时，程序员认为数组参数主要出于效率原因存在，以便通过重新使用数组来最小化分配。 这确实是设计的一个好处，但它的主要目的是让指定类型正
确！ 大多数对 `toArray` 的调用将使用长度为零的参数数组。

**一个优雅的选择** 有些时候，看起来赚钱的唯一方式就是赚钱。数组并不完全一样。使用数组创建数组的另一种方法是使用类Class的实例。

类的实例在运行时表示关于类的信息;也有这个类的实例代表原始类型和数组。在本文中，我们将把 `Class` 类的实例称为类标记。

在 `Java 5` 中，类 `Class` 已经变得通用，现在具有 `Class<T>` 的形式。 `T` 代表什么？ `Class<T>` 类型的实例表示类型 `T`.例如，`String.class` 的
类型为 `Class<String>`。

我们可以定义一个我们以前方法的变体，它接受类型为 `Class<T>` 的类标记而不是类型为 `T []` 的数组。将 `newInstance` 应用于类型为 `Class<T>` 的类标记
将返回一个类型为 `T []` 的新数组，其类型标记将指定组件类型。 `newInstance` 方法仍然具有 `Object` 的返回类型（因为与原始数组相同的问题），所以仍然
需要未经检查的转换。

```java
   import java.util.*;
    class RightWithClass {
      public static <T> T[] toArray(Collection<T> c, Class<T> k) {
        T[] a = (T[])java.lang.reflect.Array. // unchecked cast
        newInstance(k, c.size());
        int i=0; for (T x : c) a[i++] = x;
        return a;
      }
      public static void main(String[] args) {
        List<String> strings = Arrays.asList("one", "two");
        String[] a = toArray(strings, String.class);
        assert Arrays.toString(a).equals("[one, two]");
      }
    }
```

转换方法现在传递类标记 `String.class` 而不是字符串数组。

`Class<T>` 类型表示泛型的一个有趣用法，与集合或比较器完全不同。 如果您仍然觉得这种泛型使用混淆，请不要担心 - 我们将在第 `7` 章中详细介绍这个主题。

《《《 [下一节](06_The_Principle_of_Indecent_Exposure.md)      <br/>
《《《 [返回首页](../README.md)
