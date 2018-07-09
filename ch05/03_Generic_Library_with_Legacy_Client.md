《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](02_Generic_Library_with_Generic_Client.md)

### 具有传统客户端的通用库

现在让我们考虑一下这种情况，即在客户端保留其旧版本时，库更新为泛型。这可能是因为没有足够的时间一次转换所有内容，或者因为类库和客户由不同的组织控制。
这对应于向后兼容性的最重要情况，其中 `Java 5` 的通用集合框架必须仍然可以与针对 `Java 1.4` 中的集合框架编写的传统客户端一起工作。

为了支持进化，每当定义参数化类型时，`Java` 也会识别相应的非参数化类型的类型，称为原始类型。例如，参数化类型 `Stack<E>` 对应于原始类型 `Stack`，参数
化类型 `ArrayStack<E>` 对应于原始类型 `ArrayStack`。

每个参数化类型都是相应原始类型的子类型，因此可以在需要原始类型的位置传递参数化类型的值。通常，传递一个超类型值是一个错误，其中它的子类型的值是预期
的，但是 `Java` 确实允许在需要参数化类型的地方传递一个原始类型的值 - 然而，它通过生成标志来标记这种情况未经检查的转换警告。例如，您可以将 
`Stack<E>` 类型的值分配给 `Stack` 类型的变量，因为前者是后者的子类型。您也可以将 `Stack` 类型的值分配给 `Stack<E>` 类型的变量，但这会生成未经检查
的转换警告。

具体来说，考虑从例 `5-2` 的 `Stack<E>`，`ArrayStack<E>` 和 `Stacks` 的通用源（例如，在目录 `g` 中）使用来自例 `5-1` 的 `Client` 的遗留源（例
如，在目录 `l`）。 `Sun` 的 `Java 5` 编译器会产生以下消息：

```java
   % javac g/Stack.java g/ArrayStack.java g/Stacks.java l/Client.java
   Note: Client.java uses unchecked or unsafe operations.
   Note: Recompile with -Xlint:unchecked for details.
```

未经检查的警告表明，编译器无法提供与泛型在统一使用时相同的安全保证。 但是，当通过更新遗留代码生成通用代码时，我们知道从两者都生成了等效的类文件，因此
（即使未经检查的警告）使用通用库运行旧版客户端将产生与运行旧版客户端相同的结果 与遗留类库。 在这里，我们假设更新类库的唯一改变是引入泛型，并且不
管是故意还是错误地引入行为改变。

例 `5-2`。 具有通用客户端的通用库

```java
   g/Stack.java:
     interface Stack<E> {
       public boolean empty();
       public void push(E elt);
       public E pop();
     }
   
   g/ArrayStack.java:
     import java.util.*;
     class ArrayStack<E> implements Stack<E> {
      private List<E> list;
	  public ArrayStack() { list = new ArrayList<E>(); }
      public boolean empty() { return list.size() == 0; }
      public void push(E elt) { list.add(elt); }
      public E pop() {
		E elt = list.remove(list.size()-1);
		return elt;
	  }
	  public String toString() { return "stack"+list.toString(); }
     }
    
   g/Stacks.java:
     class Stacks {
	   public static <T> Stack<T> reverse(Stack<T> in) {
	     Stack<T> out = new ArrayStack<T>();
		 while (!in.empty()) {
		   T elt = in.pop();
		   out.push(elt);
		 }
		 return out;
	   }
	 }
	 
   g/Client.java:
     class Client {
     public static void main(String[] args) {
	Stack<Integer> stack = new ArrayStack<Integer>();
	for (int i = 0; i<4; i++) stack.push(i);
	  assert stack.toString().equals("stack[0, 1, 2, 3]");
	  int top = stack.pop();
	  assert top == 3 && stack.toString().equals("stack[0, 1, 2]");
	  Stack<Integer> reverse = Stacks.reverse(stack);
	  assert stack.empty();
	  assert reverse.toString().equals("stack[2, 1, 0]");
	}
 }
```

如果我们遵循上面的建议，并在启用适当的开关的情况下重新运行编译器，我们会得到更多的细节：

```java
   % javac -Xlint:unchecked g/Stack.java g/ArrayStack.java \
   % g/Stacks.java l/Client.java
   l/Client.java:4: warning: [unchecked] unchecked call
   to push(E) as a member of the raw type Stack
   for (int i = 0; i<4; i++) stack.push(new Integer(i));
									   ^
   l/Client.java:8: warning: [unchecked] unchecked conversion
   found : Stack
   required: Stack<E>
   Stack reverse = Stacks.reverse(stack);
								  ^
   l/Client.java:8: warning: [unchecked] unchecked method invocation:
   <E>reverse(Stack<E>) in Stacks is applied to (Stack)
   Stack reverse = Stacks.reverse(stack);
								  ^
   3 warnings
```

并非每种原始类型都会引发警告。因为每个参数化类型都是相应原始类型的子类型，但是相反，传递一个参数化类型（其中原始类型是预期的）是安全的（因此，没有警
告来获得反向结果），但是将原始类型传递给参数化预期类型会发出警告（因此，传递参数时会发出警告）;这是替代原则的一个例子。当我们在原始类型的接收者上调用
方法时，该方法被视为类型参数是通配符，因此从原始类型获取值是安全的（因此，不会弹出调用 `pop` 的警告），而是将原始类型的值会发出警告（因此，调用 
`push` 的警告）;这是获取和放置原则的一个实例。

即使您没有编写任何通用代码，您仍可能会遇到进化问题，因为其他人已经使其代码生成了基因。这会影响使用已由 `Sun` 进行基因化的集合框架的遗留代码的所有人。
因此，在旧版客户端中使用泛型库最重要的情况是使用 `Java 5` 集合框架和为 `Java 1.4` 集合框架编写的遗留代码。

特别是，在示例 `5-1` 中将 `Java 5` 编译器应用于遗留代码时，也会发出未经检查的警告，因为传统类 `ArrayStack` 中使用了基本化的类 `ArrayList`。下面是
当我们用 `Java 5` 编译器和库编译所有文件的旧版本时发生的情况：

```java
   % javac -Xlint:unchecked l/Stack.java l/ArrayStack.java \
   % l/Stacks.java l/Client.java
   l/ArrayStack.java:6: warning: [unchecked] unchecked call to add(E)
   as a member of the raw type java.util.List
   public void push(Object elt) list.add(elt);
										 ^
   1 warning
```

在这里，传统方法 `push` 中使用泛型方法 `add` 的警告是由于类似于从旧客户端发出使用泛型方法 `push` 的先前警告的原因而发布的。

将编译器配置为反复发出您打算忽略的警告是一种很不好的做法。 这会让人分心，更糟的是，它可能会导致你忽视需要注意的警告 - 就像在狼的小男孩的寓言中一样。 
在纯代码的情况下，可以使用 `-source 1.4` 开关关闭此类警告：

```java
   % javac -source 1.4 l/Stack.java l/ArrayStack.java \
   % l/Stacks.java l/Client.java
```

这编译了遗留代码并且没有发出警告或错误。 这种关闭警告的方法只适用于真正的遗留代码，没有 `Java 5` 中引入的通用功能或其他功能。 也可以使用注释关闭未经
检查的警告，如下一节所述，即使使用 `Java 5` 中引入的功能，也可以使用这些警告。

《《《 [下一节](04_Legacy_Library_with_Generic_Client.md)      <br/>
《《《 [返回首页](../README.md)
