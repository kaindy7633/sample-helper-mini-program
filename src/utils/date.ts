/**
 * 日期时间工具函数
 */

/**
 * 格式化日期时间字符串
 * @param dateTimeStr 日期时间字符串，例如: "2025-03-13 17:04:02"
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(dateTimeStr: string): string {
  if (!dateTimeStr) return "";

  try {
    // 分割日期和时间
    const [datePart, timePart] = dateTimeStr.split(" ");

    // 如果没有时间部分，只返回日期
    if (!timePart) return datePart;

    // 返回格式化后的日期时间
    return `${datePart} ${timePart}`;
  } catch (error) {
    console.error("日期格式化错误:", error);
    return dateTimeStr;
  }
}

/**
 * 格式化日期字符串
 * @param dateStr 日期字符串，例如: "2025-03-13"
 * @returns 格式化后的日期字符串
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";

  try {
    // 处理日期部分，可根据需要自定义格式
    return dateStr;
  } catch (error) {
    console.error("日期格式化错误:", error);
    return dateStr;
  }
}
