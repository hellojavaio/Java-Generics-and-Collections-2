## 构造函数

在泛型类中，类型参数出现在声明类的头中，但不在构造函数中：

```java
   class Pair<T, U> {
	 private final T first;
	 private final U second;
	 public Pair(T first, U second) { this.first=first; this.second=second; }
	 public T getFirst() { return first; }
	 public U getSecond() { return second; }
   }
```

类型参数 `T` 和 `U` 在类的开头声明，而不在构造函数中声明。 但是，实际的类型参数在调用时会传递给构造函数：

```java
   Pair<String, Integer> pair = new Pair<String, Integer>("one",2);
   assert pair.getFirst().equals("one") && pair.getSecond() == 2;
```

**注意这一点！**一个常见的错误是在调用构造函数时忘记类型参数：

```java
   Pair<String, Integer> pair = new Pair("one",2);
```

这个错误会产生警告，但不会产生错误。 它被认为是合法的，因为 `Pair` 被视为原始类型，但是从原始类型转换为相应的参数化类型会生成未经检查的警告; 见 `5.3` 节，它解释了 `-Xlint：unchecked` 标志如何帮助你发现这种错误。