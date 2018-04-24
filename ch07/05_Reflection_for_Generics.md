《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](04_A_Generic_Reflection_Library.md)

### 泛型的反思

泛型以两种方式改变反射库。 我们已经讨论了反射的泛型，其中 `Java` 为类 `Class<T>` 添加了一个类型参数。 我们现在讨论泛型的反射，其中 `Java` 添加了支
持访问泛型类型的方法和类。

例 `7-2` 显示了泛型使用反射的简单演示。 它使用反射来查找与给定名称关联的类，并使用反射库类 `Field`，`Constructor` 和 `Method` 打印出与该类关联的字
段，构造函数和方法。 两种不同的方法可用于将字段，构造函数或方法转换为用于打印的字符串：旧的 `toString` 方法和新的 `toGenericString` 方法。 旧方法
主要是为了向后兼容性而维护的。 示例 `7-3` 中显示了一个小样本类，示例 `7-4` 中显示了使用此类运行的示例。

例 `7-2`。 对泛型的反思

```java
   import java.lang.reflect.*;
   import java.util.*;
    class ReflectionForGenerics {
      public static void toString(Class<?> k) {
        System.out.println(k + " (toString)");
        for (Field f : k.getDeclaredFields())
          System.out.println(f.toString());
        for (Constructor c : k.getDeclaredConstructors())
          System.out.println(c.toString());
        for (Method m : k.getDeclaredMethods())
          System.out.println(m.toString());
        System.out.println();
      }
      public static void toGenericString(Class<?> k) {
        System.out.println(k + " (toGenericString)");
        for (Field f : k.getDeclaredFields())
          System.out.println(f.toGenericString());
        for (Constructor c : k.getDeclaredConstructors())
          System.out.println(c.toGenericString());
        for (Method m : k.getDeclaredMethods())
          System.out.println(m.toGenericString());
        System.out.println();
      }
      public static void main (String[] args) throws ClassNotFoundException {
        for (String name : args) {
          Class<?> k = Class.forName(name);
          toString(k);
          toGenericString(k);
        }
      }
    }
```

例 `7-3`。 示例类

```java
   class Cell<E> {
     private E value;
     public Cell(E value) { this.value=value; }
     public E getValue() { return value; }
     public void setValue(E value) { this.value=value; }
     public static <T> Cell<T> copy(Cell<T> cell) {
       return new Cell<T>(cell.getValue());
     }
   }
```

例 `7-4`。 示例运行

```java
   % java ReflectionForGenerics Cell
   class Cell (toString)
   private java.lang.Object Cell.value
   public Cell(java.lang.Object)
   public java.lang.Object Cell.getValue()
   public static Cell Cell.copy(Cell)
   public void Cell.setValue(java.lang.Object)
   class Cell (toGenericString)
   private E Cell.value
   public Cell(E)
   public E Cell.getValue()
   public static <T> Cell<T> Cell.copy(Cell<T>)
   public void Cell.setValue(E)
```

示例运行表明，尽管对象和类标记的实体化类型信息不包含有关泛型的信息，但该类的实际字节码确实可以对有关泛型和擦除类型的信息进行编码。 关于泛型类型的信息
本质上是一个评论。 运行代码时将被忽略，并且仅保留用于反射。

不幸的是，类 `Class` 没有 `toGenericString` 方法，尽管这会很有用。 `Sun` 正在考虑在未来增加这种方法。 同时，所有必要的信息都是可用的，我们将在下一
部分解释如何访问它。

《《《 [下一节](06_Reflecting_Generic_Types.md)      <br/>
《《《 [返回首页](../README.md)