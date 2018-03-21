《《《 [返回首页](../README.md)      <br/>
《《《 [上一节](01_Generics.md)

### 装箱与拆箱

回想一下，`Java` 中的每种类型都是引用类型或基本类型。 引用类型是任何类，接口或数组类型。 所有引用类型都是 `Object` 类的子类型，任何引用类型的变量都
可以设置为 `null`。 如下表所示，有八种基本类型，每种都有相应的类库的引用类型。 类库位于 `java.lang` 包：
  
原始类型 | 引用类型
---|---
`byte` |`Byte`
`short` |`Short`
`int` |`Integer`
`long` |`Long`
`float` |`Float`
`double` |`Double`
`boolean` |`Boolean`
`char` |`Character`

将原始类型转换为相应的引用类型称为装箱，并将引用类型转换为相应的原始类型称为拆箱。

带泛型的 `Java` 在适当的地方自动装箱和拆箱。 如果 `int` 类型的表达式 `E` 出现在需要 `Integer` 类型值的地方，那么装箱会将其转换为新的
`Integer`（e）（但是，它可能会缓存经常出现的值）。 如果 `Integer` 类型的表达式 `E` 出现在期望 `int` 类型的值处，则拆箱将其转换为表达
式 `e.intValue()`。例如，序列

```java
  List<Integer> ints = new ArrayList<Integer>();
  ints.add(1);
  int n = ints.get(0);
```
  
相当于序列:
  
```java
  List<Integer> ints = new ArrayList<Integer>();
  ints.add(Integer.valueOf(1));
  int n = ints.get(0).intValue();
```
  
调用 `Integer.valueOf(1)` 与新的 `Integer(1)` 表达式类似，但是可能会缓存一些值以提高性能，正如我们稍后解释的那样。

在这里，再次，是代码来找到一个整数列表的总和，方便打包为一个静态的方法：

```java
  public static int sum (List<Integer> ints) {
  int s = 0;
  for (int n : ints) { s += n; }
  return s;
  }
```
  
为什么参数的类型是 `List<Integer>` 而不是 `List<int>`？ 因为类型参数必须始终绑定到引用类型，而不是基本类型。 

为什么结果有类型 `int` 和不是 `Integer`？ 因为结果类型可能是原始类型或引用类型，使用前者比后者更有效。

拆箱在列表中的每个整数都绑定到 `int` 类型的变量`n`时发生。  

我们可以重写这个方法，用Integer来替换每个 `int` 的出现：

```java
  public static Integer sumInteger(List<Integer> ints) {
    Integer s = 0;
    for (Integer n : ints) { s += n; }
    return s;
  }
```

此代码编译，但执行了很多不必要的工作。 循环的每个迭代将 `s` 和 `n` 中的值拆箱，执行加法操作，然后再次结束结果。使用`Sun`当前的编译器，测量结果显示该
版本大约为比原来慢60％。
  
注意这个！ 装箱和拆箱的一个微妙之处在于 `==` 在原语和参考类型上的定义是不同的。 在 `int` 类型上，它是由值相等来定义的，而`Integer`类型则由对象标识
来定义。 所以下面的两个断言使用 `Sun` 的 `JVM` 成功： 
  
```java
  List<Integer> bigs = Arrays.asList(100,200,300);
  assert sumInteger(bigs) == sum(bigs);
  assert sumInteger(bigs) != sumInteger(bigs); // 不推荐
```

在第一个断言中，拆箱会导致值进行比较，所以结果是相同的。在第二个断言中，没有拆箱，两个方法调用返回不同整数对象，所以即使两个整数对象都表示结果也是不
相等的相同的值，`600`。我们建议您不要使用 `==` 来比较类型的值 `Integer`。 要么首先取消装箱，所以 `==` 比较 `int` 类型的值，否则使用 `equals` 比较
`Integer`类型的值。
 
更精妙的是装箱值可以被缓存。 装箱时需要缓存一个介于 `-128` 和 `127` 之间的 `int` 或 `short` 值，一个介于'\ u0000'和之间的char值'\ u007f'，一个字
节或一个布尔值; 并在装箱时允许进行缓存。因此，与我们之前的例子相比，我们有以下几点：

```java
  List<Integer> smalls = Arrays.asList(1,2,3);
  assert sumInteger(smalls) == sum(smalls);
  assert sumInteger(smalls) == sumInteger(smalls); // 不推荐
```
 
这是因为 `6` 小于 `128`，所以装箱数值 `6` 总是返回正确的同一个对象。 一般来说，没有规定两次是否装箱相同的值返回相同或不同的对象，所以前面显示的不等
式断言也可以取决于实施失败或成功。 即使是小的值，为什么 `==` 将正确比较 `Integer` 类型的值，我们建议不要使用它。 它更清晰和更清洁使用 `equals` 而不
是 `==` 来比较引用类型的值，例如 `Integer` 或 `String`。
 
《《《 [下一节](03_Foreach.md)   <br/>
《《《 [返回首页](../README.md)
