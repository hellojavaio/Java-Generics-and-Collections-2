《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](02_Static_Members.md)

### 嵌套类

`Java` 允许将一个类嵌套在另一个类中。 如果外部类具有类型参数，并且内部类不是静态的，则外部类的类型参数在内部类中可见。

例 `4-1` 显示了一个将集合实现为单链表的类。 该类扩展了 `java.util.AbstractCollection`，所以它只需要定义方法的大小，添加和迭代器。 该类包含一个内部
类 `Node`，列表节点和一个实现 `Iterator<E>` 的匿名内部类。 类型参数 `E` 在这两个类的范围内。

例 `4-1`。 类型参数在嵌套非静态类的范围内

```java
public class LinkedCollection<E> extends AbstractCollection<E> {
  private class Node {
    private E element;
    private Node next = null;
    private Node(E elt) { 
      element = elt; 
    }
  }
  private Node first = new Node(null);
  private Node last = first;
  private int size = 0;
  public LinkedCollection() {}
  public LinkedCollection(Collection<? extends E> c) { 
    addAll(c); 
  }
  public int size() { 
    return size; 
  }
  public boolean add(E elt) {
    last.next = new Node(elt); last = last.next; size++;
    return true;
  }
  public Iterator<E> iterator() {
    return new Iterator<E>() {
      private Node current = first;
      public boolean hasNext() {
	return current.next != null;
      }
      public E next() {
	if (current.next != null) {
	  current = current.next;
	  return current.element;
	} else 
	  throw new NoSuchElementException();
      }
      public void remove() {
        throw new UnsupportedOperationException();
      }
    };
  }
}
```

相比之下，例 `4-2` 显示了一个类似的实现，但是这次嵌套的 `Node` 类是静态的，所以类型参数 `E` 不在这个类的范围内。 相反，嵌套类用它自己的类型参数 `T` 
来声明。 在以前的版本引用节点的地方，新版本引用节点 `<E>`。前面例子中的匿名迭代器类也被嵌套的静态类所取代，它也有自己的类型参数。

如果节点类已被公开而不是私有，那么在第一个示例中将节点类称为 `LinkedCollection<E>.Node`，而将第二个例子中的节点类称 `LinkedCollection.Node<E>`。

例 `4-2`。 类型参数不在嵌套静态类的范围内

```java
class LinkedCollection<E> extends AbstractCollection<E> {
  private static class Node<T> {
    private T element;
    private Node<T> next = null;
    private Node(T elt) { 
      element = elt; 
    }
  }
  private Node<E> first = new Node<E>(null);
  private Node<E> last = first;
  private int size = 0;
  public LinkedCollection() {}
  public LinkedCollection(Collection<? extends E> c) { 
    addAll(c); 
  }
  public int size() { 
    return size; 
  }
  public boolean add(E elt) {
    last.next = new Node<E>(elt); last = last.next; size++;
    return true;
  }
  private static class LinkedIterator<T> implements Iterator<T> {
    private Node<T> current;
    public LinkedIterator(Node<T> first) { 
      current = first; 
    }
    public boolean hasNext() {
      return current.next != null;
    }
    public T next() {
      if (current.next != null) {
        current = current.next;
        return current.element;
      } else 
	throw new NoSuchElementException();
    }
    public void remove() {
      throw new UnsupportedOperationException();
    }
  }
  public Iterator<E> iterator() {
    return new LinkedIterator<E>(first);
  }
}
```

在这里描述的两种替代方案中，第二种是优选的。 非静态的嵌套类通过包含对封装实例的引用来实现，因为它们通常可以访问该实例的组件。 静态嵌套类通常既简单又
高效。

《《《 [下一节](04_How_Erasure_Works.md)      <br/>
《《《 [返回首页](../README.md)
