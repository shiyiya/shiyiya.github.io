

- [m.143. 重排链表](https://leetcode-cn.com/problems/reorder-list/)

```java
    public ListNode middleNode(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }

    public ListNode reverseList(ListNode head) {
        ListNode pre = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = pre;
            pre = curr;
            curr = next;
        }
        return pre;
    }

    //m.143. 重排链表
    public void reorderList(ListNode head) {
        if (head == null) return;
        ListNode middleNode = middleNode(head);
        ListNode sub = reverseList(middleNode.next);
        middleNode.next = null;

        while (head != null && sub != null) {
            ListNode next = head.next;
            ListNode subnext = sub.next;
            head.next = sub;
            head = next;

            sub.next = next;
            sub = subnext;

        }
    }
```