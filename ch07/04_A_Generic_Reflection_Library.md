《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](03_Reflection_for_Primitive_Types.md)

## 一个通用的反射库

正如我们所看到的，粗心使用未经检查的演员阵容可能会导致问题，例如违反广告中的真相原则或不雅暴露原则（参见第 `6.5` 节和第 `6.6` 节）。 最小化使用未经检查的强制转换的一种技术是将它们封装在库中。 该库可以仔细检查以确保其使用未经检查的强制转换是安全的，而调用该库的代码可以没有未经检查的强制转换。 `Sun` 正在考虑添加类似于这里描述的库方法。

例 `7-1` 提供了一个以类型安全的方式使用反射的通用函数库。 它定义了一个包含以下方法的便捷类 `GenericReflection`：

```java
   public static <T> T newInstance(T object)
   public static <T> Class<? extends T> getComponentType(T[] a)
   public static <T> T[] new Array(Class<? extends T> k, int size)
   public static <T> T[] newArray(T[] a, int size)
```

第一个接受一个对象，找到该对象的类，并返回该类的新实例;这必须与原始对象具有相同的类型。第二个接收数组并返回一个类标记作为其组件类型，如其运行时类型信息所携带的。相反，第三个分配一个新的数组，其组件类型由给定的类标记和指定的大小指定。第四个接受一个数组和一个大小，并且分配一个与给定数组和给定大小具有相同组件类型的新数组;它只是构成对前两种方法的调用。前三种方法中的每一种的代码都包含对 `Java` 反射库中一个或两个相应方法的调用，以及对相应返回类型的未检查转换。

由于各种原因，`Java` 反射库中的方法无法返回足够精确的类型，因此需要未经检查的强制转换。方法 `getComponentType` 位于 `Class<T>` 类中，并且 `Java` 无法将方法的签名中的接收方类型限制为 `Class <T[]>`（尽管如果接收方不是类，该调用会引发异常令牌为数组类型）。 `java.lang.reflect.Array` 中的 `newInstance` 方法必须具有返回类型 `Object` 而不是返回类型 `T[]`，因为它可能会返回基本类型的数组。方法 `getClass` 在类型 `T` 的接收器上调用时返回不是类型为 `Class <? extends T>` 但类型 `Class <?>`，因为需要擦除以确保类令牌始终具有可调整类型。但是，在每种情况下，未经检查的转换都是安全的，用户可以调用这里定义的四个库例程而不违反铸铁保证。

例7-1。 用于泛型反射的类型安全库

```java
   class GenericReflection {
     public static <T> T newInstance(T obj) throws InstantiationException, IllegalAccessException, InvocationTargetException, NoSuchMethodException {
       Object newobj = obj.getClass().getConstructor().newInstance();
       return (T)newobj; // unchecked cast
     }
     public static <T> Class<? extends T> getComponentType(T[] a) {
       Class<?> k = a.getClass().getComponentType();
       return (Class<? extends T>)k; // unchecked cast
     }
     public static <T> T[] newArray(Class<? extends T> k, int size) {
       if (k.isPrimitive())
         throw new IllegalArgumentException ("Argument cannot be primitive: "+k);
       Object a = java.lang.reflect.Array.newInstance(k, size);
       return (T[])a; // unchecked cast
     }
     public static <T> T[] newArray(T[] a, int size) {
       return newArray(getComponentType(a), size);
     }
   }
```

第一种方法优先于 `Class.newInstance` 使用 `Constructor.newInstance`（在 `java.lang.reflect` 中），以避免后者出现已知问题。引用 `Sun` 的 `Class.newInstance` 文档：“请注意，此方法传播由 `nullary` 构造函数抛出的任何异常，包括检查的异常。使用此方法可以有效绕过编译时异常检查，否则编译器会执行该异常。 `Constructor.newInstance` 方法通过将构造函数抛出的任何异常包装在（`checked`）`InvocationTargetException` 中来避免此问题。“

第二种方法保证在任何遵循不雅曝光原则和广告真理原则的节目中都能很好地输入。第一个原则保证编译时的组件类型将是可重用的类型，然后第二个原则保证在运行时返回的通用组件类型必须是在编译时声明的可重用组件类型的子类型。

如果第三种方法的类参数是基本类型，则会引发非法参数异常。这会捕获以下棘手的情况：如果第一个参数是 `int.class`，那么它的类型是 `Class<Integer>`，但新数组的类型为 `int[]`，它不是 `Integer[]` 的子类型。如果 `int.class` 具有 `Class<?>` 类型而不是 `Class<Integer>` 类型，则不会出现此问题，如前一节所述。

作为使用第一种方法的一个例子，下面是一个方法，它将一个集合复制到一个相同类型的新集合中，从而保留参数的类型：

```java
   public static <T, C extends Collection<T>> C copy(C coll) {
     C copy = GenericReflection.newInstance(coll);
     copy.addAll(coll); return copy;
   }
```

调用 `ArrayList<Integer>` 上的副本将返回一个新的 `ArrayList<Integer>`，同时在 `HashSet<String>` 上调用副本将返回一个新的 `HashSet<String>`.

作为使用最后一个方法的一个例子，下面是第 `6.5` 节的 `toArray` 方法，重写它以通过对通用反射库的调用来替换未经检查的强制转换：

```java
   public static <T> T[] toArray(Collection<T> c, T[] a) {
     if (a.length < c.size())
       a = GenericReflection.newArray(a, c.size());
     int i=0; for (T x : c) a[i++] = x;
     if (i < a.length) a[i] = null;
     return a;
   }
```

一般来说，我们建议如果您需要使用未经检查的强制转换，那么您应该将它们封装到少数库方法中，就像我们在这里所做的那样。 不要让未经检查的代码在您的程序中激增！

《《《 [下一节](05_Reflection_for_Generics.md)      <br/>
《《《 [返回首页](../README.md)