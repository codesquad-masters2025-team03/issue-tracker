/**
 * 객체 배열을 받아서 모든 항목에 id 프로퍼티를 부여해 반환
 * label.labelId → label.id
 * milestone.milestoneId → milestone.id
 */
export function mapToUnifiedId(items) {
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    if ('labelId' in item) return { ...item, id: item.labelId };
    if ('milestoneId' in item) return { ...item, id: item.milestoneId };
    return item;
  });
}
