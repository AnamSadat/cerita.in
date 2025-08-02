export default function formatDate(story: string) {
  const date = new Date(story);

  const time = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const day = date.toLocaleDateString('id-ID', {
    weekday: 'long',
  });

  const fullDate = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // const formatted = `${day}, ${fullDate} [${time}]`;
  const formatted = {
    day: day,
    fullDate: fullDate,
    time: time,
  };

  return formatted;
}
