## 异常处理

在 `try` 语句中，每个 `catch` 子句检查抛出的异常是否与给定的类型匹配。 这与实例测试执行的检查相同，因此也适用相同的限制：该类型必须是可验证的。 此外，
`catch` 子句中的类型必须是 `Throwable` 的子类。 由于创建不能出现在 `catch` 子句中的 `Throwable` 的子类没什么意义，因此如果您尝试创建 `Throwable`
的参数化子类，`Java` 编译器会发出警告。

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




















