## 擦除的工作原理

擦除类型的定义如下：从参数化类型中删除所有类型参数，并用删除它的边界来替换任何类型变量，或者如果它没有边界，则使用 `Object`;或者如果它具有最左边界的删除 多边界。 这里有些例子：

    - `List<Integer>`，`List<String>` 和 `List<List<String>>` 的删除是 `List`。
    - `List<Integer>[]` 的删除是 `List[]`。
    - 清除 `List` 本身，对于任何原始类型都是同样的（关于原始类型的解释请参见第 `5.3` 节）。
    - `int` 的删除本身，类似于任何原始类型。
    - 整数的删除本身，类似于没有类型参数的任何类型。
    - 在 `asList` 的定义中删除 `T`（参见 `1.4` 节）是 `Object`，因为 `T` 没有界限。
    - 在 `max` 的定义中删除 `T`（参见 `3.2` 节）是 `Comparable`，因为 `T` 绑定了 `Comparable<? super T>`。
    - 在 `max` 的最终定义中删除 `T`（参见 `3.6` 节）是 `Object`，因为 `T` 绑定了 `Object & Comparable <T>`，我们删除最左边的边界。
    - 拷贝定义中的 `S` 和 `T` 的删除（参见第 `3.6` 节）是可读和可追加的，因为 `S` 绑定了可读和可关闭，并且 `T` 已绑定了可附加和可关闭。
    - 删除 `LinkedCollection<E>.Node` 或 `LinkedCollection.Node<E>`（请参阅第 `4.3` 节）为 `LinkedCollection.Node`。
	
在 `Java` 中，两种不同的方法不能具有相同的签名。 由于泛型是通过擦除来实现的，因此两种不同的方法不能具有相同擦除的签名。 一个类不能重载其签名具有相同擦除的两个方法，而一个类不能实现具有相同擦除的两个接口。

例如，这里有一个有两种便利方法的类。 一个将整数列表中的每个整数加在一起，另一个将字符串列表中的每个字符串连接在一起：	

```java
   class Overloaded {
     public static int sum(List<Integer> ints) {
       int sum = 0;
	   for (int i : ints) sum += i;
	   return sum;
     }
     public static String sum(List<String> strings) {
       StringBuffer sum = new StringBuffer();
       for (String s : strings) sum.append(s);
       return sum.toString();
     }
  }
```

这按预期工作：

```java
   assert sum(Arrays.asList(1,2,3)) == 6;
   assert sum(Arrays.asList("a","b")).equals("ab");
```

以下是两种方法签名的删除：

```java
  int sum(List)
  String sum(List)
```

这两种方法有不同的返回类型，这足以让 `Java` 区分它们。

但是，假设我们改变了方法，以便每个方法都将其结果附加到参数列表的末尾，而不是返回一个值：

```java
   class Overloaded2 {
     // 编译时错误，不能重载两个擦除相同的方法
	 public static boolean allZero(List<Integer> ints) {
	   for (int i : ints) if (i != 0) return false;
	     return true;
	 }
	 public static boolean allZero(List<String> strings) {
	  for (String s : strings) if (s.length() != 0) return false;
		return true;
	 }
   }
```

我们打算让这个代码工作如下：

```java
   assert allZero(Arrays.asList(0,0,0));
   assert allZero(Arrays.asList("","",""));
```

但是，在这种情况下，两种方法的签名的删除是相同的：

```java
   boolean allZero(List)
```

因此，编译时会报告名称冲突。 不可能给两个方法使用相同的名称，并尝试通过重载来区分它们，因为在擦除之后不可能区分一个方法调用和另一个方法调用。

再举一个例子，这里是整数类的一个不好的版本，它试图使一个整数与一个整数或一个长整数进行比较：

```java
   class Integer implements Comparable<Integer>, Comparable<Long> {
     // 编译时错误，不能实现两个擦除相同的接口
     private final int value;
     public Integer(int value) { this.value = value; }
     public int compareTo(Integer i) {
       return (value < i.value) ? -1 : (value == i.value) ? 0 : 1;
     }
     public int compareTo(Long l) {
       return (value < l.value) ? -1 : (value == l.value) ? 0 : 1;
     }
   }
```

如果这得到支持，通常需要对桥接方法进行复杂而混乱的定义（参见第 `3.7` 节）。 到目前为止，最简单和最容易理解的选择是禁止这种情况。















