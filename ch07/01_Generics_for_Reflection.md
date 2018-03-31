## 反射的泛型

`Java` 支持自 `1.0` 版以来的反射以及 `1.1` 版以后的类文字。 它们的核心是 `Class` 类，它表示运行时对象类型的信息。 您可以编写一个类型，后跟 `.class` 作为文字，表示与该类型相对应的类标记，并且方法 `getClass`在每个对象上定义并返回一个类标记，该标记表示该对象在运行时携带的特定类型信息。 这里是一个例子：

```java
   Class ki = Integer.class;
   Number n = new Integer(42);
   Class kn = n.getClass();
   assert ki == kn;
```

对于给定的类加载器，相同的类型总是由相同的类标记表示。为了强调这一点，在这里我们使用标识符（==运算符）比较类标记。但是，在大多数情况下，使用相等 等于方法）。

`Java 5` 中的一个变化是 `Class` 类现在接受一个类型参数，所以 `Class <T>是类型T的类标记的类型。 前面的代码现在写成如下所示：

```java
   Class<Integer> ki = Integer.class;
   Number n = new Integer(42);
   Class<? extends Number> kn = n.getClass();
   assert ki == kn;
```

类标记和 `getClass` 方法由编译器专门处理。 通常，如果T是一个没有类型参数的类型，那么 `T.class` 的类型为 `Class<T>`，并且如果 `e` 是 `T` 类型的表达式，那么 `e.getClass()` 的类型为 `Class<? extends T>`。 （我们将看到 `T` 在下一节中有类型参数时会发生什么。）通配符是必需的，因为变量引用的对象的类型可能是变量类型的子类型，在这种情况下， 其中 `Number` 类型的变量包含 `Integer` 类型的对象。

对于反射的许多用途，您不会知道类标记的确切类型（如果您确实需要，您可能不需要使用反射），并且在这些情况下，您可以使用 `Class<?>` 编写类型，使用 一个无界的通配符。 但是，在某些情况下，类型参数提供的类型信息是无价的，就像我们在 `6.5` 节中讨论的 `toArray` 的变体一样：

```java
   public static <T> T[] toArray(Collection<T> c, Class<T> k)
```

在这里，类型参数让编译器检查由类标记表示的类型与集合和数组的类型是否匹配。

**用于反射的泛型的其他示例** `Class<T>` 类仅包含几个以有趣的方式使用 `type` 参数的方法：

```java
   class Class<T> {
     public T newInstance();
     public T cast(Object o);
     public Class<? super T> getSuperclass();
     public <U> Class<? extends U> asSubclass(Class<U> k);
     public <A extends Annotation> A getAnnotation(Class<A> k);
     public boolean isAnnotationPresent(Class<? extends Annotation> k);
   ...
   }
```

第一个返回该类的新实例，当然这个实例的类型为 `T`。 第二个将任意对象转换为接收者类，因此它会抛出类抛出异常或返回类型 `T` 的结果。 第三个返回超类，它必须具有指定的类型。 第四个检查接收者类是参数类的一个子类，并且引发一个类转换异常或者返回接收者适当改变的类型。

第五和第六种方法是新注释工具的一部分。 这些方法很有趣，因为它们显示了如何使用类的类型参数来取得良好效果。 例如，保留是注释的一个子类，因此您可以按如下方式在类 `k` 上提取保留注释：

```java
   Retention r = k.getAnnotation(Retention.class);
```

这种通用类型具有两个优点。 首先，这意味着调用结果不需要强制转换，因为泛型类型系统可以精确地指定正确的类型。 其次，这意味着如果您不小心使用类标记调用不是 `Annotation` 子类的类的方法，那么会在编译时而不是在运行时检测到。

类标记的另一种用法类似于注释类，它出现在 `java.awt` 包的 `Component` 类的 `getListeners`` 方法中:

```java
   public <T extends EventListener>
	 T[] getListeners(Class<T> listenerType);
```

同样，这意味着 `getListeners` 的代码不需要强制转换，这意味着编译器可以检查该方法是否使用适当类型的类标记调用。

作为类标记的一个有趣用法的最后一个示例，便捷类 `Collections` 包含一个构建包装的方法，该包装检查添加到给定列表或从给定列表中提取的每个元素是否属于给定类。 （其他集合类也有类似的方法，例如集合和地图。）它具有以下签名：

```java
   public static <T> List<T> checkedList(List<T> l, Class<T> k)
```

包装在编译时通过动态检查来补充静态检查，这对于提高安全性或与遗留代码的接口（见第 `8.1` 节）可能很有用。 该实现调用前面描述的类 `Class` 中的方法，其中接收方是传递到方法中的类标记，并且该转换将应用于使用 `get`，`set` 或 `add` 添加到列表中的任何元素，或者将其写入列表中。 然而，`Class<T>` 的类型参数意味着 `checkedList` 的代码不需要额外的转换（除了调用类类中的 `cast` 方法外），并且编译器可以检查该方法是否使用类标记调用 一个合适的类型。





















