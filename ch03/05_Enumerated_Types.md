《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](04_Comparator.md)

### 枚举类型

`Java 5` 包含对枚举类型的支持。 这是一个简单的例子：

```java
enum Season { WINTER, SPRING, SUMMER, FALL }
```

每个枚举类型声明都可以以程式化的方式扩展为相应的类。相应的类被设计为每个枚举常量都有一个实例，绑定到一个合适的静态最终变量。 例如，上面的枚举声明扩展
为一个名为 `Season` 的类。 这个类存在四个实例，绑定到四个静态最终变量，名称分别为 `WINTER`,`SPRING`,`SUMMER`,和 `FALL`。

与枚举类型对应的每个类都是 `java.lang.Enum` 的子类。 它在 `Java` 文档中的定义是这样开始的：

```java
class Enum<E extends Enum<E>>
```

你可能会发现这种可怕的一见钟情 - 我们当然都这么做！ 但不要恐慌。实际上，我们已经看到了类似的东西。 令人担忧的短语 `E extends Enum <E>` 与我们在 
`max` 定义中遇到的 `T extends Comparable <T>` 很像（见 `3.2` 节），我们将看到它们出于相关原因。

为了理解发生了什么，我们需要看看代码。 例 `3-4` 显示了基类 `Enum`，例 `3-5` 显示了与上面的枚举类型声明对应的类 `Season`。（`Enum` 的代码遵循 
`Java` 库中的源代码，但我们简化了几个要点。）

这是 `Enum` 类声明的第一行：

```java
public abstract class Enum<E extends Enum<E>> implements Comparable<E>
```

下面是季节课的声明的第一行：

```java
class Season extends Enum<Season>
```

例 `3-3`。比较

```java
class Comparators {
  public static <T> T max(Collection<? extends T> coll, Comparator<? super T> cmp){
    T candidate = coll.iterator().next();
    for (T elt : coll) {
      if (cmp.compare(candidate, elt) < 0) { 
        candidate = elt; 
      }
    }
    return candidate;
  }
  public static <T extends Comparable<? super T>> T max(Collection<? extends T> coll){
    return max(coll, Comparators.<T>naturalOrder());
  }
  public static <T> T min(Collection<? extends T> coll, Comparator<? super T> cmp){
    return max(coll, reverseOrder(cmp));
  }
  public static <T extends Comparable<? super T>> T min(Collection<? extends T> coll){
    return max(coll, Comparators.<T>reverseOrder());
  }
  public static <T extends Comparable<? super T>> Comparator<T> naturalOrder(){
    return new Comparator<T>() {
      public int compare(T o1, T o2) { return o1.compareTo(o2); }
    };
  }
  public static <T> Comparator<T> reverseOrder(final Comparator<T> cmp){
    return new Comparator<T>() {
      public int compare(T o1, T o2) { 
        return cmp.compare(o2,o1); 
      }
    };
  }
  public static <T extends Comparable<? super T>> Comparator<T> reverseOrder(){
    return new Comparator<T>() {
      public int compare(T o1, T o2) { return o2.compareTo(o1); }
    };
  }
}
```

例 `3-4`。 枚举类型的基类

```java
public abstract class Enum<E extends Enum<E>> implements Comparable<E> {
  private final String name;
  private final int ordinal;
  protected Enum(String name, int ordinal) {
    this.name = name; this.ordinal = ordinal;
  }
  public final String name() { 
    return name; 
  }
  public final int ordinal() { 
    return ordinal; 
  }
  public String toString() { 
    return name; 
  }
  public final int compareTo(E o) {
    return ordinal - o.ordinal;
  }
}
```

例 `3-5`。 对应于枚举类型的类

```java
// corresponds to
// enum Season { WINTER, SPRING, SUMMER, FALL }
final class Season extends Enum<Season> {
  private Season(String name, int ordinal) { 
    super(name,ordinal); 
  }
  public static final Season WINTER = new Season("WINTER",0);
  public static final Season SPRING = new Season("SPRING",1);
  public static final Season SUMMER = new Season("SUMMER",2);
  public static final Season FALL = new Season("FALL",3);
  private static final Season[] VALUES = { WINTER, SPRING, SUMMER, FALL };
  public static Season[] values() { 
    return VALUES.clone(); 
  }
  public static Season valueOf(String name) {
    for (Season e : VALUES) 
	  if (e.name().equals(name)) 
	    return e;
      throw new IllegalArgumentException();
  }
}
```

匹配的东西，我们可以开始看到这是如何工作的。 类型变量 `E` 表示 `Enum` 的子类，它实现了一个特定的枚举类型，比如 `Season`。每个 `E` 必须满足：

```java
E extends Enum<E>
```

所以我们可以把 `E` 作为 `Season`，因为：

```java
Season extends Enum<Season>
```

此外，`Enum` 的声明告诉我们：

```java
Enum<E> implements Comparable<E>
```

所以它是这样的：

```java
Enum<Season> implements Comparable<Season>
```

因此，我们可以将 `Season` 类型的两个值相互比较，但我们无法将季节类型的值与任何其他类型的值进行比较。

没有类型变量，`Enum` 类的声明就会像这样开始：

```java
class Enum implements Comparable<Enum>
```

而 `Season` 类的声明将如下开始：

```java
class Season extends Enum
```

这更简单，但它太简单了。 有了这个定义，`Season` 将实现 `Comparable <Enum>` 而不是 `Comparable<Season>`，这意味着我们可以将 `Season` 类型的值与
任何枚举类型的值进行比较，这肯定不是我们想要的！

一般来说，当你想精确地确定类型时，像 `T` 这样的模式经常出现 `Comparable <T>` 和 `E extends Enum <E>`。当我们查看战略和主题观察者设计模式时，我们
会看到更多的例子，参见第 `9.4` 节和第 `9.5` 节。

定义的其余部分是 `Joshua Bloch` 在 `Effective Java(Addison-Wesley)` 中描述的类型安全模式的一个简单应用，后者又是 `Gamma`，`Helm`，`Johnson` 和 
`Vlissides` 在设计模式中描述的单例模式的一个实例(`Addison-Wesley`出版社)。

基类 `Enum` 定义了两个字段，一个字符串名称和一个整数序号，它们由枚举类型的每个实例拥有;这些字段是最终的，因为一旦它们被初始化，它们的值永远不会改变。
该类的构造函数是受保护的，以确保它仅在此类的子类中使用。每个枚举类都使构造函数保持私有，以确保它仅用于创建枚举常量。例如，`Season` 类有一个私人构造函
数，它被调用四次以初始化最终变量 `WINTER`，`SPRING`，`SUMMER` 和 `FALL`。

基类为名称和序号字段定义访问器方法。该 `toString` 方法返回名称，并且 `compareTo` 方法仅返回两个枚举值的序数的差异。（与第 `3.1` 节中的 `Integer` 
定义不同，这是安全的，因为不存在溢出的可能性）。因此，常量与它们的序号具有相同的顺序 - 例如，`WINTER` 在 `SUMMER` 之前。

最后，每个类中有两个对应于枚举类型的静态方法。 `values` 方法返回该类型所有常量的数组。它返回内部数组的一个（浅）克隆。克隆对于确保客户端无法更改内部
阵列至关重要。请注意，调用 `clone` 方法时不需要强制转换，因为克隆数组现在可以利用协变返回类型（请参见第 `3.8` 节）。 `valueOf` 方法接受一个字符串并
返回相应的常量，通过搜索内部数组找到。如果字符串没有命名枚举值，它将返回 `IllegalArgumentException`。

《《《 [下一节](06_Multiple_Bounds.md)      <br/>
《《《 [返回首页](../README.md)
