《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](03_Function.md)

### 策略

策略模式用于将方法与对象分离，使您可以提供许多可能的方法实例。我们对战略模式的讨论说明了许多面向对象程序中的结构化技术，即并行类层次结构。我们将通过
考虑纳税人如何应用不同的税收策略来说明战略模式。纳税人将会有一个等级制度，并且有一个相关的税收策略等级制度。例如，有一个适用于任何纳税人的默认策略。
纳税人的一个子类是信任，而默认策略的一个子类只适用于信任。

我们的讨论还将说明一种常用类型的技术 - 使用带递归边界的类型变量。我们已经在Comparable接口和Enum类的定义中看到了这个技巧;这里我们将用它来阐明纳税人与
相关税收策略之间的关系。我们还解释了 `getThis` 技巧，它允许我们为具有递归边界的类型变量出现时为此指定更精确的类型。

首先，我们将看看策略模式的基本版本，该模式展示了如何使用泛型来设计并行类层次结构。接下来，我们将看一个高级版本，其中对象包含自己的策略，它使用具有递
归边界的类型变量并解释 `getThis` 技巧。

本节中的例子是在与 `Heinz M. Kabutz` 的讨论中开发的，也出现在他的在线出版物 `The Java Specialists'Newsletter` 中。

并行类层次结构策略模式的典型用法是税收计算，如例 `9-6` 所示。我们有一个带有 `Person` 和 `Trust` 子类的 `TaxPayer` 类。每个纳税人都有收入，此外，信
托可能是非营利性的。例如，我们

例 `9-6`。具有并行类层次结构的基本策略模式

```java
abstract class TaxPayer {
  public long income; // in cents
  public TaxPayer(long income) { 
    this.income = income; 
  }
  public long getIncome() { 
    return income; 
  }
}
class Person extends TaxPayer {
  public Person(long income) { 
    super(income); 
  }
}
class Trust extends TaxPayer {
  private boolean nonProfit;
  public Trust(long income, boolean nonProfit) {
    super(income); 
    this.nonProfit = nonProfit;
  }
  public boolean isNonProfit() { 
    return nonProfit; 
  }
}
interface TaxStrategy<P extends TaxPayer> {
  public long computeTax(P p);
}
class DefaultTaxStrategy<P extends TaxPayer> implements TaxStrategy<P> {
  private static final double RATE = 0.40;
  public long computeTax(P payer) {
    return Math.round(payer.getIncome() * RATE);
  }
}
class DodgingTaxStrategy<P extends TaxPayer> implements TaxStrategy<P> {
  public long computeTax(P payer) { 
    return 0; 
  }
}
class TrustTaxStrategy extends DefaultTaxStrategy<Trust> {
  public long computeTax(Trust trust) {
    return trust.isNonProfit() ? 0 : super.computeTax(trust);
  }
}
```

可以定义一个收入为 `100,000.00` 美元的人和两个收入相同的信托人，一个非营利组织和一个非营利组织。

```java
Person person = new Person(10000000);
Trust nonProfit = new Trust(10000000, true);
Trust forProfit = new Trust(10000000, false);
```

按照良好的做法，我们用长整数表示所有的货币价值，例如收入或税收，以毫秒为单位表示价值（参见“有效性的一般编程”一章中的“避免浮动和双重，如果需要确切答案”  `Java` 由 `Joshua Bloch`，`Addison-Wesley`编写）。

对于每个纳税人` P`，可能有许多可能的计算税收策略。 每个策略实现接口 `TaxStrategy<P>`，该接口指定一个方法计算 `Tax`，该方法将 `P` 作为纳税人的参数并返回所支付的税金。 类`DefaultTaxStrategy` 通过将收入乘以 `40％` 的固定税率来计算税额，而 `DodgingTaxStrategy` 则始终计算零税额：

```java
TaxStrategy<Person> defaultStrategy = new DefaultStrategy<Person>();
TaxStrategy<Person> dodgingStrategy = new DodgingStrategy<Person>();
assert defaultStrategy.computeTax(person) == 4000000;
assert dodgingStrategy.computeTax(person) == 0;
```

当然，我们的例子是为了说明而简化的 - 我们不建议您使用这些策略中的任何一种来计算税收！ 但是应该清楚这些技术是如何延伸到更复杂的纳税人和税收策略的。最后，如果信托是非营利组织，并且使用默认税策略，则 `TrustTaxStrategy` 类计算零税额：

```java
TaxStrategy<Trust> trustStrategy = new TrustTaxStrategy();
assert trustStrategy.computeTax(nonProfit) == 0;
assert trustStrategy.computeTax(forProfit) == 4000000;
```

泛型允许我们将给定的税收策略专门化为给定类型的纳税人，并允许编制者检测何时将税策略应用于错误类型的纳税人：

```java
trustStrategy.computeTax(person); // 编译报错
```

没有泛型，`TrustTaxStrategy` 的 `computeTax` 方法将不得不接受 `TaxPayer` 类型的参数并将其转换为 `Trust` 类型，并且错误会在运行时抛出异常，而不是在编译时捕获。

这个例子说明了许多面向对象程序中的结构化技术 - 即并行类层次结构。在这种情况下，一个类层次结构由 `TaxPayer`，`Person` 和 `Trust` 组成。并行类层次结构由与以下每个策略相对应的策略组成：两种策略：`DefaultTaxStrategy` 和 `DutingTaxStrategy` 适用于任何 `TaxPayer`，没有专门的策略适用于 `Person`，并且 `Trust` 有一个专门的策略。

通常，这种并行层次结构之间存在某种联系。在这种情况下，与给定 `TaxPayer` 并行的 `TaxStrategy` 的 `computeTax` 方法需要具有相应类型的参数;例如，`TrustTaxStrategy` 的 `computeTax` 方法需要一个 `Trust` 类型的参数。对于泛型，我们可以在类型本身中整齐地捕捉这个连接。在这种情况下，`TaxStrategy<P>` 的 `computeTax` 方法需要 `P` 类型的参数，其中 `P` 必须是 `TaxPayer` 的子类。使用我们在此描述的技术，泛型通常可用于捕获其他并行类层次结构中的类似关系。

具有递归泛型的高级策略模式在策略模式的更高级用途中，对象包含要应用于其的策略。建模这种情况需要递归泛型类型，并利用一种技巧为此指定一个泛型类型。修订后的战略模式如示例 `9-7` 所示。在高级版本中，每个纳税人对象都包含自己的税收策略，每种纳税人的构造函数都包含一个税收策略作为附加参数：

```java
Person normal = new Person(10000000, new DefaultTaxStrategy<Person>());
Person dodger = new Person(10000000, new DodgingTaxStrategy<Person>());
Trust nonProfit = new Trust(10000000, true, new TrustTaxStrategy());
Trust forProfit = new Trust(10000000, false, new TrustTaxStrategy());
```

现在我们可以直接在纳税人上调用一个没有参数的 `computeTax` 方法，然后调用税收策略的 `computeTax` 方法，并向纳税人传递：

```java
assert normal.computeTax() == 4000000;
assert dodger.computeTax() == 0;
assert nonProfit.computeTax() == 0;
assert forProfit.computeTax() == 4000000;
```

这种结构往往是可取的，因为可以将给定的税收策略直接与给定的纳税人联系起来。

之前，我们使用了 `TaxPayer` 类和接口 `TaxStrategy<P>`，其中类型变量 `P` 代表策略适用的 `TaxPayer` 的子类。 现在我们必须将类型参数 `P` 添加到两者中，以便类 `TaxPayer<P>` 可以具有类型 `TaxStrategy<P>` 的字段。 类型变量 `P` 的新声明必须是递归的，如 `TaxPayer` 类的新标题所示：

```java
class TaxPayer<P extends TaxPayer<P>>
```

我们在之前看到过类似的递归头文件：

```java
interface Comparable<T extends Comparable<T>>
class Enum<E extends Enum<E>>
```

在所有这三种情况下，类或接口都是类型层次结构的基类，类型参数代表基类的特定子类。 因此，`TaxPayer<P>` 中的 `P` 代表特定类型的纳税人，例如 `Person` 或 `Trust`; 就像 `Comparable<T>` 中的 `T` 代表被比较的特定类，比如 `String`; 或 `Enum<E>` 中的 `E` 表示特定枚举类型，如季节。

纳税人类包含一个税收策略字段和一个将纳税人转到税收策略的方法，以及一个像 `TaxPayer` 中使用的 `P` 一样的递归声明。 总的来说，我们可能期望它看起来像这样：

```java
// not well-typed!
class TaxPayer<P extends TaxPayer<P>> {
  private TaxStrategy<P> strategy;
  public long computeTax() { 
    return strategy.computeTax(this); 
  }
  ...
}
class Person extends TaxPayer<Person> { ... }
class Trust extends TaxPayer<Trust> { ... }
```

但编译器拒绝上面的类型错误。 问题是这有 `TaxPayer<P>` 类型，而 `computeTax` 的参数必须有 `P` 类型。 事实上，在每个具体的纳税人类别中，例如人员或信任，这种情况确实具有类型 `P`; 例如，`Person` 扩展了 `TaxPayer<Person>`，所以 `P` 与此类中的 `Person` 相同。 所以，实际上，这将与 `P` 具有相同的类型，但类型系统不知道！

我们可以用一个技巧来解决这个问题。 在基类 `TaxPayer<P>` 中，我们定义了一个抽象方法 `getThis`，其目的是返回与此相同的值，但赋予其类型 `P`. 该方法在与特定种类的纳税人相对应的每个类中实例化，例如 `Person` 或 `Trust`，其类型实际上与 `P` 类型相同。 概括地说，修正的代码现在看起来像这样：

```java
// now correctly typed
abstract class TaxPayer<P extends TaxPayer<P>> {
  private TaxStrategy<P> strategy;
  protected abstract P getThis();
  public long computeTax() { return strategy.computeTax(getThis()); }
  ...
}
final class Person extends TaxPayer<Person> {
  protected Person getThis() { return this; }
  ...
}
final class Trust extends TaxPayer<Trust> {
  protected Trust getThis() { return this; }
  ...
}
```

与以前的代码不同之处在于粗体。 这个的出现被调用 `getThis` 所取代; 方法 `getThis` 在基类中声明为抽象，并且在基类的每个最终子类中都适当地实例化。 基类 `TaxPayer<P>` 必须声明为 `abstract`，因为它声明了 `getThis` 的类型，但未声明正文。 `getThis` 的主体在 `Person` 和 `Trust` 的最后一个子类中声明。

由于信任被声明为最终的，所以它不能有子类。 假设我们想要一个 `Trust` 的子类 `NonProfitTrust`。 那么我们不仅需要删除 `Trust` 类的最终声明，还需要为其添加一个类型参数。 以下是所需代码的草图：

```java
abstract class Trust<T extends Trust<T>> extends TaxPayer<T> { ... }
final class NonProfitTrust extends Trust<NonProfitTrust> { ... }
final class ForProfitTrust extends Trust<ForProfitTrust> { ... }
```

例 `9-7`。 具有递归边界的高级策略模式

```java
abstract class TaxPayer<P extends TaxPayer<P>> {
  public long income; // in cents
  private TaxStrategy<P> strategy;
  public TaxPayer(long income, TaxStrategy<P> strategy) {
    this.income = income; this.strategy = strategy;
  }
  protected abstract P getThis();
  public long getIncome() { 
    return income; 
  }
  public long computeTax() { 
    return strategy.computeTax(getThis()); 
  }
}
class Person extends TaxPayer<Person> {
  public Person(long income, TaxStrategy<Person> strategy) {
    super(income, strategy);
  }
  protected Person getThis() { 
    return this; 
  }
}
class Trust extends TaxPayer<Trust> {
  private boolean nonProfit;
  public Trust(long income, boolean nonProfit, TaxStrategy<Trust> strategy){
    super(income, strategy); this.nonProfit = nonProfit;
  }
  protected Trust getThis() { 
    return this; 
  }
  public boolean isNonProfit() { 
    return nonProfit; 
  }
}
interface TaxStrategy<P extends TaxPayer<P>> {
  public long computeTax(P p);
}
class DefaultTaxStrategy<P extends TaxPayer<P>> implements TaxStrategy<P> {
  private static final double RATE = 0.40;
  public long computeTax(P payer) {
    return Math.round(payer.getIncome() * RATE);
  }
}
class DodgingTaxStrategy<P extends TaxPayer<P>> implements TaxStrategy<P> {
  public long computeTax(P payer) { return 0; }
}
class TrustTaxStrategy extends DefaultTaxStrategy<Trust> {
  public long computeTax(Trust trust) {
    return trust.isNonprofit() ? 0 : super.computeTax(trust);
  }
}
```

现在，`NonProfitTrust` 的一个实例采用一种策略，该策略期望 `NonProfitTrust` 作为参数，而 `ForProfitTrust` 的行为相似。 以这种方式设置参数化类型层
次结构通常很方便，其中带有子类的类带有类型参数并且是抽象的，而没有子类的类不带类型参数并且是最终的。`getThis` 方法的主体在每个最终的子类中声明。

总结正如我们所看到的，递归类型参数经常出现在 `Java` 中：

```java
  class TaxPayer<P extends TaxPayer<P>>
  Comparable<T extends Comparable<T>>
  class Enum<E extends Enum<E>>
```

`getThis` 技巧在这种情况下非常有用，只要有人想在基类型中使用这个类型参数提供的更具体的类型。

我们将在下一节看到递归类型参数的另一个例子，它应用于两个相互递归的类。 不过，虽然 `getThis` 技巧通常很有用，但我们不会要求它。

《《《 [下一节](05_Subject-Observer.md)      <br/>
《《《 [返回首页](../README.md)
