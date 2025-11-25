// src/admin/components/SkeletonRow.jsx
export default function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="p-2 border">
        <div className="bg-gray-300 h-16 w-16 mx-auto rounded" />
      </td>
      <td className="p-2 border">
        <div className="bg-gray-300 h-4 w-40 mx-auto rounded" />
      </td>
      <td className="p-2 border">
        <div className="bg-gray-300 h-4 w-20 mx-auto rounded" />
      </td>
      <td className="p-2 border">
        <div className="bg-gray-300 h-4 w-64 mx-auto rounded" />
      </td>
      <td className="p-2 border">
        <div className="bg-gray-300 h-8 w-24 mx-auto rounded" />
      </td>
    </tr>
  );
}
