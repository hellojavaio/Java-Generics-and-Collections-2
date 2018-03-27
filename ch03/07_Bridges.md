## 桥梁

正如我们前面提到的，泛型是通过擦除来实现的：当你用泛型编写代码时，它的编译方式几乎与没有泛型编写的代码完全相同。在参数化接口（如 `Comparable<T>`）的情况下，这可能会导致编译器插入其他方法;这些附加的方法被称为网桥。

示例 `3-6` 显示了 `Comparable` 接口以及泛型之前的 `Java` 中的 `Integer` 类的简化版本。在非通用接口中，`compareTo` 方法接受一个 `Object` 类型的参数。在非泛型类中，有两个 `compareTo` 方法。第一个是您可能期望的简单方法，用于将整数与另一个整数进行比较。第二个将整数与任意对象进行比较：它将该对象转换为整数并调用第一个方法。第二种方法对于重写 `Comparable` 接口中的 `compareTo` 方法是必需的，因为只有当方法签名相同时才会覆盖。这第二种方法被称为桥梁。

例 `3-7` 显示了当 `Comparable` 接口和 `Integer` 类被基因化时发生了什么。在通用接口中，`compareTo` 方法接受 `T` 类型的参数。在泛型类中，单个 `compareTo` 方法接受 `Integer` 类型的参数。

桥接方法由编译器自动生成。 事实上，这两个示例的编译版本的代码基本相同。

例3-6。 传统的可比较整数的代码

```java
   interface Comparable {
     public int compareTo(Object o);
   }
   class Integer implements Comparable {
     private final int value;
     public Integer(int value) { this.value = value; }
     public int compareTo(Integer i) {
       return (value < i.value) ? -1 : (value == i.value) ? 0 : 1;
     }
     public int compareTo(Object o) {
       return compareTo((Integer)o);
     }
   }
```

例3-7。 可比较整数的通用代码

```java
   interface Comparable<T> {
     public int compareTo(T o);
   }
   class Integer implements Comparable<Integer> {
	 private final int value;
	 public Integer(int value) { this.value = value; }
	 public int compareTo(Integer i) {
	   return (value < i.value) ? -1 : (value == i.value) ? 0 : 1;
	 }
   }
```

如果您应用反射，您可以看到桥。 这里是代码，它使用 `toGenericString` 来打印方法的通用签名（参见 `7.5` 节），在 `Integer` 类中查找名称为 `compareTo` 的所有方法。

```java
   for (Method m : Integer.class.getMethods())
     if (m.getName().equals("compareTo"))
	 System.out.println(m.toGenericString());
```

在通用版本的Integer类上运行此代码会产生以下输出：

```java
   public int Integer.compareTo(Integer)
   public bridge int Integer.compareTo(java.lang.Object)
```

这确实包含两种方法，一种是采用 `Integer` 类型参数的声明方法，另一种是采用 `Object` 类型参数的桥接方法。 （截至撰写本文时，`Sun JVM` 打印的是 `volatile` 而不是 `bridge`，因为`Java` 字节码中用于指示网桥方法的位也用于指示易失性字段;预计此错误将在未来版本中得到修复。）

将旧版代码转换为使用泛型时，网桥可以发挥重要作用; 见 `8.4` 节。





































