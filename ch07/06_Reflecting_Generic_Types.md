《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](05_Reflection_for_Generics.md)

## 反映泛型类型

反射库提供了一个 `Type` 接口来描述一个通用类型。 有一个类实现了这个接口和四个其他接口来扩展它，对应于五种不同的类型：

  - `Class` 类，表示原始类型或原始类型
  
  - 接口 `ParameterizedType`，表示通用类或接口的参数类型的应用程序，您可以从中提取参数类型的数组
  
  - `TypeVariable` 接口，代表一个类型变量，从中可以提取类型变量的边界
  
  - `GenericArrayType` 接口，表示数组，您可以从中提取数组组件类型
  
  - `WildcardType` 接口，表示通配符，您可以从中抽取通配符的下限或上限
  
通过在每个接口上执行一系列实例测试，您可以确定您拥有哪种类型，并打印或处理类型;我们将很快看到一个例子。

方法可用于将类的超类和超接口作为类型返回，并访问字段的泛型类型，构造函数的参数类型以及方法的参数和结果类型。

您还可以提取代表类或接口声明或泛型方法或构造函数的形式参数的类型变量。类型变量的类型需要一个参数，并写入 `TypeVariable<D>`，其中 `D` 表示声明类型变量的对象的类型。因此，类的类型变量具有类型 `TypeVariable<Class<?>>`，而泛型方法的类型变量具有类型 `TypeVariable<Method>`。可以说，类型参数是令人困惑的，并不是非常有用。由于它对 `6.6` 节中描述的问题负责，因此 `Sun` 可能会在将来删除它。

例 `7-5` 使用这些方法打印出与类关联的所有标题信息。这里有两个使用例子：  

```java
   % java ReflectionDemo java.util.AbstractList
   class java.util.AbstractList<E>
   extends java.util.AbstractCollection<E>
   implements java.util.List<E>
   
   % java ReflectionDemo java.lang.Enum
   class java.lang.Enum<E extends java.lang.Enum<E>>
   implements java.lang.Comparable<E>,java.io.Serializable
```

例 `7-5` 中的代码冗长而直接。 它包含打印类的每个组件的方法：它的超类，它的接口，它的字段和它的方法。 代码的核心是 `printType` 方法，它使用级联的实例测试根据上述五种情况对类型进行分类。

例 `7-5`。 如何操作Type类型

```java
   import java.util.*;
   import java.lang.reflect.*;
   import java.io.*;
    class ReflectionDemo {
      private final static PrintStream out = System.out;
      public static void printSuperclass(Type sup) {
        if (sup != null && !sup.equals(Object.class)) {
          out.print("extends ");
          printType(sup);
          out.println();
        }
      }
      public static void printInterfaces(Type[] impls) {
       if (impls != null && impls.length > 0) {
         out.print("implements ");
         int i = 0;
         for (Type impl : impls) {
           if (i++ > 0) out.print(",");
           printType(impl);
         }
         out.println();
       }
      }
      public static void printTypeParameters(TypeVariable<?>[] vars) {
        if (vars != null && vars.length > 0) {
          out.print("<");
          int i = 0;
          for (TypeVariable<?> var : vars) {
            if (i++ > 0) out.print(",");
            out.print(var.getName());
            printBounds(var.getBounds());
          }
          out.print(">");
        }
      }
      public static void printBounds(Type[] bounds) {
        if (bounds != null && bounds.length > 0 && !(bounds.length == 1 && bounds[0] == Object.class)) {
          out.print(" extends ");
          int i = 0;
          for (Type bound : bounds) {
            if (i++ > 0) out.print("&");
            printType(bound);
          }
        }
      }
      public static void printParams(Type[] types) {
        if (types != null && types.length > 0) {
          out.print("<");
          int i = 0;
          for (Type type : types) {
            if (i++ > 0) out.print(",");
            printType(type);
          }
          out.print(">");
        }
      }
      public static void printType(Type type) {
        if (type instanceof Class) {
          Class<?> c = (Class)type;
          out.print(c.getName());
        } else if (type instanceof ParameterizedType) {
          ParameterizedType p = (ParameterizedType)type;
          Class c = (Class)p.getRawType();
          Type o = p.getOwnerType();
          if (o != null) { printType(o); out.print("."); }
          out.print(c.getName());
          printParams(p.getActualTypeArguments());
        } else if (type instanceof TypeVariable<?>) {
          TypeVariable<?> v = (TypeVariable<?>)type;
          out.print(v.getName());
        } else if (type instanceof GenericArrayType) {
          GenericArrayType a = (GenericArrayType)type;
          printType(a.getGenericComponentType());
          out.print("[]");
        } else if (type instanceof WildcardType) {
          WildcardType w = (WildcardType)type;
          Type[] upper = w.getUpperBounds();
          Type[] lower = w.getLowerBounds();
          if (upper.length == 1 && lower.length == 0) {
            out.print("? extends ");
            printType(upper[0]);
          } else if (upper.length == 0 && lower.length == 1) {
            out.print("? super ");
            printType(lower[0]);
          } else 
	  	  throw new AssertionError();
        }
      }
      public static void printClass(Class c) {
        out.print("class ");
        out.print(c.getName());
        printTypeParameters(c.getTypeParameters());
        out.println();
        printSuperclass(c.getGenericSuperclass());
        printInterfaces(c.getGenericInterfaces());
      }
      public static void main(String[] args) throws ClassNotFoundException {
        for (String name : args) {
          Class<?> c = Class.forName(name);
          printClass(c);
        }
      }
    }
```

如果 `Type` 接口有一个 `toGenericString` 方法，那么大部分代码都是不必要的。 `Sun` 正在考虑这一改变。

《《《 [下一节](../ch08/00_Effective_Generics.md)      <br/>
《《《 [返回首页](../README.md)