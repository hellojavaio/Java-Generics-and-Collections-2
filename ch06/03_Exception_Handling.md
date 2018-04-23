《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](02_Instance_Tests_and_Casts.md)

### 异常处理

在 `try` 语句中，每个 `catch` 子句检查抛出的异常是否与给定的类型匹配。 这与实例测试执行的检查相同，因此也适用相同的限制：该类型必须是可验证的。 此
外，`catch` 子句中的类型必须是 `Throwable` 的子类。 由于创建不能出现在 `catch` 子句中的 `Throwable` 的子类没什么意义，因此如果您尝试创建 
`Throwable` 的参数化子类，`Java` 编译器会发出警告。

例如，下面是一个新的异常的允许定义，它包含一个整数值：

```java
   class IntegerException extends Exception {
     private final int value;
     public IntegerException(int value) { this.value = value; }
     public int getValue() { return value; }
   }
```

这里是一个简单的例子，说明如何使用异常：

```java
   class IntegerExceptionTest {
     public static void main(String[] args) {
       try {
         throw new IntegerException(42);
       } catch (IntegerException e) {
         assert e.getValue() == 42;
       }
     }
    }
```

`try` 语句的主体用 `catch` 语句捕获的给定值抛出异常。

相反，以下定义的新异常是禁止的，因为它创建了一个参数化类型：

```java
   class ParametricException<T> extends Exception { // 编译报错
     private final T value;
     public ParametricException(T value) { this.value = value; }
     public T getValue() { return value; }
   }
```

试图编译上述报告错误：

```java
   % javac ParametricException.java
   ParametricException.java:1: a generic class may not extend
   java.lang.Throwable
   class ParametricException<T> extends Exception { // 编译报错
                                        ^
   1 error
```

这种限制是明智的，因为几乎任何捕捉这种异常的尝试都必须失败，因为该类型不可确定。 人们可能会期望典型的例外使用如下所示：

```java
   class ParametricExceptionTest {
     public static void main(String[] args) {
       try {
         throw new ParametricException<Integer>(42);
       } catch (ParametricException<Integer> e) { // compile-time error
         assert e.getValue()==42;
       }
     }
   }
```

这是不允许的，因为 `catch` 子句中的类型是不可确定的。 在撰写本文时，`Sun` 编译器在这种情况下报告了一系列语法错误：

```java
   % javac ParametricExceptionTest.java
   ParametricExceptionTest.java:5: <identifier> expected
   } catch (ParametricException<Integer> e) {
                               ^
   ParametricExceptionTest.java:8: ')' expected
   }
   ^
   ParametricExceptionTest.java:9: '}' expected
   }
   ^
   3 errors
```

由于异常不能是参数化的，因此语法受到限制，因此必须将该类型编写为标识符，而没有以下参数。

在 `Throwable` 子句中输入变量虽然 `Throwable` 的子类不能是参数化的，但可以在方法声明的 `throws` 子句中使用类型变量。此技术在第 `9.3` 节中说明。

《《《 [下一节](04_Array_Creation.md)      <br/>
《《《 [返回首页](../README.md)
