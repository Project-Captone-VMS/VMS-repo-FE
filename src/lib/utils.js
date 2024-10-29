import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Sử dụng một function duy nhất kết hợp cả hai chức năng
export function cn(...inputs) {
  // Lọc bỏ các giá trị falsy và merge classes với tailwind
  return twMerge(clsx(inputs))
}

// Nếu bạn muốn có function thứ hai, đặt tên khác
export function mergeClasses(...classes) {
  return classes.filter(Boolean).join(' ')
}