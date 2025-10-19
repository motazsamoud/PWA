export const parseSortString = (sort: string | undefined | null) => {
  if (!sort) {
    return { createdAt: -1 };
  }

  const sortObject = {};
  const sortFields = sort.split(',');

  for (const field of sortFields) {
    const [key, order] = field.split(':');
    if (key && (order === 'asc' || order === 'desc')) {
      sortObject[key] = order === 'asc' ? 1 : -1;
    }
  }

  return Object.keys(sortObject).length > 0 ? sortObject : { createdAt: -1 };
};