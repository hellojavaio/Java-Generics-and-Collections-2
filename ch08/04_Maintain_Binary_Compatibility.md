《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](03_Specialize_to_Create_Reifiable_Types.md)

### 保持二进制兼容性

正如我们强调的那样，泛型是通过擦除来实现的，以缓解进化。当将遗留代码转化为泛型代码时，我们希望确保新生代码能够与任何现有代码一起工作，包括我们没有源
代码的类文件。当这种情况发生时，我们说传统和通用版本是二进制兼容的。

如果擦除通用代码的签名与遗留代码的签名相同，并且两个版本都编译为相同的字节代码，则可以保证二进制兼容性。通常情况下，这是自然发生的自然结果，但在本节
中，我们将看到一些可能导致问题的角落案例。

本节的一些示例摘自Mark Reinhold编写的内部Sun笔记。

调整擦除与集合类中的max方法的生成有关的一个边角情况出现了。我们在第3.2节和第3.6节中讨论了这种情况，但值得快速回顾一下。

这是这种方法的遗留签名：

```java
// 旧版本
public static Object max(Collection coll)
```

这里是自然的通用签名，使用通配符来获得最大的灵活性（参见第 `3.2` 节）：

```java
// 通用版本 - 打破二进制兼容性
public static <T extends Comparable<? super T>>
T max(Collection<? extends T> coll)
```

但是这个签名有错误的擦除 - 它的返回类型是 `Comparable` 而不是 `Object`。 为了获得正确的签名，我们需要使用多重边界来摆弄类型参数的边界（参见第 
`3.6` 节）。 这是更正后的版本：

```java
// 通用版本 - 保持二进制兼容性
public static <T extends Object & Comparable<? super T>>
T max(Collection<? extends T> coll)
```

当有多个边界时，最左边界被用于擦除。 所以 `T` 的删除现在是 `Object`，给出了我们需要的结果类型。

由于原始遗留代码包含的特定类型比它可能具有的特定类型要少，因此会出现一些与遗传有关的问题。 例如，`max` 的遗留版本可能已被赋予返回类型 `Comparable`，
它比 `Object` 更具体，然后就不需要使用多重边界来调整类型。

桥梁另一个重要的角落案例与桥梁有关。 同样，`Comparable` 提供了一个很好的例子。实现 `Comparable` 的大多数遗留核心类提供了 `compareTo` 方法的两个重
载：一个带有参数类型 `Object`，它重写接口中的 `compareTo` 方法; 和一个更具体的类型。 例如，以下是 `Integer` 旧版本的相关部分:

```java
// 旧版本
public class Integer implements Comparable {
public int compareTo(Object o) { ... }
public int compareTo(Integer i) { ... }
...
}
```

这里是相应的通用版本：

```java
// 通用版本 - 保持二进制兼容性
public final class Integer implements Comparable<Integer> {
public int compareTo(Integer i) { ... }
...
}
```

两个版本都具有相同的字节码，因为编译器会为 `compareTo` 与 `Object` 类型的参数生成一个桥接方法（请参阅第 `3.7` 节）。

但是，一些遗留代码仅包含 `Object` 方法。 （在泛型之前，一些程序员认为这比定义两种方法更简洁。）下面是 `javax.naming.Name` 的传统版本.

```java
// 旧版本
public interface Name extends Comparable {
public int compareTo(Object o);
...
}
```

事实上，名称只与其他名称进行比较，所以我们可能希望以下通用版本：

```java
// 通用版本 - 打破二进制兼容性
public interface Name extends Comparable<Name> {
public int compareTo(Name n);
...
}
```

但是，选择这种生成功能会破坏二进制兼容性。 由于遗留类包含 `compareTo(Object)` 而不是 `compareTo(Name)`，因此很可能用户可能已声明 `Name` 的实现提供前者而不是后者。 任何这样的类都不适用于上面给出的通用版本的名称。 唯一的解决办法是选择一个不那么雄心勃勃的基因工程：

```java
// 通用版本 - 保持二进制兼容性
public interface Name extends Comparable<Object> {
public int compareTo(Object o) { ... }
...
}
```

这与旧版本有相同的擦除，并保证与用户可能已定义的任何子类兼容。

在前面的例子中，如果选择了更加雄心勃勃的基因鉴定，那么在运行时会出现错误，因为实现类没有实现 `compareTo(Name)`。

但是在某些情况下，这种差异可能是阴险的：与其提出错误，可能会返回不同的值！例如，`Name` 可以通过 `SimpleName` 类来实现，其中一个简单名称由单个字符
串，`base` 组成，并且比较两个简单名称比较基本名称。进一步说，`SimpleName` 有一个扩展名的子类，其中扩展名有一个基本字符串和一个扩展名。将扩展名与简单
名称进行比较时只比较基本名称，而将扩展名称与另一扩展名称进行比较，比较基数，如果相等，则比较扩展名。假设我们 `Generify Name` 和 `SimpleName`，以便
它们定义 `compareTo(Name)`，但我们没有 `ExtendedName` 的源。由于它只定义了 `compareTo(Object)`，所以调用 `compareTo(Name)` 而不是 
`compareTo(Object)` 的客户端代码将在 `SimpleName`（定义它的位置）而不是 `ExtendedName`（它未定义的地方）上调用该方法，将被比较，但扩展忽略。这在
示例 `8-2` 和示例 `8-3` 中进行了说明。

我们得到的教训是，除非您有信心可以兼容所有亚类，否则每次生成一个班时都要特别小心。请注意，如果将一个类声明为 `final` ，那么您有更多的余地，因为它不能
有子类。

还要注意，如果原始的 `Name` 接口不仅声明了一般重载 `compareTo(Object)`，还声明了更具体的重载 `compareTo(Name)`，那么将需要旧版本的 `SimpleName` 
和 `ExtendedName` 来实现 `compareTo(Name)` 和这里描述的问题不会出现。

**协变覆盖**另一个角落案例与协变覆盖有关（见 `3.8` 节）。 回想一下，如果参数完全匹配，则一个方法可以重写另一个方法，但重写方法的返回类型是另一个方法
的返回类型的子类型。

这是克隆方法的一个应用：

```java
class Object {
public Object clone() { ... }
...
}
```

以下是类 `HashSet` 的旧版本：

```java
// 旧版本
class HashSet {
  public Object clone() { ... }
  ...
}
```

对于通用版本，您可能希望利用协变覆盖并为克隆选择更具体的返回类型：

```java
// 通用版本 - 打破二进制兼容性
class HashSet {
  public HashSet clone() { ... }
  ...
}
```

例 `8-2`。 用于简单和扩展名称的传统代码

```java
interface Name extends Comparable {
  public int compareTo(Object o);
}
class SimpleName implements Name {
  private String base;
  public SimpleName(String base) {
    this.base = base;
  }
  public int compareTo(Object o) {
    return base.compareTo(((SimpleName)o).base);
  }
}
class ExtendedName extends SimpleName {
  private String ext;
  public ExtendedName(String base, String ext) {
    super(base); this.ext = ext;
  }
  public int compareTo(Object o) {
    int c = super.compareTo(o);
    if (c == 0 && o instanceof ExtendedName)
      return ext.compareTo(((ExtendedName)o).ext);
    else
      return c;
  }
}
class Client {
  public static void main(String[] args) {
    Name m = new ExtendedName("a","b");
    Name n = new ExtendedName("a","c");
    assert m.compareTo(n) < 0;
  }
}
```

例 `8-3`。 生成简单的名称和客户端，但不扩展名称

```java   
interface Name extends Comparable<Name> {
  public int compareTo(Name o);
}
class SimpleName implements Name {
  private String base;
  public SimpleName(String base) {
    this.base = base;
  }
  public int compareTo(Name o) {
    return base.compareTo(((SimpleName)o).base);
  }
}

  // use legacy class file for ExtendedName
class Test {
  public static void main(String[] args) {
    Name m = new ExtendedName("a","b");
    Name n = new ExtendedName("a","c");
    assert m.compareTo(n) == 0; // 答案现在不同！
  }
}
```

但是，选择这种生成功能会破坏二进制兼容性。 用户很可能已经定义了覆盖克隆的 `HashSet` 的子类。 任何这样的子类都不适用于之前给出的 `HashSet` 的通用版本。 唯一的解决办法是选择一个不那么雄心勃勃的基因工程：

```java
// 通用版本 - 保持二进制兼容性
class HashSet {
  public Object clone() { ... }
  ...
}
```

这保证与用户可能定义的任何子类兼容。 同样，如果你还可以生成任何子类，或者如果这个类是最终的，那么你有更多的自由。

《《《 [下一节](../ch09/00_Design_Patterns.md)      <br/>
《《《 [返回首页](../README.md)
