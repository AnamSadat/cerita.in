export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500" />
      <p className="ml-4">Loading...</p>
    </div>
  );
}
