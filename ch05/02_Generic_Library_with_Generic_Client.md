## 具有通用客户端的通用库

接下来，我们更新库和客户端以使用泛型，如例 `5-2` 中所示。 这是用于 `Java 5` 及其集合版框架的通用代码。 接口现在接受一个类型参数，变成 `Stack<E>`（类似于 `List<E>`），实现类也变为 `ArrayStack<E>`（类似于 `ArrayList<E>`），但没有添加类型参数 实用工具类 `Stacks`（类似于 `Collections`）。 `push` 和 `pop` 的签名和主体中的 `Object` 类型由类型参数 `E` 替换。 请注意，`ArrayStack` 中的构造函数不需要类型参数。 在实用程序类中，反向方法变为带有参数和 `Stack<T>` 类型结果的泛型方法。 适当的类型参数被添加到客户端，现在隐式装箱和取消装箱。

简而言之，转换过程非常简单：只需添加一些类型参数，并用适当的类型变量替换 `Object` 的出现即可。 通过比较两个示例中突出显示的部分，可以发现传统版本和通用版本之间的所有差异。 泛型的实现设计为使两个版本生成基本上相同的类文件。 有些类型的辅助信息可能会有所不同，但要执行的实际字节码将是相同的。 因此，执行遗留版本和通用版本会产生相同的结果。 正如我们接下来讨论的那样，传统和普通资源产生相同类文件的事实可以简化进化过程。

例 `5-1`。 传统客户端的旧版库

```java
   l/Stack.java:
	 interface Stack {
	   public boolean empty();
	   public void push(Object elt);
	   public Object pop();
	 }
   l/ArrayStack.java:
	import java.util.*;
	class ArrayStack implements Stack {
	  private List list;
	  public ArrayStack() { list = new ArrayList(); }
	  public boolean empty() { return list.size() == 0; }
	  public void push(Object elt) { list.add(elt); }
	  public Object pop() {
	    Object elt = list.remove(list.size()-1);
	    return elt;
	  }
	  public String toString() { return "stack"+list.toString(); }
	}
   l/Stacks.java:
	class Stacks {
	  public static Stack reverse(Stack in) {
		Stack out = new ArrayStack();
		while (!in.empty()) {
		  Object elt = in.pop();
		  out.push(elt);
		}
		return out;
	  }
	}
	l/Client.java:
     class Client {
       public static void main(String[] args) {
         Stack stack = new ArrayStack();
         for (int i = 0; i<4; i++) stack.push(new Integer(i));
         assert stack.toString().equals("stack[0, 1, 2, 3]");
         int top = ((Integer)stack.pop()).intValue();
         assert top == 3 && stack.toString().equals("stack[0, 1, 2]");
         Stack reverse = Stacks.reverse(stack);
         assert stack.empty();
         assert reverse.toString().equals("stack[2, 1, 0]");
       }
     }
```

