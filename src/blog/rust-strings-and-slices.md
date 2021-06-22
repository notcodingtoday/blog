<h1>Understanding Strings and slices in Rust</h1>
<div class="center">2021-06-22</div>

## Strings?

I was reading through Rust's excellent [official book](https://doc.rust-lang.org/stable/book/) to study Rust for the first time. Chapter [04-03](https://doc.rust-lang.org/book/ch04-03-slices.html) of the book covers the `slice` type in Rust.

I did not manage to understand `String` in Rust with the contents of the book itself. Never in my life I had spent this much time to understand `String` in a language.

## `reference` is a type of its own

My first question after reading the chapter was: how does making `slice` into `&slice` suddenly make it bear length information?

To make this easier to swallow [reference](https://doc.rust-lang.org/std/primitive.reference.html) itself is a unique primitive type in Rust. This made it easy for me to accept the fact that `&T` can implement different properties to `T` (ex. `str` does not implement trait `Sized` but `&str` does).

## `slice` != `array`, data in `slice` is from an `array`

Both are primitive types in Rust and sound similar, but they are two different concepts.

[`slice`](https://doc.rust-lang.org/std/primitive.slice.html) is a 'contiguous block of memory of type `T`', and has no compile time definition. [`array`](https://doc.rust-lang.org/std/primitive.array.html) is a fixed-size array, with compile time size.

Think of `slice` as "a contiguous subset of an array". `slice` itself is purely conceptual and data itself actually comes from an `array`.

```rust
// This is an array, not a slice. You can think of them as C-style arrays.
let arr: [u8; 3] = [1, 2, 3];
// This is a reference to a slice.
let slice: &[u8]: &arr[..];
```

## `str` is literally `[u8]` with UTF-8 value checking

`[u8]` == contiguous block of memory (slice) of type `u8`. `str` is essentially `[u8]` but has UTF-8 boundary checks built-in. `String` is essentially `str`, but not a conceptual contiguous subset of an array, but a real one.

## `slice` makes `array` adhere to Rust's ownership rules

Why does `slice` exist?

The book it covers how to get n-th word in a String. Imagine writing such thing in C, you probably will write a function that returns start and end `char*`. If, for any reason, the original `char` array is freed from the heap, then using those pointers would cause problems.

Concept of subset of array (slice) prevents this - having a _reference_ to `slice` (subset of array) will ensure the following code does not compile thanks to Rust's ownership rules:

```rust
fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}

fn main() {
    let mut s = String::from("hello world");

    // if this was just index(es), will compile
    let word = first_word(&s);

    // Reference to slice (subset of array) is tied to the original 
    // array, so compiler will throw error if you do any illegal 
    // things with references.
    s.clear();  // error!

    println!("the first word is: {}", word);
}
```

If we only had arrays and had to follow Rust's ownership rules, we would be making copies around all the time, which would be expensive.

## Putting it all together

`slice` is a contiguous subset of `array`. `str` is essentially `[u8]`. `slice` exist to help `array` follow Rust ownership rules.

Think of `slice` like pointer to an existing `array`, but you are not allowed to use the pointer by itself. Note: `slice` is not a pointer, it is a unique primitive type of its own.

From my understanding, `String` was created so that we can treat it like a `slice` but provide easy way for engineers to declare strings. Don't quote me on this part :P

## My honest review of Rust so far

I am very impressed by how well-written the book is and great documentation. I am having tremendously better experience learning Rust compared to learning Vulkan.

I am not 100% convinced Rust-way to code is superior to traditional C-style. It feels like we just transformed the problems of C (memory management) into another shape (ownership). I, at this point in time, cannot comment if that is true nor optimal.
