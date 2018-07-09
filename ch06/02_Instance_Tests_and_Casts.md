《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](01_Reifiable_Types.md)

### 实例测试和示例

实例测试和示例取决于运行时检查的类型，因此取决于具体化。 因此，针对不可修饰类型的实例测试会报告错误，并且对不可修饰类型进行强制转换通常会发出警告。

作为一个例子，考虑使用实例测试并以书面形式强制转换。 下面是 `java.lang` 中类 `Integer` 定义的一个片段（从实际源代码稍微简化了一下）：

```java
public class Integer extends Number {
  private final int value;
  public Integer(int value) { 
    this.value=value; 
  }
  public int intValue() { 
    return value; 
  }
  public boolean equals(Object o) {
    if (o instanceof Integer) {
      return value == ((Integer)o).intValue();
    } else 
      return false;
    }
  ...
  }
```

`equals` 方法接受 `Object` 类型的参数，检查对象是否为 `Integer` 类的实例，如果是，则将其转换为 `Integer` 并比较两个整数的值。 此代码可用，因为 
`Integer` 是可重用类型：运行时可以使用检查对象是否为 `Integer` 实例所需的所有信息。

现在考虑一下如何在列表上定义相等性，就像 `java.util` 中的 `AbstractList` 类一样。 定义这个的自然但不正确的方式如下：

```java
import java.util.*;
public abstract class AbstractList<E> extends AbstractCollection<E> implements List<E> {
  public boolean equals(Object o) {
    if (o instanceof List<E>) { // compile-time error
      Iterator<E> it1 = iterator();
      Iterator<E> it2 = ((List<E>)o).iterator(); // unchecked cast
      while (it1.hasNext() && it2.hasNext()) {
        E e1 = it1.next();
        E e2 = it2.next();
        if (!(e1 == null ? e2 == null : e1.equals(e2)))
          return false;
      }
      return !it1.hasNext() && !it2.hasNext();
    } else 
      return false;
    }	   
    ...
  }
```

同样，`equals` 方法接受 `Object` 类型的参数，检查对象是否为 `List<E>` 类型的实例，如果是，则将其转换为 `List<E>` 并比较两个列表中的相应元素。此代
码不起作用，因为 `List<E>` 不是可重用类型：检查对象是否为 `List<E>`的实例所需的某些信息在运行时不可用。您可以测试一个对象是否实现接口 `List`，但不
能测试其类型参数是否为 `E`。事实上，有关 `E` 的信息缺少双倍的数据，因为它不适用于接收方或 `equals` 方法的参数。

（即使这个代码有效，还有一个问题，列表上的相等约定没有提及类型，如果 `List<Integer>` 包含相同的值，那么它们可能与 `List<Object>` 相等。例如，
`[1,2,3]` 应该与自身相等，无论它是否被视为整数列表或对象列表。）

编译上面的代码报告了两个问题，一个是实例测试的错误，另一个是未经检查的演员警告：

```java
% javac -Xlint:unchecked AbstractList.java
AbstractList.java:6: illegal generic type for instanceof
if (!(o instanceof List<E>)) return false; // compile-time error
												 ^
AbstractList.java:8: warning: [unchecked] unchecked cast
found : java.lang.Object
required: List<E>
 Iterator<E> it2 = ((List<E>)o).iterator(); // unchecked cast
														 ^
1 error
1 warning
```

实例检查报告错误，因为没有可能的方法来测试给定对象是否属于类型 `List<E>`。 演员报告未经检查的警告; 它将执行转换，但它不能检查列表元素实际上是否为 
`E` 类型。

为了解决这个问题，我们用可调整类型 `List<?>` 替换了不可保留类型 `List<E>`。 这是一个更正的定义（再次，从实际来源稍微简化）：

```java
import java.util.*;
public abstract class AbstractList<E> extends AbstractCollection<E> implements List<E> {
  public boolean equals(Object o) {
    if (o instanceof List<?>) {
      Iterator<E> it1 = iterator();
      Iterator<?> it2 = ((List<?>)o).iterator();
      while (it1.hasNext() && it2.hasNext()) {
        E e1 = it1.next();
        Object e2 = it2.next();
        if (!(e1 == null ? e2 == null : e1.equals(e2)))
          return false;
      }
      return !it1.hasNext() && !it2.hasNext();
    } else 
      return false;
    }
    ...
   }
```

除了更改实例测试和强制类型外，第二个迭代器的类型也从 `Iterator<E>` 更改为 `Iterator<?>`，第二个元素的类型从 `E` 更改为 `Object`。 代码类型检查，
因为即使第二个迭代器的元素类型是未知的，它也保证它必须是 `Object` 的一个子类型，并且对 `equals` 的嵌套调用只需要它的第二个参数是一个对象。

（这段代码正确地满足列表上的等式约定，现在如果一个 `List<Integer>` 包含相同的值，那么它们将等于一个 `List<Object>`。）

替代修复是可能的。 而不是通配符类型 `List<?>` 和 `Iterator<?>`，您可以使用原始类型 `List` 和 `Iterator`，这些类型也是可验证的。 我们建议使用无界
通配符类型而不是原始类型，因为它们提供了更强的静态类型保证; 如果您使用原始类型，那么在使用无界通配符时只会将标记为警告的许多错误标记为警告。 此外，您
可以将第一个迭代器的声明更改为 `Iterator<?>`，将第一个元素的声明更改为 `Object`，以使它们与第二个迭代器匹配，并且代码仍然会进行类型检查。 我们建议
始终使用尽可能具体的类型声明; 这有助于编译器捕获更多错误并编译更高效的代码。

**不可接受的转换**对不可转换类型的实例测试通常是错误的。 但是，在某些情况下，转换为不可赋予的类型是允许的。

例如，以下方法将集合转换为列表：

```java
public static <T> List<T> asList(Collection<T> c) throws InvalidArgumentException {
  if (c instanceof List<?>) {
    return (List<T>)c;
  } else 
    throw new InvalidArgumentException("Argument not a list");
}
```

编译此代码将成功，不会出现错误或警告。 实例测试没有错误，因为 `List<?>` 是可重用的类型。 由于转换源的类型为 `Collection<T>`，转换不会报告警告，并且
任何实现了接口 `List` 的类型的对象实际上都必须具有 `List<T>` 类型。

**未经检查的强制转换**编译器很少能够确定如果强制转换为不可继承类型，则必须产生该类型的值。在其余情况下，对不可修饰的类型进行强制转换时将标记未经检查
的警告，而针对不可修饰类型的实例测试始终会被捕获为错误。这是因为对于无法执行的实例测试而言，从来没有任何意义，但是可能存在无法检查的强制转换。

类型系统推断出程序的事实 - 例如，某个变量总是包含一个字符串列表。但是没有哪种类型的系统是完美的总会有一些程序员可以推论出来的事实，但是类型系统却没
有。为了允许程序员在这种情况下找到解决方法，编译器在执行某些强制转换时发出警告而不是错误。

例如，下面是将对象列表提升为字符串列表的代码，如果对象列表仅包含字符串，则会抛出类转换异常：

```java
class Promote {
  public static List<String> promote(List<Object> objs) {
    for (Object o : objs)
      if (!(o instanceof String))
        throw new ClassCastException();
    return (List<String>)(List<?>)objs; // unchecked cast
  }
  public static void main(String[] args) {
    List<Object> objs1 = Arrays.<Object>asList("one","two");
    List<Object> objs2 = Arrays.<Object>asList(1,"two");
    List<String> strs1 = promote(objs1);
    assert (List<?>)strs1 == (List<?>)objs1;
    boolean caught = false;
    try {
      List<String> strs2 = promote(objs2);
    } catch (ClassCastException e) { 
      caught = true; 
    }
    assert caught;
  }
}
```

如果任何对象不是字符串，该方法会在对象列表上抛出循环并抛出类抛出异常。 因此，当方法的最后一行到达时，将对象列表转换为字符串列表是安全的。

但编译器无法推断出这一点，因此程序员必须使用未经检查的 `cast`。将对象列表转换为字符串列表是非法的，因此必须分两步进行。 首先，将对象列表转换为通配符
类型列表; 这个演员是安全的。 其次，将通配符类型列表转换为字符串列表; 此演员阵容是允许的，但会产生未经检查的警告：

```java
 % javac -Xlint:unchecked Promote.java
 Promote.java:7: warning: [unchecked] unchecked cast
 found : java.util.List
 required: java.util.List<java.lang.String>
	 return (List<String>)(List<?>)objs; // unchecked cast
						 ^
 1 warning
```

测试代码将该方法应用于两个列表，一个仅包含字符串（因此成功），另一个包含整数（因此引发异常）。在第一个断言中，为了比较对象列表和字符串列表，我们必须
首先将两个类型转换为类型 `List<?>`（这个转换是安全的），因为尝试比较列表中的对象列表和字符串列表会产生一个类型错误。

如果原始列表仅包含字符串，则可以使用完全相同的技术将原始列表提升为字符串列表。这种技术对于将遗留代码和泛型代码进行拟合很重要，也是使用擦除来实现泛型
的主要原因之一。相关技术在第 `8.1` 节中讨论。

在 `5.4.1` 节中，我们需要对元素类型（`E`）进行未经检查的转换，以使传统add方法返回的值的类型与其泛型相匹配签名。

您应该尽量减少代码中未经检查的强制转换次数，但有时候，如上所述，它们是无法避免的。在本书中，我们遵循这样一个惯例，即我们总是将评论放在包含演员阵容的
一行上，以表明这是一种有意的解决方法，而不是无意中的滑动;我们建议你也这样做。将注释放在与转换相同的行上非常重要，以便在扫描编译器发出的警告时很容易确
认每行都包含注释。如果没有，那么你应该把警告等同于一个错误！

如果某个方法故意包含未经检查的强制转换，则可能希望在注释之前添加注释 `@SuppressWarnings(“unchecked”)` 以避免虚假警告。 我们在 `5.4.1` 节看到了这
种技术的应用。

作为使用未经检查的强制转换的另一个例子，在第 `6.5` 节中，我们将看到使用类型为 `Object[]` 的未经检查强制类型转换为 `T []` 的代码。 由于对象数组的创
建方式，事实上，它确保数组始终具有正确的类型。

在 `C` 中（和它的后代 `C++`）未经检查的强制转换比在 `Java` 中未经检查的强制转换危险得多。 与 `C` 不同，即使存在未经检查的强制转换，`Java` 运行时也
能保证重要的安全属性; 例如，绝不允许使用数组边界之外的索引访问数组。 尽管如此，在 `Java` 中未经检查的强制转换是一种解决方法，应谨慎使用。

《《《 [下一节](03_Exception_Handling.md)      <br/>
《《《 [返回首页](../README.md)
