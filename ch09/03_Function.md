## 功能

函数模式将任意方法转换为对象。函数和相应方法之间的关系类似于 `Comparator` 和 `compareTo` 方法之间的关系。

函数模式的通用版本演示了如何在方法声明的 `throws` 子句中使用类型变量。当一个类的不同实例包含可能引发不同检查异常的方法时，这可能很有用。

回想一下 `Throwable` 类有两个主要的子类 `Exception` 和 `Error`，其中第一个子类有另一个主要的子类 `RuntimeException`。检查异常是否是 `RuntimeException` 或 `Error` 的子类。方法的 `throws` 子句可以列出 `Throwable` 的任何子类，但必须列出方法体可能抛出的任何检查异常，包括为正文中调用的方法声明的任何检查异常。

例 `9-5` 给出了一个在 `throws` 子句中使用类型变量的例子。该示例定义了一个接口 `Function<A,B,X>`，它表示一个函数。接口包含一个方法 `apply`，它接受 `A` 类型的参数，返回类型 `B` 的结果，并且可以抛出类型的异常 `X` 。还有一个包含 `applyAll`方法的类。

例 `9-5`。在 `throws` 子句中输入参数

```java
   import java.util.*;
   import java.lang.reflect.*;
    interface Function<A, B, X extends Throwable> {
      public B apply(A x) throws X;
    }
    class Functions {
      public static <A, B, X extends Throwable> List<B> applyAll(Function<A, B, X> f, List<A> list) throws X {
        List<B> result = new ArrayList<B>(list.size());
        for (A x : list) 
		  result.add(f.apply(x));
        return result;
      }
      public static void main(String[] args) {
        Function<String, Integer, Error> length = new Function<String, Integer, Error>() {
          public Integer apply(String s) {
            return s.length();
          }
        };
        Function<String, Class<?>, ClassNotFoundException> forName = new Function<String, Class<?>, ClassNotFoundException>() {
          public Class<?> apply(String s) throws ClassNotFoundException {
            return Class.forName(s);
          }
        };
        Function<String, Method, Exception> getRunMethod = new Function<String, Method, Exception>() {
          public Method apply(String s) throws ClassNotFoundException,NoSuchMethodException {
            return Class.forName(s).getMethod("run");
          }
        };
        List<String> strings = Arrays.asList(args);
        System.out.println(applyAll(length, strings));
        try { 
		  System.out.println(applyAll(forName, strings)); 
		} catch (ClassNotFoundException e) { 
		  System.out.println(e); 
		}
        try { 
		  System.out.println(applyAll(getRunMethod, strings)); 
		} catch (ClassNotFoundException e) { 
		  System.out.println(e); 
		} catch (NoSuchMethodException e) { 
		  System.out.println(e); 
		} catch (RuntimeException e) { 
		  throw e; 
        } catch (Exception e) { 
		  throw new AssertionError(); 
		}
      }
    }
```

它接受 `List<A>` 类型的参数，返回 `List<B>` 类型的结果，并且可能再次引发 `X` 类型的异常; 该方法在参数列表的每个元素上调用 `apply` 方法来生成结果列表。

该类的主要方法定义了这种类型的三个对象。 第一个是 `Function<String,Integer,Error>` 类型的长度。 它接受一个字符串并返回一个整数，它是给定字符串的长度。 由于它没有引发检查异常，因此第三种类型设置为错误。（将其设置为 `RuntimeException` 也可以。）

第二个是 `forName` 类型的 `Function<String,Class <?>，ClassNotFoundException>`。 它接受一个字符串并返回一个类，即由给定字符串命名的类。 `apply` 方法可能会抛出一个 `ClassNotFoundException`，所以这被当作第三个类型参数。

第三个是 `Function<String,Method,Exception>` 类型的 `getRunMethod`。它接受一个字符串并返回一个方法，即在给定字符串所指定的类中名为 `run` 的方法。该方法的主体可能会引发 `ClassNotFoundException` 或 `NoSuchMethodException`，因此第三个类型参数将被视为 `Exception`，这是包含这两个异常的最小类。

最后一个例子显示了将泛型类型用于异常的主要限制。通常没有合适的类或接口包含函数可能引发的所有异常，因此您不得不重新使用异常，这太笼统，无法提供有用的信息。

主要方法使用 `applyAll` 将三个函数中的每一个应用于字符串列表。三个调用中的每一个都被包装在一个 `try` 语句中，该语句适合于它可能抛出的异常。长度函数没有 `try` 语句，因为它不引发检查异常。 `forName` 函数有一个带有 `ClassNotFoundException` 的 `catch` 子句的 `try` 语句，它可能抛出一种异常。`getRunMethod` 函数需要一个带有 `catch` 子句的 `try` 语句，用于 `ClassNotFoundException` 和 `NoSuchMethodException`，它可能抛出两种异常。但是该函数被声明为抛出 `Exception` 类型，所以我们需要两个额外的“catchall”子句，一个重新抛出引发的任何运行时异常，另一个断言如果发生任何未处理的异常由前三条规定。对于这个特定的例子，不需要重新提升运行时异常，但是如果可能有其他代码处理这些异常，这是一个好习惯。

例如，下面是典型的代码运行，打印长度列表，类别列表和方法列表（最后一个列表为了便于阅读而重新格式化，因为它不适合一行）：

```java
   % java Functions java.lang.Thread java.lang.Runnable
   [16, 18]
   [class java.lang.Thread, interface java.lang.Runnable]
   [public void java.lang.Thread.run(),
   public abstract void java.lang.Runnable.run()]
```

这是一个引发 `NoSuchMethodException` 的运行，因为 `java.util.List` 没有 `run` 方法：

```java
   % java Functions java.lang.Thread java.util.List
   [16, 14]
   [class java.lang.Thread, interface java.util.List]
   java.lang.NoSuchMethodException: java.util.List.run()
```

这是一个引发 `ClassNotFoundException` 的运行，因为没有名为 `Fred` 的类：

```java
   % java Functions java.lang.Thread Fred
   [16, 4]
   java.lang.ClassNotFoundException: Fred
   java.lang.ClassNotFoundException: Fred
```

该异常会引发两次，一次是在应用 `forName` 时，一次是在应用 `getRunMethod` 时引发的。































