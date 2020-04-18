var deleteNode = function(head, val) {
  if (head.next === null || head.val === val) { return head }

  let prev = {
    val: -99,
    next: head
  }
  let helper = prev

  while (helper.next) {
    if (helper.next.val === val) {
      helper.next = helper.next.next || null
    }

    helper = helper.next
  }

  return prev.next
};

const h = {
  val: 4,
  next: {
    val: 5,
    next: {
      val: 1,
      next: {
        val: 9,
        next: null
      }
    }
  }
}
console.log(deleteNode(h, 5))