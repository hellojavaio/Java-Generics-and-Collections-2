《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](03_Generic_Library_with_Legacy_Client.md)

### 具有通用客户端的旧版库

在客户端之前更新库通常是有意义的，但可能会出现您希望以其他方式进行更新的情况。 例如，您可能负责维护客户而不是类库; 或者类库可能很大，因此您可能需要逐
步更新，而不是一次全部更新; 或者你可能有类库的类文件，但没有源文件。

在这种情况下，更新库以在其方法签名中使用参数化类型是有意义的，但不能更改方法体。 有三种方法可以实现这一点：对源代码进行最小限度的更改，创建存根文件或
使用包装器。我们建议在仅有权访问类时有权访问源代码和使用存根时使用最少的更改 文件，我们建议不要使用包装。


### 用最小的变化来演变一个类库

示例 `5-3` 显示了最小更改技术。 这里库的来源已经被编辑过，但只是为了改变方法签名，而不是方法体。 所需的确切更改以粗体显示。 当您有权访问源时，推荐使
用这种技术来使库变得通用。

确切地说，所需的改变是：

   - 根据需要为接口或类声明添加类型参数（对于接口 `Stack<E>` 和类 `ArrayStack<E>`）
    
   - 将类型参数添加到扩展或实现子句中的任何新参数化接口或类（对 `ArrayStack<E>` 的 `implements` 子句中的 `Stack<E>`），
    
   - 根据需要为每个方法签名添加类型参数（用于在 `Stack<E>` 和 `ArrayStack<E>` 中进行推入和弹出操作，并在堆栈中进行反向操作）
    
   - 在返回类型包含一个类型参数（对于在 `ArrayStack<E>` 中弹出，其中返回类型为 `E`）的每个返回中添加一个未经检查的强制转换 - 没有此强制转换的情况
   下，您将得到一个错误而不是未经检查的警告
    
   - 可选择添加批注以抑制未经检查的警告（对于 `ArrayStack<E>` 和 `Stacks`）
	
值得注意的是我们不需要做出一些改变。 在方法体中，我们可以保留 `Object` 的出现（参见 `ArrayStack` 中的第一行 `pop`），并且我们不需要为任何出现的raw
类型添加类型参数（请参阅 `Stacks` 中的第一行）。 此外，只有当返回类型是类型参数（如 `pop` 中）时，我们才需要将转换添加到 `return` 子句中，但是当返
回类型是参数化类型时（如反向），则不需要添加转换。

通过这些更改，库将成功编译，但它会发出一些未经检查的警告。 按照最佳做法，我们评论了代码以指示哪些行触发了此类警告：	

```java
   % javac -Xlint:unchecked m/Stack.java m/ArrayStack.java m/Stacks.java
   m/ArrayStack.java:7: warning: [unchecked] unchecked call to add(E)
   as a member of the raw type java.util.List
      public void push(E elt) list.add(elt); // unchecked call
									   ^
   m/ArrayStack.java:10: warning: [unchecked] unchecked cast
   found : java.lang.Object
   required: E
			return (E)elt; // unchecked cast
				      ^
   m/Stacks.java:7: warning: [unchecked] unchecked call to push(T)
   as a member of the raw type Stack
		  out.push(elt); // unchecked call
				   ^
   m/Stacks.java:9: warning: [unchecked] unchecked conversion
   found : Stack
   required: Stack<T>
		return out; // unchecked conversion
			   ^
   4 warnings
```

为了表明我们期望在编译库类时获得未经检查的警告，源已被注释以禁止此类警告。

```java
@SuppressWarnings("unchecked");
```

（在 `Java 5` 的早期版本的 `Sun` 编译器中，压制警告注释不起作用。）这可以防止编译器哭泣狼 - 我们已经告诉它不要发出我们期望的未经检查的警告，因此很容
易发现任何 我们并不期望。特别是，一旦我们更新了类库，我们不应该看到客户的任何未经检查的警告。 还要注意，我们已经禁止了库类的警告，但是不在客户端上。

例 `5-3`。 使用最小的变化来发展一个类库

```
   m/Stack.java:
    interface Stack<E> {
      public boolean empty();
      public void push(E elt);
      public E pop();
    }
   
   m/ArrayStack.java:
     @SuppressWarnings("unchecked")
     class ArrayStack<E> implements Stack<E> {
	   private List list;
       public ArrayStack() { list = new ArrayList(); }
       public boolean empty() { return list.size() == 0; }
       public void push(E elt) { list.add(elt); } // unchecked call
       public E pop() {
		 Object elt = list.remove(list.size()-1);
		 return (E)elt; // unchecked cast
	  }
      public String toString() { return "stack"+list.toString(); }
    }
   
   m/Stacks.java:
    @SuppressWarnings("unchecked")
    class Stacks {
      public static <T> Stack<T> reverse(Stack<T> in) {
	    Stack out = new ArrayStack();
	    while (!in.empty()) {
	      Object elt = in.pop();
		  out.push(elt); // unchecked call
        }
	    return out; // unchecked conversion
      }
   }
```

消除（而不是抑制）编译库生成的未经检查的警告的唯一方法是更新整个库源以使用泛型。 这是完全合理的，因为除非更新整个源代码，否则编译器无法检查声明的通用
类型是否正确。 事实上，未经检查的警告是警告 - 而不是错误 - 主要是因为它们支持使用这种技术。 只有在您确定通用签名实际上是正确的时才使用此技术。 最好的
做法是只使用这种技术作为不断发展的代码在整个过程中使用泛型的中间步骤。

例 `5-4`。 使用存根发展类库

```java
   s/Stack.java:
    interface Stack<E> {
      public boolean empty();
      public void push(E elt);
      public E pop();
    }
	
   s/StubException.java:
    class StubException extends UnsupportedOperationException {}	
	
   s/ArrayStack.java:
    class ArrayStack<E> implements Stack<E> {
      public boolean empty() { throw new StubException(); }
      public void push(E elt) { throw new StubException(); }
      public E pop() { throw new StubException(); }
      public String toString() { throw new StubException(); }
    }	
	
   s/Stacks.java:
    class Stacks {
      public static <T> Stack<T> reverse(Stack<T> in) {
        throw new StubException();
      }
    }	
```

### 使用存根演化库

示例 `5-4` 中显示了存根技术。 在这里，我们编写了具有通用签名但不包含 `body` 的存根。我们针对通用签名编译通用客户端，但针对遗留类文件运行代码。 这种
技术适用于源未发布或其他人负责维护源的情况。

确切地说，除了我们完全删除所有可执行代码，用抛出StubException的代码替换每个方法体（一个扩展了 `UnsupportedOperationException` 的新异常）之外，我
们对接口和类声明和方法签名引入了与最小变更技术相同的修改。。

当我们编译通用客户端时，我们这样做是针对从存根代码生成的类文件，它包含适当的通用签名（比如在目录 `s` 中）。 当我们运行客户端时，我们会对原始的旧类文
件（比如在目录 `l` 中）进行这种操作。

```java
   % javac -classpath s g/Client.java
   % java -ea -classpath l g/Client
```

再说一遍，这是有效的，因为为传统文件和通用文件生成的类文件基本相同，除了关于类型的辅助信息。 特别是，客户端编译的通用签名与传统签名（除了关于类型参数
的辅助信息）相匹配，因此代码可以成功运行并提供与以前相同的答案。

### 使用包装进化库

例 `5-5` 给出了这个包装技术。 在这里，我们保留原有的源文件和类文件不变，并提供通过代理访问遗留类的通用包装类。我们主要介绍这种技术，主要是为了警告您
不要使用它 - 通常最好使用最少的更改或存根。

这个技术创建了一个通用接口和包装类的并行层次结构。确切地说，我们创建了一个与传统接口 `Stack` 相对应的新接口 `GenericStack`，我们创建了一个新类 
`GenericWrapperClass` 来访问旧版实现 `ArrayStack`，并且创建了一个与传统便利类 `Stacks` 相对应的新类 `GenericStacks`。

通用接口GenericStack是通过以前部分中用于更新签名以使用泛型的相同方法从传统接口Stack派生而来的。另外，添加了一个新的解包方法，从包装器中提取旧的实
现。

包装类 `GenericStackWrapper<E>` 通过委托给 `Stack` 来实现 `GenericStack<E>`。构造函数需要一个实现遗留接口 `Stack` 的实例，该接口存储在专用字段
中，并且 `unwrap` 方法返回此实例。由于使用了委托，因此可以通过所提供的通用堆栈视图查看对基础传统堆栈所做的任何更新由包装。


包装器通过调用相应的遗留方法来实现接口中的每个方法（空，`push`，`pop`）; 并且类似地在遗留类（`toString`）中重写的 `Object` 中实现每个方法。 至于最
小的变化，当返回类型包含一个类型参数时（如在 `pop` 中），我们向 `return` 语句添加一个未检查的转换; 没有这个演员，你会得到一个错误，而不是一个未经检
查的警告。

单个包装器就可以满足同一接口的多个实现。 例如，如果我们有 `Stack` 的 `ArrayStack` 和 `LinkedStack` 实现，我们可以使用 
`GenericStackWrapper<E>`。

新的便捷类 `GenericStacks` 通过委派给遗留类 `Stacks` 来实现。 通用的反向方法展开它的参数，调用传统的反向方法并包装其结果。

粗体显示了示例 `5-5` 中客户端所需的更改。

与最小变化或存根相比，包装具有许多缺点。 包装需要维护两个并行层次结构，一个是传统接口和类，另一个是通用接口和类。 通过在这些之间进行包装和解开来进行
转换可能变得乏味。 如果遗传类正确生成，那么将需要进一步的工作来移除冗余包装。

例 `5-5`。 使用包装器发展一个库

```java
   //不要这样做---不推荐使用包装类
   l/Stack.java, l/Stacks.java, l/ArrayStack.java:
   // As in Example 5.1
   w/GenericStack.java:
    interface GenericStack<E> {
      public Stack unwrap();
      public boolean empty();
      public void push(E elt);
      public E pop();
    }
   w/GenericStackWrapper.java:
    @SuppressWarnings("unchecked")
    class GenericStackWrapper<E> implements GenericStack<E> {
      private Stack stack;
      public GenericStackWrapper(Stack stack) { this.stack = stack; }
      public Stack unwrap() { return stack; }
      public boolean empty() { return stack.empty(); }
      public void push(E elt) { stack.push(elt); }
      public E pop() { return (E)stack.pop(); } // unchecked cast
      public String toString() { return stack.toString(); }
    }
   w/GenericStacks.java:
    class GenericStacks {
      public static <T> GenericStack<T> reverse(GenericStack<T> in) {
      Stack rawIn = in.unwrap();
      Stack rawOut = Stacks.reverse(rawIn);
      return new GenericStackWrapper<T>(rawOut);
      }
    }
   w/Client.java:
    class Client {
      public static void main(String[] args) {
        GenericStack<Integer> stack = new GenericStackWrapper<Integer>(new ArrayStack());
        for (int i = 0; i<4; i++) stack.push(i);
        assert stack.toString().equals("stack[0, 1, 2, 3]");
        int top = stack.pop();
        assert top == 3 && stack.toString().equals("stack[0, 1, 2]");
        GenericStack<Integer> reverse = GenericStacks.reverse(stack);
        assert stack.empty();
        assert reverse.toString().equals("stack[2, 1, 0]");
      }
    }
```

包装也呈现更深和更微妙的问题。 如果代码使用对象标识，则可能会出现问题，因为遗留对象和包装对象是不同的。 此外，复杂的结构将需要多层包装纸。 想象一下，
将这种技术应用于一堆堆栈！ 您需要定义一个两层包装器，它将每个二级堆栈压入或解开，因为它被压入或弹出顶层堆栈。 因为包装对象和遗留对象是不同的，所以始
终确保包装对象查看对旧对象的所有更改可能很难甚至不可能。

通过确保遗留对象和泛型对象相同，`Java` 泛型的设计避免了包装器的所有这些问题。 `C#` 泛型的设计有很大的不同：遗留类和泛型类是完全不同的，任何结合遗留
集合和泛型集合的尝试都会碰到这里讨论的包装器的困难。

《《《 [下一节](05_Conclusions.md)      <br/>
《《《 [返回首页](../README.md)
